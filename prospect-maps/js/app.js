/**
 * app.js
 * Inicialização da aplicação e conexão com Supabase.
 */

const App = (() => {

  let _db = null;

  /** Inicializa Supabase e carrega dados */
  async function init() {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.ENV || {};

    if (!SUPABASE_URL || SUPABASE_URL.includes('COLE_SUA')) {
      document.getElementById('loading').innerHTML =
        `<strong style="color:#f55b5b">⚠ Configure as credenciais do Supabase em index.html (window.ENV)</strong>`;
      return;
    }

    try {
      _db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      await reload();
    } catch (err) {
      document.getElementById('loading').textContent = 'Erro ao conectar: ' + err.message;
    }
  }

  /** Recarrega leads do banco e re-renderiza tudo */
  async function reload() {
    const leads = await Leads.fetchAll();
    Dashboard.render(leads);
    UI.populateFilters(leads);
    UI.updateCount(leads.length);
    UI.applyFilters();
  }

  // Expõe db como propriedade
  return {
    get db() { return _db; },
    init,
    reload,
  };
})();

// Boot
document.addEventListener('DOMContentLoaded', App.init);
