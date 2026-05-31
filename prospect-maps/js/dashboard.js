/**
 * dashboard.js
 * Renderiza os KPI cards no topo.
 */

const Dashboard = (() => {

  function render(leads) {
    const total      = leads.length;
    const semSite    = leads.filter(l => l.site === 'Não').length;
    const comTel     = leads.filter(l => l.tel).length;
    const enviados   = leads.filter(l => l.status === 'Enviado').length;
    const respondeu  = leads.filter(l => l.status === 'Respondeu').length;
    const negociou   = leads.filter(l => l.status === 'Negociou').length;
    const fechou     = leads.filter(l => l.status === 'Fechou').length;

    const kpis = [
      { label: 'Total de Leads', value: total,     cls: 'accent' },
      { label: '🔥 Sem Site',    value: semSite,   cls: 'red'    },
      { label: 'Com Telefone',   value: comTel,    cls: 'green'  },
      { label: 'Enviados',       value: enviados,  cls: 'accent' },
      { label: 'Responderam',    value: respondeu, cls: 'yellow' },
      { label: 'Negociando',     value: negociou,  cls: 'orange' },
      { label: '✅ Fechados',    value: fechou,    cls: 'green'  },
    ];

    document.getElementById('dashboard').innerHTML = kpis
      .map(k => `
        <div class="kpi-card">
          <span class="kpi-label">${k.label}</span>
          <span class="kpi-value ${k.cls}">${k.value}</span>
        </div>`)
      .join('');
  }

  return { render };
})();
