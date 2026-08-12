/* ==========================================================================
   LIFE OS ANALYTICS ENGINE — DYNAMIC THEME-AWARE CHART.JS INTEGRATION
   Chart Registry Pattern: all instances tracked by canvas ID, auto-destroyed
   on re-render and theme toggle.
   ========================================================================== */

// --- CHART INSTANCE REGISTRY ---
const chartRegistry = new Map();

/**
 * Get or create a Chart.js instance. Automatically destroys any existing
 * chart on the same canvas before creating a new one — prevents canvas reuse
 * warnings and memory leaks from orphaned instances.
 */
function createChart(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  // Destroy existing instance on this canvas
  if (chartRegistry.has(canvasId)) {
    try {
      chartRegistry.get(canvasId).destroy();
    } catch (e) {
      console.warn('Chart destroy failed for', canvasId, e);
    }
    chartRegistry.delete(canvasId);
  }

  const instance = new Chart(canvas, config);
  chartRegistry.set(canvasId, instance);
  return instance;
}

/**
 * Destroy all tracked chart instances. Called on view navigation away from
 * a chart-containing view and on theme toggle to fully reset the canvas state.
 */
window.destroyAllCharts = function() {
  chartRegistry.forEach((chart, id) => {
    try {
      chart.destroy();
    } catch (e) {
      console.warn('Chart destroy failed for', id, e);
    }
  });
  chartRegistry.clear();
};

function getChartColors() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  return {
    textColor: isLight ? '#475569' : '#94A3B8',
    gridColor: isLight ? '#E2E8F0' : '#1E293B',
    emerald: isLight ? '#059669' : '#10B981',
    cyan: isLight ? '#0891B2' : '#06B6D4',
    rose: isLight ? '#E11D48' : '#EF4444',
    amber: isLight ? '#D97706' : '#F59E0B',
    purple: isLight ? '#9333EA' : '#A855F7'
  };
}

window.renderDashboardCharts = function(data) {
  const entries = data.dailyEntries || [];
  const dates = entries.map(e => e.date ? e.date.slice(5) : '');
  const cigs = entries.map(e => e.cigarettes || 0);
  const screens = entries.map(e => e.screenTimeHrs || 0);
  const c = getChartColors();

  // Cigarettes Chart
  const cigsCanvasId = document.getElementById('chart-cigs') ? 'chart-cigs' : 'chart-habits-cigs';
  createChart(cigsCanvasId, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Cigarettes Smoked (Target < 4)',
        data: cigs,
        borderColor: c.rose,
        backgroundColor: c.rose + '20',
        fill: true,
        tension: 0.3,
        borderWidth: 2.5
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: c.textColor, font: { family: 'Outfit', weight: '600' } } } },
      scales: {
        x: { ticks: { color: c.textColor, font: { family: 'Inter' } }, grid: { color: c.gridColor } },
        y: { min: 0, max: 10, ticks: { color: c.textColor, font: { family: 'Inter' } }, grid: { color: c.gridColor } }
      }
    }
  });

  // Screen Time Chart
  const screenCanvasId = document.getElementById('chart-screen') ? 'chart-screen' : 'chart-habits-screen';
  createChart(screenCanvasId, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Rec Screen Time (Hrs)',
        data: screens,
        borderColor: c.cyan,
        backgroundColor: c.cyan + '20',
        fill: true,
        tension: 0.3,
        borderWidth: 2.5
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: c.textColor, font: { family: 'Outfit', weight: '600' } } } },
      scales: {
        x: { ticks: { color: c.textColor, font: { family: 'Inter' } }, grid: { color: c.gridColor } },
        y: { min: 0, max: 5, ticks: { color: c.textColor, font: { family: 'Inter' } }, grid: { color: c.gridColor } }
      }
    }
  });
};

window.renderHabitCharts = function(data) {
  window.renderDashboardCharts(data);
};

window.renderSalesCharts = function(data) {
  const salesLogs = data.salesLogs || [];
  const dates = salesLogs.map(s => s.date ? s.date.slice(5) : '');
  const calls = salesLogs.map(s => s.calls || 0);
  const meets = salesLogs.map(s => s.meets || 0);
  const closes = salesLogs.map(s => s.closes || 0);
  const c = getChartColors();

  createChart('chart-sales-funnel', {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [
        { label: 'Calls', data: calls, backgroundColor: c.cyan },
        { label: 'Meetings Booked', data: meets, backgroundColor: c.amber },
        { label: 'Closings', data: closes, backgroundColor: c.emerald }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: c.textColor, font: { family: 'Outfit', weight: '600' } } } },
      scales: {
        x: { ticks: { color: c.textColor, font: { family: 'Inter' } }, grid: { color: c.gridColor } },
        y: { ticks: { color: c.textColor, font: { family: 'Inter' } }, grid: { color: c.gridColor } }
      }
    }
  });
};

window.renderRadarChart = function(data) {
  const scores = data.reflections?.quarterlyScoreboard || {};
  const labels = Object.keys(scores);
  const values = Object.values(scores);
  const c = getChartColors();

  createChart('chart-radar', {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Life Balance Score (1-10)',
        data: values,
        borderColor: c.purple,
        backgroundColor: c.purple + '30',
        borderWidth: 2.5
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: c.textColor, font: { family: 'Outfit', weight: '600' } } } },
      scales: {
        r: {
          angleLines: { color: c.gridColor },
          grid: { color: c.gridColor },
          pointLabels: { color: c.textColor, font: { family: 'Outfit', size: 11, weight: '600' } },
          ticks: { display: false, min: 0, max: 10 }
        }
      }
    }
  });
};
