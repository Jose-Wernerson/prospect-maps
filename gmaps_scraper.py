"""
gmaps_scraper.py — Prospect Maps Lead Scraper
Autor: José Wernerson / SquadTech Services

Uso:
  python gmaps_scraper.py --nicho "oficina mecanica" --cidade "Fortaleza CE" --max 40
  python gmaps_scraper.py --nicho "academia" --cidade "Juazeiro do Norte CE"

Saída:
  leads_<nicho>_<cidade>_<timestamp>.csv  → pronto para importar no Prospect Maps
"""

import argparse
import csv
import json
import os
import re
import sys
import time
import uuid
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------------------------
# Dependências — instala automaticamente se necessário
# ---------------------------------------------------------------------------
def ensure_deps():
    import subprocess
    pkgs = ["playwright", "rich"]
    for pkg in pkgs:
        try:
            __import__(pkg.split("[")[0])
        except ImportError:
            print(f"[setup] Instalando {pkg}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])
    # Instala browsers do playwright se necessário
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            p.chromium.executable_path  # só verifica — não abre
    except Exception:
        print("[setup] Instalando Chromium para Playwright...")
        subprocess.check_call([sys.executable, "-m", "playwright", "install", "chromium"])

ensure_deps()

# ---------------------------------------------------------------------------
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
from rich.table import Table
from rich import print as rprint

console = Console()

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def uid():
    return str(uuid.uuid4())[:8]

def clean_phone(raw: str) -> str:
    """Remove tudo que não é dígito."""
    return re.sub(r"\D", "", raw or "")

def has_site(url: str) -> str:
    """Retorna 'Sim' ou 'Não' baseado no site encontrado."""
    if not url:
        return "Não"
    skip = ["google.com", "facebook.com", "instagram.com", "maps.google"]
    return "Não" if any(s in url for s in skip) else "Sim"

def slug(text: str) -> str:
    """Slug seguro para nome de arquivo."""
    return re.sub(r"[^\w]", "_", text.lower()).strip("_")[:30]

# ---------------------------------------------------------------------------
# Scraper principal
# ---------------------------------------------------------------------------
def scrape_maps(nicho: str, cidade: str, max_leads: int = 40, headless: bool = True) -> list[dict]:
    query = f"{nicho} em {cidade}"
    url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"

    leads = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=headless,
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled"],
        )
        ctx = browser.new_context(
            locale="pt-BR",
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 800},
        )
        page = ctx.new_page()

        console.print(f"\n[bold cyan]🗺  Abrindo Google Maps:[/] {query}")
        page.goto(url, wait_until="domcontentloaded", timeout=30_000)
        time.sleep(2)

        # Fecha popup de cookies se aparecer
        for sel in ['button[aria-label*="Accept"]', 'button[aria-label*="Aceitar"]', 'form:nth-child(2) button']:
            try:
                page.click(sel, timeout=2000)
                break
            except Exception:
                pass

        # Aguarda lista de resultados
        try:
            page.wait_for_selector('div[role="feed"]', timeout=15_000)
        except PWTimeout:
            console.print("[red]Timeout esperando resultados. Tente rodar com --visible para debug.[/]")
            browser.close()
            return []

        console.print("[green]✓ Resultados carregados. Iniciando coleta...[/]\n")

        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            console=console,
        ) as progress:
            task = progress.add_task(f"Coletando leads ({max_leads} máx.)", total=max_leads)

            collected_urls = set()
            scroll_attempts = 0
            max_scrolls = 30

            while len(leads) < max_leads and scroll_attempts < max_scrolls:
                # Pega todos os cards visíveis
                cards = page.query_selector_all('div[role="feed"] > div > div > a[href*="/maps/place/"]')

                for card in cards:
                    if len(leads) >= max_leads:
                        break

                    href = card.get_attribute("href") or ""
                    if href in collected_urls:
                        continue
                    collected_urls.add(href)

                    # Clica no card para abrir o painel lateral
                    try:
                        card.click()
                        time.sleep(1.8)
                    except Exception:
                        continue

                    lead = extract_lead_from_panel(page, nicho, cidade)
                    if lead:
                        leads.append(lead)
                        progress.advance(task)
                        console.print(
                            f"  [green]✓[/] {lead['nome'][:45]:<45} "
                            f"[{'green' if lead['site']=='Sim' else 'yellow'}]{lead['site']}[/] "
                            f"| {lead['tel'] or '[muted]sem tel[/]'}"
                        )

                # Scroll para carregar mais
                feed = page.query_selector('div[role="feed"]')
                if feed:
                    feed.evaluate("el => el.scrollBy(0, 800)")
                    time.sleep(1.5)
                    scroll_attempts += 1
                else:
                    break

        browser.close()

    return leads


def extract_lead_from_panel(page, nicho: str, cidade_busca: str) -> dict | None:
    """Extrai dados do painel lateral de um estabelecimento."""
    try:
        # Aguarda o nome aparecer no painel
        page.wait_for_selector('h1.DUwDvf, h1[data-attrid="title"]', timeout=5000)
    except PWTimeout:
        return None

    def safe_text(selector: str, default="") -> str:
        try:
            el = page.query_selector(selector)
            return el.inner_text().strip() if el else default
        except Exception:
            return default

    def safe_attr(selector: str, attr: str, default="") -> str:
        try:
            el = page.query_selector(selector)
            return (el.get_attribute(attr) or default).strip()
        except Exception:
            return default

    # Nome
    nome = safe_text('h1.DUwDvf') or safe_text('h1[data-attrid="title"]')
    if not nome:
        return None

    # Telefone — aparece como botão "Ligar" ou texto com ícone de telefone
    tel_raw = ""
    phone_candidates = page.query_selector_all('[data-tooltip*="Copiar número"], [aria-label*="Telefone"], [data-item-id*="phone"]')
    for el in phone_candidates:
        txt = el.get_attribute("aria-label") or el.get_attribute("data-tooltip") or el.inner_text()
        digits = clean_phone(txt)
        if len(digits) >= 8:
            tel_raw = digits
            break

    # Fallback: procura qualquer texto que pareça telefone na página
    if not tel_raw:
        page_text = page.inner_text('div[role="main"]')
        found = re.findall(r"\(?\d{2}\)?\s?\d{4,5}[-.\s]?\d{4}", page_text)
        if found:
            tel_raw = clean_phone(found[0])

    # Endereço
    end = safe_text('[data-item-id="address"] .Io6YTe') or \
          safe_text('button[data-item-id="address"]') or ""

    # Cidade — extrai do endereço ou usa a da busca
    cidade = cidade_busca.split(",")[0].strip()
    if end:
        # Tenta extrair cidade do endereço (última parte significativa)
        partes = [p.strip() for p in end.split("-") if p.strip()]
        if len(partes) >= 2:
            cidade = partes[-1].split(",")[0].strip()

    # Site
    site_url = ""
    site_els = page.query_selector_all('a[data-item-id="authority"]')
    for el in site_els:
        href = el.get_attribute("href") or ""
        if href.startswith("http") and "google.com" not in href:
            site_url = href
            break

    # Google Maps URL
    gmaps_url = page.url

    # Rating / avaliações — para obs
    rating = safe_text('div.F7nice span[aria-hidden="true"]')
    review_count = safe_text('div.F7nice span[aria-label*="avaliações"]')
    review_count = re.sub(r"\D", "", review_count)

    obs = ""
    if site_url == "" or has_site(site_url) == "Não":
        obs = "🔥 SEM SITE."
    if rating:
        obs += f" {rating}⭐" + (f" {review_count} avaliações." if review_count else "")
    obs = obs.strip()

    # Formata telefone com DDI 55 se não tiver
    tel_final = tel_raw
    if tel_final and not tel_final.startswith("55"):
        tel_final = "55" + tel_final

    return {
        "id": uid(),
        "nome": nome,
        "nicho": nicho,
        "tel": tel_final,
        "end": end,
        "cidade": cidade,
        "gmaps": gmaps_url,
        "site": has_site(site_url),
        "siteUrl": site_url,
        "social": "",
        "dono": "",
        "concorrentes": "",
        "status": "Não contatado",
        "data1": "",
        "dataFU": "",
        "obs": obs,
        "varExtra": nicho.lower(),
    }


# ---------------------------------------------------------------------------
# Export CSV (compatível com Prospect Maps importCSV)
# ---------------------------------------------------------------------------
FIELDNAMES = [
    "id", "nome", "nicho", "tel", "end", "cidade", "gmaps",
    "site", "siteUrl", "social", "dono", "concorrentes",
    "status", "data1", "dataFU", "obs", "varExtra"
]

def export_csv(leads: list[dict], nicho: str, cidade: str) -> str:
    ts = datetime.now().strftime("%Y%m%d_%H%M")
    filename = f"leads_{slug(nicho)}_{slug(cidade)}_{ts}.csv"
    out_path = Path(filename)

    with open(out_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        for lead in leads:
            writer.writerow({k: lead.get(k, "") for k in FIELDNAMES})

    return str(out_path)


def print_summary(leads: list[dict], csv_path: str):
    total = len(leads)
    sem_site = sum(1 for l in leads if l["site"] == "Não")
    com_tel = sum(1 for l in leads if l["tel"])

    table = Table(title=f"\n📊 Resumo da coleta — {total} leads", show_header=True)
    table.add_column("Métrica", style="cyan")
    table.add_column("Valor", style="bold green")

    table.add_row("Total coletado", str(total))
    table.add_row("🔥 Sem site (prioridade)", f"{sem_site} ({100*sem_site//total if total else 0}%)")
    table.add_row("📞 Com telefone", f"{com_tel} ({100*com_tel//total if total else 0}%)")
    table.add_row("📄 Arquivo CSV", csv_path)

    console.print(table)
    console.print(
        "\n[bold green]✅ Pronto![/] Agora no Prospect Maps clique em "
        "[bold]⬆ Importar CSV[/] e selecione o arquivo acima.\n"
    )


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Scraper de leads do Google Maps → CSV para Prospect Maps"
    )
    parser.add_argument("--nicho", "-n", required=True, help='Ex: "oficina mecanica", "academia", "clinica odontologica"')
    parser.add_argument("--cidade", "-c", required=True, help='Ex: "Fortaleza CE", "Juazeiro do Norte CE"')
    parser.add_argument("--max", "-m", type=int, default=30, help="Máximo de leads (padrão: 30)")
    parser.add_argument("--visible", action="store_true", help="Abre o browser visível (útil para debug)")

    args = parser.parse_args()

    console.rule("[bold cyan]Prospect Maps — Scraper de Leads[/]")
    console.print(f"  Nicho  : [bold]{args.nicho}[/]")
    console.print(f"  Cidade : [bold]{args.cidade}[/]")
    console.print(f"  Máximo : [bold]{args.max}[/] leads")
    console.print(f"  Modo   : {'[yellow]Visível[/]' if args.visible else '[green]Headless[/]'}\n")

    leads = scrape_maps(
        nicho=args.nicho,
        cidade=args.cidade,
        max_leads=args.max,
        headless=not args.visible,
    )

    if not leads:
        console.print("[red]Nenhum lead coletado. Tente --visible para ver o que aconteceu.[/]")
        sys.exit(1)

    csv_path = export_csv(leads, args.nicho, args.cidade)
    print_summary(leads, csv_path)


if __name__ == "__main__":
    main()
