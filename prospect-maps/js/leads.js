/**
 * leads.js
 * CRUD de leads via Supabase.
 * Expõe o objeto global `Leads`.
 */

const Leads = (() => {
  const TABLE = 'leads';
  const STATUS_CYCLE = [
    'Não contatado', 'Enviado', 'Respondeu',
    'Negociou', 'Fechou', 'Não interessado'
  ];

  // Cache local para filtros sem re-fetch
  let _all = [];
  // Lead pendente no CSV import
  let _csvRows = [];
  // Lead em edição no modal
  let _editId = null;

  /** Busca todos os leads do Supabase */
  async function fetchAll() {
    const { data, error } = await App.db
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) { UI.toast('Erro ao carregar leads: ' + error.message, 'red'); return []; }
    _all = data || [];
    return _all;
  }

  /** Retorna cache local (sem re-fetch) */
  function getAll() { return _all; }

  /** Abre modal para editar lead existente */
  function edit(lead) {
    _editId = lead.id;
    document.getElementById('modal-title').textContent = 'Editar Lead';
    document.getElementById('f-nome').value        = lead.nome         || '';
    document.getElementById('f-nicho-input').value = lead.nicho        || '';
    document.getElementById('f-tel').value         = lead.tel          || '';
    document.getElementById('f-cidade-input').value= lead.cidade       || '';
    document.getElementById('f-end').value         = lead.end          || '';
    document.getElementById('f-dono').value        = lead.dono         || '';
    document.getElementById('f-site-input').value  = lead.site         || 'Não';
    document.getElementById('f-siteUrl').value     = lead.siteUrl      || '';
    document.getElementById('f-gmaps').value       = lead.gmaps        || '';
    document.getElementById('f-social').value      = lead.social       || '';
    document.getElementById('f-varExtra').value    = lead.varExtra     || '';
    document.getElementById('f-concorrentes').value= lead.concorrentes || '';
    document.getElementById('f-obs').value         = lead.obs          || '';
    document.getElementById('modal-lead').style.display = 'flex';
  }

  /** Salva (insert ou update) via Supabase */
  async function save() {
    const nome = document.getElementById('f-nome').value.trim();
    if (!nome) { UI.toast('Nome é obrigatório', 'red'); return; }

    const payload = {
      nome,
      nicho:        document.getElementById('f-nicho-input').value.trim(),
      tel:          document.getElementById('f-tel').value.trim(),
      cidade:       document.getElementById('f-cidade-input').value.trim(),
      end:          document.getElementById('f-end').value.trim(),
      dono:         document.getElementById('f-dono').value.trim(),
      site:         document.getElementById('f-site-input').value,
      siteUrl:      document.getElementById('f-siteUrl').value.trim(),
      gmaps:        document.getElementById('f-gmaps').value.trim(),
      social:       document.getElementById('f-social').value.trim(),
      varExtra:     document.getElementById('f-varExtra').value.trim(),
      concorrentes: document.getElementById('f-concorrentes').value.trim(),
      obs:          document.getElementById('f-obs').value.trim(),
      status:       'Não contatado',
    };

    let error;
    if (_editId) {
      ({ error } = await App.db.from(TABLE).update(payload).eq('id', _editId));
    } else {
      ({ error } = await App.db.from(TABLE).insert(payload));
    }

    if (error) { UI.toast('Erro ao salvar: ' + error.message, 'red'); return; }

    UI.toast(_editId ? 'Lead atualizado ✓' : 'Lead criado ✓', 'green');
    _editId = null;
    UI.closeModal();
    await App.reload();
  }

  /** Avança status no ciclo e salva */
  async function cycleStatus(id) {
    const lead = _all.find(l => l.id === id);
    if (!lead) return;
    const idx = STATUS_CYCLE.indexOf(lead.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];

    const { error } = await App.db
      .from(TABLE)
      .update({ status: next, data1: lead.data1 || new Date().toISOString().split('T')[0] })
      .eq('id', id);

    if (error) { UI.toast('Erro: ' + error.message, 'red'); return; }
    lead.status = next;
    UI.renderTable(UI.filtered());
    Dashboard.render(_all);
    UI.toast(`Status → ${next}`, 'accent');
  }

  /** Deleta lead com confirmação */
  async function remove(id) {
    if (!confirm('Apagar este lead?')) return;
    const { error } = await App.db.from(TABLE).delete().eq('id', id);
    if (error) { UI.toast('Erro ao apagar: ' + error.message, 'red'); return; }
    _all = _all.filter(l => l.id !== id);
    UI.renderTable(UI.filtered());
    Dashboard.render(_all);
    UI.updateCount(_all.length);
    UI.toast('Lead removido', 'red');
  }

  /** Preview do CSV antes de importar */
  function previewCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const lines = e.target.result.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      _csvRows = lines.slice(1).map(line => {
        const vals = parseCSVLine(line);
        const obj = {};
        headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim().replace(/^"|"$/g, ''); });
        return obj;
      }).filter(r => r.nome);

      const preview = document.getElementById('csv-preview');
      preview.textContent = `${_csvRows.length} leads detectados — primeiros 3: ` +
        _csvRows.slice(0, 3).map(r => r.nome).join(', ');
      document.getElementById('btn-import-confirm').disabled = _csvRows.length === 0;
    };
    reader.readAsText(file, 'UTF-8');
  }

  /** Importa CSV para o Supabase */
  async function importCSV() {
    if (!_csvRows.length) return;
    const btn = document.getElementById('btn-import-confirm');
    btn.disabled = true;
    btn.textContent = 'Importando...';

    // Normaliza campos
    const rows = _csvRows.map(r => ({
      nome:         r.nome         || '',
      nicho:        r.nicho        || '',
      tel:          r.tel          || '',
      end:          r.end          || '',
      cidade:       r.cidade       || '',
      gmaps:        r.gmaps        || '',
      site:         r.site         || 'Não',
      siteUrl:      r.siteUrl      || '',
      social:       r.social       || '',
      dono:         r.dono         || '',
      concorrentes: r.concorrentes || '',
      status:       r.status       || 'Não contatado',
      data1:        r.data1        || null,
      dataFU:       r.dataFU       || null,
      obs:          r.obs          || '',
      varExtra:     r.varExtra     || '',
    }));

    // Insere em batches de 100
    const BATCH = 100;
    let total = 0;
    for (let i = 0; i < rows.length; i += BATCH) {
      const { error } = await App.db.from(TABLE).insert(rows.slice(i, i + BATCH));
      if (error) { UI.toast('Erro na importação: ' + error.message, 'red'); break; }
      total += Math.min(BATCH, rows.length - i);
    }

    UI.toast(`${total} leads importados ✓`, 'green');
    _csvRows = [];
    UI.closeImport();
    await App.reload();
  }

  /** Exporta leads filtrados para CSV */
  function exportCSV() {
    const data = UI.filtered();
    if (!data.length) { UI.toast('Nenhum lead para exportar', 'red'); return; }

    const cols = ['id','nome','nicho','tel','end','cidade','gmaps','site','siteUrl',
                  'social','dono','concorrentes','status','data1','dataFU','obs','varExtra'];
    const header = cols.join(',');
    const rows = data.map(l =>
      cols.map(c => `"${(l[c] || '').toString().replace(/"/g, '""')}"`).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    UI.toast(`${data.length} leads exportados ✓`, 'green');
  }

  /** Abre template WhatsApp para um lead */
  function openTemplate(id, isGestor = false) {
    const lead = _all.find(l => l.id === id);
    if (!lead) return;
    const msg = buildMessage(lead, isGestor);
    document.getElementById('template-text').value = msg;
    document.getElementById('modal-template').dataset.tel = lead.tel || '';
    document.getElementById('modal-template').style.display = 'flex';
  }

  // helpers
  function getEditId() { return _editId; }
  function clearEditId() { _editId = null; }

  /** Parse simples de linha CSV respeitando aspas */
  function parseCSVLine(line) {
    const result = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { result.push(cur); cur = ''; }
      else { cur += ch; }
    }
    result.push(cur);
    return result;
  }

  return { fetchAll, getAll, edit, save, cycleStatus, remove, previewCSV, importCSV, exportCSV, openTemplate, getEditId, clearEditId };
})();
