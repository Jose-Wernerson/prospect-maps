/**
 * ui.js
 * Renderização da tabela, filtros, modais e toast.
 */

const UI = (() => {

  const STATUS_CLASS = {
    'Não contatado':   's-nao-contatado',
    'Enviado':         's-enviado',
    'Respondeu':       's-respondeu',
    'Negociou':        's-negociou',
    'Fechou':          's-fechou',
    'Não interessado': 's-nao-interessado',
  };

  let _toastTimer = null;
  let _filteredCache = [];

  /* ── TABELA ── */

  function renderTable(leads) {
    _filteredCache = leads;
    const tbody  = document.getElementById('leads-body');
    const table  = document.getElementById('leads-table');
    const empty  = document.getElementById('empty-state');
    const loading = document.getElementById('loading');

    loading.style.display = 'none';

    if (!leads.length) {
      table.style.display = 'none';
      empty.style.display = 'flex';
      return;
    }

    empty.style.display = 'none';
    table.style.display = 'table';

    tbody.innerHTML = leads.map(l => {
      const siteBadge = l.site === 'Não'
        ? `<span class="badge badge-sem">🔥 Sem site</span>`
        : `<span class="badge badge-com">✓ Tem site</span>`;

      const nicho = l.nicho
        ? `<span class="badge badge-nicho">${l.nicho}</span>` : '—';

      const statusCls = STATUS_CLASS[l.status] || 's-nao-contatado';

      const mapsBtn = l.gmaps
        ? `<button class="action-btn maps" title="Google Maps" onclick="window.open('${l.gmaps}','_blank')">🗺</button>`
        : '';

      const siteBtn = l.siteUrl
        ? `<button class="action-btn" title="Ver site" onclick="window.open('${l.siteUrl}','_blank')">🌐</button>`
        : '';

      return `
        <tr>
          <td class="cell-nome" title="${esc(l.nome)}">${esc(l.nome)}</td>
          <td>${nicho}</td>
          <td class="cell-tel">${l.tel ? formatTel(l.tel) : '—'}</td>
          <td>${esc(l.cidade || '—')}</td>
          <td>${siteBadge}</td>
          <td>
            <span class="status-badge ${statusCls}" onclick="Leads.cycleStatus('${l.id}')" title="Clique para avançar">
              ${esc(l.status || 'Não contatado')}
            </span>
          </td>
          <td class="cell-obs" title="${esc(l.obs || '')}">${esc(l.obs || '—')}</td>
          <td>
            <div class="cell-actions">
              <button class="action-btn wpp" title="Mensagem WhatsApp" onclick="Leads.openTemplate('${l.id}')">💬</button>
              ${mapsBtn}
              ${siteBtn}
              <button class="action-btn" title="Editar" onclick="Leads.edit(${JSON.stringify(l).replace(/"/g, '&quot;')})">✏️</button>
              <button class="action-btn del" title="Apagar" onclick="Leads.remove('${l.id}')">🗑</button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  /* ── FILTROS ── */

  function applyFilters() {
    const q      = document.getElementById('search').value.toLowerCase();
    const nicho  = document.getElementById('f-nicho').value;
    const cidade = document.getElementById('f-cidade').value;
    const status = document.getElementById('f-status').value;
    const site   = document.getElementById('f-site').value;

    const result = Leads.getAll().filter(l => {
      if (q      && !`${l.nome} ${l.tel} ${l.dono}`.toLowerCase().includes(q)) return false;
      if (nicho  && l.nicho   !== nicho)  return false;
      if (cidade && l.cidade  !== cidade) return false;
      if (status && l.status  !== status) return false;
      if (site   && l.site    !== site)   return false;
      return true;
    });

    renderTable(result);
    updateCount(result.length, Leads.getAll().length);
  }

  function clearFilters() {
    document.getElementById('search').value    = '';
    document.getElementById('f-nicho').value   = '';
    document.getElementById('f-cidade').value  = '';
    document.getElementById('f-status').value  = '';
    document.getElementById('f-site').value    = '';
    applyFilters();
  }

  function filtered() { return _filteredCache; }

  function populateFilters(leads) {
    const nichos  = [...new Set(leads.map(l => l.nicho).filter(Boolean))].sort();
    const cidades = [...new Set(leads.map(l => l.cidade).filter(Boolean))].sort();

    const nichoSel  = document.getElementById('f-nicho');
    const cidadeSel = document.getElementById('f-cidade');

    const base = v => `<option value="">${v}</option>`;
    nichoSel.innerHTML  = base('Todos os nichos')  + nichos.map(n  => `<option>${n}</option>`).join('');
    cidadeSel.innerHTML = base('Todas as cidades') + cidades.map(c => `<option>${c}</option>`).join('');
  }

  function updateCount(shown, total) {
    const el = document.getElementById('lead-count');
    if (total !== undefined && shown !== total) {
      el.textContent = `${shown} / ${total} leads`;
    } else {
      el.textContent = `${shown} leads`;
    }
  }

  /* ── MODAIS ── */

  function openModal() {
    Leads.clearEditId();
    document.getElementById('modal-title').textContent = 'Novo Lead';
    ['f-nome','f-nicho-input','f-tel','f-cidade-input','f-end','f-dono',
     'f-siteUrl','f-gmaps','f-social','f-varExtra','f-concorrentes','f-obs']
      .forEach(id => { document.getElementById(id).value = ''; });
    document.getElementById('f-site-input').value = 'Não';
    document.getElementById('modal-lead').style.display = 'flex';
  }

  function closeModal() {
    document.getElementById('modal-lead').style.display = 'none';
  }

  function openImport() {
    document.getElementById('csv-file').value = '';
    document.getElementById('csv-preview').textContent = '';
    document.getElementById('btn-import-confirm').disabled = true;
    document.getElementById('btn-import-confirm').textContent = 'Importar';
    document.getElementById('modal-import').style.display = 'flex';
  }

  function closeImport() {
    document.getElementById('modal-import').style.display = 'none';
  }

  function closeTemplate() {
    document.getElementById('modal-template').style.display = 'none';
  }

  function copyTemplate() {
    const text = document.getElementById('template-text').value;
    navigator.clipboard.writeText(text).then(() => toast('Mensagem copiada ✓', 'green'));
  }

  function openWhatsApp() {
    const tel = document.getElementById('modal-template').dataset.tel;
    const text = encodeURIComponent(document.getElementById('template-text').value);
    if (!tel) { toast('Lead sem telefone', 'red'); return; }
    window.open(`https://wa.me/${tel}?text=${text}`, '_blank');
  }

  /* ── TOAST ── */

  function toast(msg, type = 'default') {
    const el = document.getElementById('toast');
    const colors = { green: '#2dd4a0', red: '#f55b5b', accent: '#7080ff', default: '' };
    el.textContent = msg;
    el.style.color = colors[type] || colors.default;
    el.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  }

  /* ── HELPERS ── */

  function esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function formatTel(tel) {
    // 5585999999999 → (85) 99999-9999
    const d = tel.replace(/\D/g,'');
    if (d.length === 13) return `(${d.slice(2,4)}) ${d.slice(4,9)}-${d.slice(9)}`;
    if (d.length === 12) return `(${d.slice(2,4)}) ${d.slice(4,8)}-${d.slice(8)}`;
    return tel;
  }

  return {
    renderTable, applyFilters, clearFilters, filtered,
    populateFilters, updateCount,
    openModal, closeModal,
    openImport, closeImport,
    closeTemplate, copyTemplate, openWhatsApp,
    toast
  };
})();
