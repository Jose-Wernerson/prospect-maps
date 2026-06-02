/**
 * templates.js
 * Templates de mensagem WhatsApp por nicho.
 * Variáveis: {NOME}, {DONO}, {CIDADE}, {VAR}
 */

const TEMPLATES = {

  /* ── OFICINAS ─────────────────────────────────────────────────────── */
  Oficinas: `Olá {DONO}, tudo bem?\n\nSou José da Squad4Tech, desenvolvedor web. Vi a *{NOME}* no Google Maps e notei algo importante:\n\nQuando busquei *oficina de {VAR} em {CIDADE}* no Google, 3 concorrentes aparecem antes — todos com site profissional.\n\nAjudamos oficinas especializadas a captar mais clientes pelo Google com site + SEO local.\n\nPosso te mostrar um exemplo rápido de como isso funcionaria para vocês?`,

  OficinasComSite: `Olá {DONO}, tudo bem?\n\nSou José da Squad4Tech. Vi a *{NOME}* no Google Maps e acessei o site de vocês.\n\nNotei que o site poderia melhorar bastante — mais velocidade, SEO local otimizado e um botão de WhatsApp pra converter visitas em contatos na hora.\n\nEssas melhorias fazem muita diferença no número de clientes novos que chegam pelo Google.\n\nPosso te mostrar o que ficaria diferente numa comparação rápida?`,

  OficinasGestor: `Olá {DONO}, tudo bem? 😊\n\nVi a *{NOME}* no Google Maps — oficina com ótimas avaliações, parabéns!\n\nQueria te apresentar o *Monkey Gestor*, um sistema feito especialmente pra oficinas como a sua. E antes de qualquer coisa: tem *15 dias grátis*, sem cartão, sem compromisso — você testa com calma.\n\n🔧 Ordens de Serviço digitais\n🛒 PDV + controle de estoque\n📲 Notificação automática pro cliente via WhatsApp\n🔍 Consulta de placa automática (marca, modelo, ano e cor)\n👤 Área do cliente — ele acompanha o carro sem precisar te ligar\n📊 Relatórios financeiros em PDF\n⚡ Esquemas elétricos de veículos inclusos\n\nUsuários ilimitados, OS ilimitadas — sem pegadinha nenhuma.\n\nPosso te mostrar como funciona numa demo rápida? É rapidinho, prometo 🚀`,

  /* ── ADVOCACIAS ───────────────────────────────────────────────────── */
  Advocacias: `Olá Dr(a). {DONO},\n\nSou José da Squad4Tech, desenvolvedor especializado em sites para escritórios de advocacia.\n\nPesquisei *advogado {VAR} {CIDADE}* e vi que *{NOME}* não aparece nos resultados, enquanto outros escritórios com site profissional dominam as primeiras posições.\n\nCriamos sites institucionais com:\n✓ Formulário de consulta inicial\n✓ Blog para SEO (aparecer no Google)\n✓ Área de especialidades destacada\n\nPosso compartilhar exemplos do nosso portfólio?`,

  AdvocaciasComSite: `Olá Dr(a). {DONO},\n\nSou José da Squad4Tech. Pesquisei *{NOME}* e acessei o site do escritório.\n\nNotei que o site poderia melhorar muito — especialmente no SEO: pesquisando *advogado {VAR} {CIDADE}*, escritórios concorrentes aparecem antes mesmo com sites mais simples.\n\nUma reformulação estratégica pode mudar isso rapidamente.\n\nPosso te mostrar o que faria de diferente?`,

  /* ── CLÍNICAS ─────────────────────────────────────────────────────── */
  Clinicas: `Olá {DONO},\n\nSou José da Squad4Tech, desenvolvedor web especializado em sites para clínicas.\n\nVi que *{NOME}* atende particular mas não tem sistema de agendamento online.\n\nSeus concorrentes já oferecem:\n✓ Agendamento direto pelo site\n✓ Integração com WhatsApp\n✓ Calculadora de procedimentos\n\nIsso aumenta conversão em até 40% segundo nossos clientes.\n\nPosso mostrar como funciona?`,

  ClinicasComSite: `Olá {DONO},\n\nSou José da Squad4Tech. Vi o site da *{NOME}* e percebi uma oportunidade.\n\nNotei que o site de vocês poderia melhorar bastante — agendamento online, integração com WhatsApp e um layout mais moderno fariam uma diferença enorme na captação de novos pacientes.\n\nIsso é exatamente o que a gente faz pra clínicas como a sua.\n\nPosso te mostrar exemplos do que já entregamos?`,

  /* ── ACADEMIAS ────────────────────────────────────────────────────── */
  Academias: `Olá {DONO}!\n\nSou José da Squad4Tech. Vi a *{NOME}* no Google Maps.\n\nTemos ajudado academias a captar mais alunos com um site profissional + integração com WhatsApp para consultas e matrículas online.\n\nSem site, você perde leads que procuram no Google antes de decidir.\n\nPosso mostrar um exemplo rápido do que faríamos pra vocês?`,

  AcademiasComSite: `Olá {DONO}!\n\nSou José da Squad4Tech. Vi a *{NOME}* no Google Maps e dei uma olhada no site de vocês.\n\nNotei que o site poderia melhorar — uma página de planos mais clara, botão de matrícula pelo WhatsApp e um SEO melhor pra aparecer quando alguém busca academia em {CIDADE}.\n\nPequenas melhorias assim aumentam muito o número de alunos novos.\n\nPosso te mostrar como ficaria?`,

  /* ── DEDETIZAÇÃO ──────────────────────────────────────────────────── */
  Dedetizacao: `Olá {DONO},\n\nVi a *{NOME}* no Google Maps. Sou José da Squad4Tech, desenvolvedor web.\n\nEmpresas de controle de pragas *sem site* perdem chamados para quem aparece primeiro no Google.\n\nCriamos sites rápidos e otimizados para SEO local — em {CIDADE} seus concorrentes já estão aparecendo.\n\nPosso fazer uma análise gratuita do que está faltando?`,

  DedetizacaoComSite: `Olá {DONO},\n\nSou José da Squad4Tech. Vi a *{NOME}* no Google Maps e acessei o site de vocês.\n\nNotei que o site poderia melhorar bastante — velocidade, SEO local e um layout mais confiável fariam vocês aparecerem antes da concorrência em {CIDADE}.\n\nIsso converte muito mais chamados pelo Google.\n\nPosso te mostrar um diagnóstico rápido?`,

  /* ── CONTADORES ───────────────────────────────────────────────────── */
  Contadores: `Olá {DONO},\n\nSou José da Squad4Tech. Vi a *{NOME}* no Google Maps.\n\nEscritórios contábeis que têm site profissional conseguem captar MEIs e empresas que buscam contador online — sem precisar de indicação.\n\nCriamos sites institucionais com formulário de contato, área de serviços e blog para SEO.\n\nPosso apresentar um exemplo do setor?`,

  ContadoresComSite: `Olá {DONO},\n\nSou José da Squad4Tech. Vi o site da *{NOME}* e fiz uma análise rápida.\n\nNotei que o site de vocês poderia melhorar — especialmente no SEO e na apresentação dos serviços, o que ajudaria a captar mais MEIs e empresas que buscam contador online em {CIDADE}.\n\nPosso te mostrar o que daria pra ajustar?`,

  /* ── MANUTENÇÃO PREDIAL ───────────────────────────────────────────── */
  Manutencao: `Olá {DONO},\n\nSou José da Squad4Tech. Vi a *{NOME}* no Google Maps e queria apresentar uma ideia rápida.\n\nPrestadores de manutenção predial *sem site* dependem 100% de indicação — enquanto concorrentes aparecem nas pesquisas do Google.\n\nUm site simples + Google Meu Negócio bem configurado muda isso em semanas.\n\nPosso mostrar como? É uma conversa rápida.`,

  ManutencaoComSite: `Olá {DONO},\n\nSou José da Squad4Tech. Vi a *{NOME}* no Google Maps e acessei o site de vocês.\n\nNotei que o site poderia melhorar — com um visual mais profissional e SEO bem configurado, vocês apareceriam muito mais nas buscas de condomínios e empresas procurando manutenção em {CIDADE}.\n\nPosso te mandar uma análise gratuita?`,

  /* ── DESPACHANTES ─────────────────────────────────────────────────── */
  Despachantes: `Olá {DONO},\n\nSou José da Squad4Tech. Vi o perfil da *{NOME}* no Maps e notei que não tem site.\n\nEm {CIDADE}, despachantes com site aparecem primeiro quando alguém busca ajuda para transferência, licenciamento ou multas.\n\nCriamos sites rápidos, simples e bem posicionados no Google.\n\nPosso te mandar um exemplo do que faríamos?`,

  DespachantesComSite: `Olá {DONO},\n\nSou José da Squad4Tech. Vi o perfil da *{NOME}* no Maps e acessei o site de vocês.\n\nNotei que o site poderia melhorar — um layout mais moderno e SEO local bem feito faria vocês aparecerem antes da concorrência quando alguém busca despachante em {CIDADE}.\n\nPosso te mostrar como ficaria?`,

  /* ── RESTAURANTES ─────────────────────────────────────────────────── */
  Restaurantes: `Olá {DONO}, tudo bem?\n\nSou José da Squad4Tech. Vi o *{NOME}* no Google Maps — ótimo lugar!\n\nHoje quem busca *restaurante {VAR} em {CIDADE}* no Google vê primeiro quem tem site com cardápio online e reserva pelo WhatsApp.\n\nAjudamos restaurantes a aparecer bem no Google e captar mais clientes sem depender só das redes sociais.\n\nPosso te mostrar como funcionaria pra vocês?`,

  RestaurantesComSite: `Olá {DONO}, tudo bem?\n\nSou José da Squad4Tech. Vi o *{NOME}* no Google Maps e acessei o site de vocês.\n\nNotei que o site poderia melhorar bastante — cardápio mais visual, botão de reserva pelo WhatsApp e um SEO melhor pra aparecer antes da concorrência em {CIDADE}.\n\nIsso faz muita diferença na quantidade de clientes que chegam até vocês pelo Google.\n\nPosso te mandar um exemplo rápido?`,

  /* ── PETSHOP ──────────────────────────────────────────────────────── */
  Petshop: `Olá {DONO}, tudo bem?\n\nSou José da Squad4Tech. Vi o *{NOME}* no Google Maps.\n\nPetshops sem site perdem clientes que buscam no Google antes de ligar — especialmente pra banho, tosa e consultas veterinárias.\n\nCriamos sites com agendamento online, WhatsApp integrado e boa posição no Google local.\n\nPosso te mostrar um exemplo rápido?`,

  PetshopComSite: `Olá {DONO}, tudo bem?\n\nSou José da Squad4Tech. Vi o *{NOME}* no Google Maps e acessei o site de vocês.\n\nNotei que o site poderia melhorar bastante — um visual mais moderno, agendamento online de banho e tosa e integração com WhatsApp facilitariam muito o contato dos tutores.\n\nEssas melhorias aumentam bastante o número de clientes novos.\n\nPosso te mostrar como ficaria?`

};

/**
 * Gera mensagem preenchida para um lead específico
 */

/** Profissionais que podem enviar mensagens */
const PROFISSIONAIS = [
  { nome: 'José Wernerson',  primeiro: 'José Wernerson' },
  { nome: 'Diego Fagundes',  primeiro: 'Diego Fagundes' },
  { nome: 'José Francisco', primeiro: 'José Francisco' },
];

let _profAtual = (() => {
  try { const s = localStorage.getItem('pm_prof'); return s ? JSON.parse(s) : PROFISSIONAIS[0]; }
  catch { return PROFISSIONAIS[0]; }
})();

function getProfissional() { return _profAtual; }

function setProfissional(nome) {
  _profAtual = PROFISSIONAIS.find(p => p.nome === nome) || PROFISSIONAIS[0];
  try { localStorage.setItem('pm_prof', JSON.stringify(_profAtual)); } catch {}
  document.querySelectorAll('.prof-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.prof === _profAtual.nome);
  });
  if (typeof Leads !== 'undefined') Leads.refreshTemplate();
}

function buildMessage(lead, isGestor = false) {
  let tmpl;
  const hasSite = lead.site && lead.site !== 'Não';
  const nicho = lead.nicho || '';

  // busca case-insensitive e sem espaços para tolerar variações como "Pet Shop" vs "Petshop"
  function findTmpl(key) {
    if (TEMPLATES[key]) return TEMPLATES[key];
    const lk = key.replace(/\s+/g, '').toLowerCase();
    const found = Object.keys(TEMPLATES).find(k => k.replace(/\s+/g, '').toLowerCase() === lk);
    return found ? TEMPLATES[found] : null;
  }

  if (isGestor && nicho === 'Oficinas') {
    tmpl = TEMPLATES.OficinasGestor;
  } else if (hasSite) {
    tmpl = findTmpl(nicho + 'ComSite') || findTmpl(nicho) || TEMPLATES.Oficinas;
  } else {
    tmpl = findTmpl(nicho) || TEMPLATES.Oficinas;
  }
  const dono = lead.dono ? lead.dono.split(' ')[0] : 'pessoal';
  const prof = _profAtual ? _profAtual.primeiro : 'José';
  return tmpl
    .replace(/{NOME}/g,   lead.nome     || '')
    .replace(/{DONO}/g,   dono)
    .replace(/{CIDADE}/g, lead.cidade   || '')
    .replace(/{VAR}/g,    lead.varExtra || lead.nicho || '')
    .replace(/José da Squad4Tech/g, `${prof} da Squad4Tech`);
}
