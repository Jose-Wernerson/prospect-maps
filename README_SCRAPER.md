# 🗺 Prospect Maps — Scraper de Leads

Scraper automático do Google Maps sem API key. Você passa nicho + cidade, ele coleta e exporta um CSV pronto para importar no seu CRM.

---

## ⚡ Instalação (só na primeira vez)

```bash
pip install playwright rich
python -m playwright install chromium
```

O script também faz isso automaticamente na primeira execução.

---

## 🚀 Como usar

```bash
# Básico
python gmaps_scraper.py --nicho "oficina mecanica" --cidade "Fortaleza CE"

# Com mais leads
python gmaps_scraper.py --nicho "academia" --cidade "Juazeiro do Norte CE" --max 50

# Ver o browser abrindo (útil pra debug)
python gmaps_scraper.py --nicho "clinica odontologica" --cidade "Sobral CE" --visible

# Atalhos curtos
python gmaps_scraper.py -n "despachante" -c "Caucaia CE" -m 20
```

---

## 📄 Saída

Gera um arquivo como:

```
leads_oficina_mecanica_fortaleza_20250530_1423.csv
```

Com as colunas exatas do Prospect Maps:
`id, nome, nicho, tel, end, cidade, gmaps, site, siteUrl, social, dono, concorrentes, status, data1, dataFU, obs, varExtra`

---

## 📥 Importar no CRM

1. Abra o **Prospect Maps** no browser
2. Clique em **⬆ Importar CSV**
3. Selecione o arquivo gerado
4. Pronto — leads entram com status "Não contatado"

---

## 🔥 Prioridade automática

Leads **sem site** já chegam com `obs: "🔥 SEM SITE."` — use o filtro **"Sem site (prioridade)"** no CRM para focar neles.

---

## ⚠️ Limites e dicas

| Situação | Dica |
|---|---|
| Google bloqueia | Use `--visible` e resolva CAPTCHA manualmente |
| Poucos resultados | Tente termos mais genéricos (`"mecanico"` em vez de `"oficina mecanica autorizada"`) |
| Sem telefone | Google Maps nem sempre exibe — é normal |
| Muitos leads de uma vez | Faça em lotes de 30–40 com pausa entre execuções |

---

## 📋 Exemplos de nichos testados

```bash
python gmaps_scraper.py -n "oficina mecanica" -c "Fortaleza CE" -m 40
python gmaps_scraper.py -n "advocacia trabalhista" -c "Fortaleza CE" -m 25
python gmaps_scraper.py -n "clinica odontologica" -c "Maracanau CE" -m 30
python gmaps_scraper.py -n "academia de musculacao" -c "Caucaia CE" -m 20
python gmaps_scraper.py -n "contabilidade" -c "Sobral CE" -m 35
python gmaps_scraper.py -n "dedetizadora" -c "Fortaleza CE" -m 20
```
