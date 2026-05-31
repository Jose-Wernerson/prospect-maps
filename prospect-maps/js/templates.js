/**
 * templates.js
 * Templates de mensagem WhatsApp por nicho.
 * Variáveis: {NOME}, {DONO}, {CIDADE}, {VAR}
 */

const TEMPLATES = {
  Oficinas: `Olá {DONO}, tudo bem?\n\nSou José, desenvolvedor web. Vi a *{NOME}* no Google Maps e notei algo importante:\n\nQuando busquei *oficina de {VAR} em {CIDADE}* no Google, 3 concorrentes aparecem antes — todos com site profissional.\n\nAjudo oficinas especializadas a captar mais clientes pelo Google com site + SEO local.\n\nPosso te mostrar um exemplo rápido de como isso funcionaria para vocês?`,

  OficinasGestor: `Olá {DONO}, tudo bem? 😊\n\nVi a *{NOME}* no Google Maps — oficina com ótimas avaliações, parabéns!\n\nQueria te apresentar o *Monkey Gestor*, um sistema feito especialmente pra oficinas como a sua. E antes de qualquer coisa: tem *15 dias grátis*, sem cartão, sem compromisso — você testa com calma.\n\n🔧 Ordens de Serviço digitais\n🛒 PDV + controle de estoque\n📲 Notificação automática pro cliente via WhatsApp\n🔍 Consulta de placa automática (marca, modelo, ano e cor)\n👤 Área do cliente — ele acompanha o carro sem precisar te ligar\n📊 Relatórios financeiros em PDF\n⚡ Esquemas elétricos de veículos inclusos\n\nUsuários ilimitados, OS ilimitadas — sem pegadinha nenhuma.\n\nPosso te mostrar como funciona numa demo rápida? É rapidinho, prometo 🚀`,

  Advocacias: `Olá Dr(a). {DONO},\n\nSou José, desenvolvedor especializado em sites para escritórios de advocacia.\n\nPesquisei *advogado {VAR} {CIDADE}* e vi que *{NOME}* não aparece nos resultados, enquanto outros escritórios com site profissional dominam as primeiras posições.\n\nCrio sites institucionais com:\n✓ Formulário de consulta inicial\n✓ Blog para SEO (aparecer no Google)\n✓ Área de especialidades destacada\n\nPosso compartilhar exemplos do meu portfólio?`,

  Clinicas: `Olá {DONO},\n\nSou José, desenvolvedor web especializado em sites para clínicas.\n\nVi que *{NOME}* atende particular mas não tem sistema de agendamento online.\n\nSeus concorrentes já oferecem:\n✓ Agendamento direto pelo site\n✓ Integração com WhatsApp\n✓ Calculadora de procedimentos\n\nIsso aumenta conversão em até 40% segundo meus clientes.\n\nPosso mostrar como funciona?`,

  Academias: `Olá {DONO}!\n\nVi a *{NOME}* no Google Maps.\n\nTenho ajudado academias a captar mais alunos com um site profissional + integração com WhatsApp para consultas e matrículas online.\n\nSem site, você perde leads que procuram no Google antes de decidir.\n\nPosso mostrar um exemplo rápido do que faria pra vocês?`,

  Dedetizacao: `Olá {DONO},\n\nVi a *{NOME}* no Google Maps. Sou José, desenvolvedor web.\n\nEmpresas de controle de pragas *sem site* perdem chamados para quem aparece primeiro no Google.\n\nCrio sites rápidos e otimizados para SEO local — em {CIDADE} seus concorrentes já estão aparecendo.\n\nPosso fazer uma análise gratuita do que está faltando?`,

  Contadores: `Olá {DONO},\n\nSou José, desenvolvedor. Vi a *{NOME}* no Google Maps.\n\nEscriórios contábeis que têm site profissional conseguem captar MEIs e empresas que buscam contador online — sem precisar de indicação.\n\nCrio sites institucionais com formulário de contato, área de serviços e blog para SEO.\n\nPosso apresentar um exemplo do setor?`,

  Manutencao: `Olá {DONO},\n\nVi a *{NOME}* no Google Maps e queria apresentar uma ideia rápida.\n\nPrestadores de manutenção predial *sem site* dependem 100% de indicação — enquanto concorrentes aparecem nas pesquisas do Google.\n\nUm site simples + Google Meu Negócio bem configurado muda isso em semanas.\n\nPosso mostrar como? É uma conversa rápida.`,

  Despachantes: `Olá {DONO},\n\nSou José. Vi o perfil da *{NOME}* no Maps e notei que não tem site.\n\nEm {CIDADE}, despachantes com site aparecem primeiro quando alguém busca ajuda para transferência, licenciamento ou multas.\n\nCrio sites rápidos, simples e bem posicionados no Google.\n\nPosso te mandar um exemplo do que faria?`
};

/**
 * Gera mensagem preenchida para um lead específico
 */
function buildMessage(lead, isGestor = false) {
  let tmpl;
  if (isGestor && lead.nicho === 'Oficinas') {
    tmpl = TEMPLATES.OficinasGestor;
  } else {
    tmpl = TEMPLATES[lead.nicho] || TEMPLATES.Oficinas;
  }
  const dono = lead.dono ? lead.dono.split(' ')[0] : 'pessoal';
  return tmpl
    .replace(/{NOME}/g,   lead.nome     || '')
    .replace(/{DONO}/g,   dono)
    .replace(/{CIDADE}/g, lead.cidade   || '')
    .replace(/{VAR}/g,    lead.varExtra || lead.nicho || '');
}
