# 📍 Prospect Maps

CRM de leads do Google Maps — HTML/CSS/JS puro + Supabase + Vercel.

---

## Setup

### 1. Supabase — cria a tabela `leads`

Cole no SQL Editor do Supabase:

```sql
create table leads (
  id           uuid primary key default gen_random_uuid(),
  nome         text not null,
  nicho        text,
  tel          text,
  "end"        text,
  cidade       text,
  gmaps        text,
  site         text default 'Não',
  "siteUrl"    text,
  social       text,
  dono         text,
  concorrentes text,
  status       text default 'Não contatado',
  data1        text,
  "dataFU"     text,
  obs          text,
  "varExtra"   text,
  created_at   timestamptz default now()
);

-- Habilita RLS (opcional mas recomendado)
alter table leads enable row level security;

-- Política pública de leitura/escrita (sem auth)
create policy "public access" on leads
  for all using (true) with check (true);
```

### 2. Configura as credenciais

Em `index.html`, substitua:

```js
window.ENV = {
  SUPABASE_URL: 'https://xxxx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5c...'
};
```

Pegue esses valores em: **Supabase → Project Settings → API**

### 3. Deploy na Vercel

```bash
# Instala CLI da Vercel (opcional)
npm i -g vercel

# Na pasta do projeto
vercel
```

Ou arraste a pasta para vercel.com.

---

## Uso

| Ação | Como |
|---|---|
| Importar leads | ⬆ Importar CSV → seleciona arquivo do scraper |
| Novo lead manual | + Novo Lead |
| Avançar status | Clica no badge colorido na tabela |
| Abrir WhatsApp | 💬 na linha do lead |
| Exportar filtrados | ⬇ Exportar |

---

## Estrutura

```
prospect-maps/
├── index.html        # HTML principal + modais
├── css/style.css     # Dark theme
├── js/
│   ├── app.js        # Init Supabase + boot
│   ├── leads.js      # CRUD Supabase
│   ├── ui.js         # Render tabela, filtros, modais
│   ├── dashboard.js  # KPI cards
│   └── templates.js  # Templates WhatsApp por nicho
├── vercel.json
└── .gitignore
```
