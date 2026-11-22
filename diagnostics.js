'use strict';

(() => {
  const data = window.CCOCR_DIAGNOSTICS;
  const tabs = [...document.querySelectorAll('[data-diagnostic]')];
  const select = document.getElementById('diagnostic-select');
  const panel = document.getElementById('diagnostic-panel');
  const svg = document.getElementById('diagnostic-svg');
  const fallbackFigure = document.getElementById('diagnostic-fallback-figure');
  const image = document.getElementById('diagnostic-image');
  const imageLink = document.getElementById('diagnostic-image-link');
  const original = document.getElementById('diagnostic-original');
  const legendEl = document.getElementById('diagnostic-legend');
  const resetBtn = document.getElementById('diagnostic-reset-models');
  const readoutAxisTitle = document.getElementById('readout-axis-title');
  const readoutEyebrow = document.getElementById('readout-eyebrow');
  const readoutBars = document.getElementById('readout-bars');

  const NS = 'http://www.w3.org/2000/svg';
  const VIEW_W = 560;
  const VIEW_H = 396;
  const CX = 280;
  const CY = 200;
  const R = 142;
  const RINGS = [20, 40, 60, 80, 100];
  const BASELINE_LABELS = new Set(['No Issue', 'Clear Image', 'No Interference', 'Non-mixed Layout', 'Reproduced Image']);

  let currentKey = 'layout';
  let activeAxis = 0;
  let hoveredModel = null;
  const selectedModels = new Set();

  function createSvg(tag, attrs = {}) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
    return el;
  }

  function wrapLabel(text, maxChars = 15) {
    const words = text.split(/\s+/);
    const lines = [];
    let current = '';
    for (const word of words) {
      if (!current) {
        current = word;
      } else if ((current + ' ' + word).length <= maxChars) {
        current += ' ' + word;
      } else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function axisMean(dim, idx) {
    const vals = data.models.map(m => dim.scores[m.id][idx]);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  function bottleneckIndex(dim) {
    let minIdx = 0;
    let minVal = Infinity;
    dim.axes.forEach((_, idx) => {
      const mean = axisMean(dim, idx);
      if (mean < minVal) {
        minVal = mean;
        minIdx = idx;
      }
    });
    return minIdx;
  }

  function isModelActive(modelId) {
    if (hoveredModel) return modelId === hoveredModel;
    if (selectedModels.size > 0) return selectedModels.has(modelId);
    return true;
  }

  function renderLegend() {
    if (!data || !legendEl) return;
    legendEl.innerHTML = '';
    for (const m of data.models) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.setProperty('--model-color', m.color);
      btn.textContent = m.name;
      const selected = selectedModels.has(m.id);
      const muted = selectedModels.size > 0 && !selected;
      btn.setAttribute('aria-pressed', String(selected));
      btn.classList.toggle('is-selected', selected);
      btn.classList.toggle('is-muted', muted);

      btn.addEventListener('pointerenter', () => {
        hoveredModel = m.id;
        updateHighlightStates();
      });
      btn.addEventListener('pointerleave', () => {
        hoveredModel = null;
        updateHighlightStates();
      });
      btn.addEventListener('click', () => {
        if (selectedModels.has(m.id)) selectedModels.delete(m.id);
        else selectedModels.add(m.id);
        if (selectedModels.size === data.models.length) selectedModels.clear();
        resetBtn.hidden = selectedModels.size === 0;
        renderLegend();
        updateHighlightStates();
      });
      legendEl.appendChild(btn);
    }
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      selectedModels.clear();
      hoveredModel = null;
      resetBtn.hidden = true;
      renderLegend();
      updateHighlightStates();
    });
  }

  function renderReadout() {
    if (!data) return;
    const dim = data.dimensions[currentKey];
    const axisName = dim.axes[activeAxis];
    const hardestIdx = bottleneckIndex(dim);

    readoutAxisTitle.textContent = axisName;
    if (activeAxis === hardestIdx) {
      readoutEyebrow.textContent = 'Bottleneck condition';
    } else if (BASELINE_LABELS.has(axisName)) {
      readoutEyebrow.textContent = 'Reference condition';
    } else {
      readoutEyebrow.textContent = 'Condition breakdown';
    }

    const ranked = data.models
      .map(m => ({ ...m, score: dim.scores[m.id][activeAxis] }))
      .sort((a, b) => b.score - a.score);

    readoutBars.innerHTML = ranked.map(item => {
      const dimmed = !isModelActive(item.id);
      return `<div class="readout-row ${dimmed ? 'is-dimmed' : ''}" data-readout-model="${item.id}" style="--model-color:${item.color}">
        <span class="readout-model" title="${item.name}"><span class="readout-dot"></span>${item.name}</span>
        <span class="readout-track"><span class="readout-fill" style="--bar-width:${Math.max(2, item.score)}%"></span></span>
        <span class="readout-score">${item.score.toFixed(2)}</span>
      </div>`;
    }).join('');
  }

  function updateHighlightStates() {
    if (!svg || !data) return;
    const hasFilter = Boolean(hoveredModel) || selectedModels.size > 0;
    svg.querySelectorAll('[data-model-poly]').forEach(poly => {
      const id = poly.getAttribute('data-model-poly');
      const active = isModelActive(id);
      const spotlight = hoveredModel === id || (selectedModels.size === 1 && selectedModels.has(id));
      poly.setAttribute('stroke-opacity', active ? '0.96' : '0.16');
      poly.setAttribute('fill-opacity', spotlight ? '0.13' : active && !hasFilter ? '0.03' : active ? '0.08' : '0');
      poly.setAttribute('stroke-width', spotlight ? '2.8' : active ? '2.1' : '1.4');
    });

    svg.querySelectorAll('[data-model-dots]').forEach(group => {
      const id = group.getAttribute('data-model-dots');
      const active = isModelActive(id);
      group.setAttribute('opacity', active ? '1' : '0.16');
      group.querySelectorAll('circle').forEach((dot, idx) => {
        dot.setAttribute('r', idx === activeAxis && active ? '4.6' : '3');
        dot.setAttribute('stroke-width', idx === activeAxis && active ? '1.8' : '1.2');
      });
    });

    svg.querySelectorAll('[data-spoke-line]').forEach((line, idx) => {
      const isAct = idx === activeAxis;
      line.setAttribute('stroke', isAct ? '#1d1d1f' : '#e8e8ed');
      line.setAttribute('stroke-width', isAct ? '1.4' : '1');
      line.setAttribute('stroke-dasharray', isAct ? '3 3' : 'none');
    });

    svg.querySelectorAll('.radar-axis-label').forEach((lbl, idx) => {
      lbl.classList.toggle('is-active', idx === activeAxis);
    });

    renderReadout();
  }

  function renderRadar() {
    if (!data || !svg) return;
    const dim = data.dimensions[currentKey];
    const N = dim.axes.length;
    svg.innerHTML = '';

    const gridGroup = createSvg('g');
    // Clean Apple-style hairline concentric rings
    for (let i = RINGS.length - 1; i >= 0; i--) {
      const val = RINGS[i];
      const rad = (val / 100) * R;
      gridGroup.appendChild(createSvg('circle', {
        cx: CX,
        cy: CY,
        r: rad.toFixed(2),
        fill: val === 100 ? '#fbfbfd' : 'none',
        stroke: val === 100 ? '#d2d2d7' : '#e8e8ed',
        'stroke-width': '1'
      }));
    }

    // Radial spokes
    const angles = dim.axes.map((_, idx) => -Math.PI / 2 + (2 * Math.PI * idx) / N);
    angles.forEach((angle, idx) => {
      const x2 = CX + R * Math.cos(angle);
      const y2 = CY + R * Math.sin(angle);
      gridGroup.appendChild(createSvg('line', {
        x1: CX,
        y1: CY,
        x2: x2.toFixed(2),
        y2: y2.toFixed(2),
        stroke: '#d5dde6',
        'stroke-width': '1',
        'data-spoke-line': idx
      }));
    });
    svg.appendChild(gridGroup);

    // Model polygons
    const polyGroup = createSvg('g');
    const dotsGroup = createSvg('g');
    for (const m of data.models) {
      const scores = dim.scores[m.id];
      const pts = scores.map((val, idx) => {
        const rad = (val / 100) * R;
        const x = CX + rad * Math.cos(angles[idx]);
        const y = CY + rad * Math.sin(angles[idx]);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      }).join(' ');

      polyGroup.appendChild(createSvg('polygon', {
        points: pts,
        fill: m.color,
        'fill-opacity': '0.03',
        stroke: m.color,
        'stroke-width': '2.1',
        'stroke-linejoin': 'round',
        class: 'radar-polygon',
        'data-model-poly': m.id
      }));

      const mDots = createSvg('g', { 'data-model-dots': m.id });
      scores.forEach((val, idx) => {
        const rad = (val / 100) * R;
        const x = CX + rad * Math.cos(angles[idx]);
        const y = CY + rad * Math.sin(angles[idx]);
        mDots.appendChild(createSvg('circle', {
          cx: x.toFixed(2),
          cy: y.toFixed(2),
          r: '3',
          fill: '#fff',
          stroke: m.color,
          'stroke-width': '1.3'
        }));
      });
      dotsGroup.appendChild(mDots);
    }
    svg.appendChild(polyGroup);
    svg.appendChild(dotsGroup);

    // Ring tick numbers placed along a quiet angle
    const tickGroup = createSvg('g');
    const tickAngle = N === 4 ? Math.PI / 4 : 0.34;
    for (const val of RINGS) {
      const rad = (val / 100) * R;
      const tx = CX + rad * Math.cos(tickAngle);
      const ty = CY + rad * Math.sin(tickAngle);
      const t = createSvg('text', {
        x: tx.toFixed(1),
        y: (ty + 3).toFixed(1),
        'text-anchor': 'middle',
        class: 'radar-tick'
      });
      t.textContent = String(val);
      tickGroup.appendChild(t);
    }
    svg.appendChild(tickGroup);

    // Axis labels
    const labelGroup = createSvg('g');
    const labelR = R + 17;
    dim.axes.forEach((axisText, idx) => {
      const angle = angles[idx];
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const lx = CX + labelR * cos;
      let ly = CY + labelR * sin;
      const lines = wrapLabel(axisText, Math.abs(cos) < 0.22 ? 22 : 15);
      const lineHeight = 14.5;

      let anchor = 'middle';
      if (cos > 0.2) anchor = 'start';
      else if (cos < -0.2) anchor = 'end';

      if (sin < -0.75) {
        ly -= (lines.length - 1) * lineHeight + 2;
      } else if (sin > 0.75) {
        ly += 10;
      } else {
        ly -= ((lines.length - 1) * lineHeight) / 2 - 4;
      }

      const textEl = createSvg('text', {
        x: lx.toFixed(1),
        y: ly.toFixed(1),
        'text-anchor': anchor,
        class: 'radar-axis-label',
        tabindex: '0',
        role: 'button',
        'aria-label': `Inspect ${axisText} scores`
      });

      lines.forEach((lineStr, lineIdx) => {
        const tspan = createSvg('tspan', {
          x: lx.toFixed(1),
          dy: lineIdx === 0 ? '0' : String(lineHeight)
        });
        tspan.textContent = lineStr;
        textEl.appendChild(tspan);
      });

      const activate = () => {
        if (activeAxis !== idx) {
          activeAxis = idx;
          updateHighlightStates();
        }
      };
      textEl.addEventListener('pointerenter', activate);
      textEl.addEventListener('click', activate);
      textEl.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
      labelGroup.appendChild(textEl);
    });
    svg.appendChild(labelGroup);

    updateHighlightStates();
  }

  // Smooth nearest-spoke tracking inside radar circle
  if (svg && data) {
    svg.addEventListener('pointermove', event => {
      const rect = svg.getBoundingClientRect();
      if (!rect.width) return;
      const sx = ((event.clientX - rect.left) / rect.width) * VIEW_W;
      const sy = ((event.clientY - rect.top) / rect.height) * VIEW_H;
      const dist = Math.hypot(sx - CX, sy - CY);
      if (dist < 14 || dist > R + 42) return;
      const dim = data.dimensions[currentKey];
      const N = dim.axes.length;
      let norm = Math.atan2(sy - CY, sx - CX) + Math.PI / 2;
      if (norm < 0) norm += 2 * Math.PI;
      const nearest = Math.round((norm / (2 * Math.PI)) * N) % N;
      if (nearest !== activeAxis) {
        activeAxis = nearest;
        updateHighlightStates();
      }
    });
  }

  function showDimension(key, updateHash = true, preferredAxisLabel = null) {
    const selected = tabs.find(tab => tab.dataset.diagnostic === key);
    if (!selected) return false;
    currentKey = key;

    const dim = data?.dimensions?.[key];
    const title = dim?.title || selected.textContent;
    const description = dim?.description || selected.dataset.description;

    tabs.forEach(tab => {
      tab.setAttribute('aria-selected', String(tab === selected));
      tab.tabIndex = tab === selected ? 0 : -1;
    });
    select.value = key;
    panel.setAttribute('aria-labelledby', selected.id);
    document.getElementById('diagnostic-title').textContent = title;
    document.getElementById('diagnostic-description').textContent = description;
    document.getElementById('diagnostic-chart-caption').textContent =
      `${title}. Scores range from 0 to 100; higher is better.`;

    const source = `assets/diagnostics/${key}.png`;
    if (image) {
      image.src = source;
      image.alt = `Radar chart comparing six models on ${title}: ${description}`;
    }
    if (imageLink) imageLink.href = source;
    if (original) original.href = source;

    if (dim && svg) {
      const matchedIdx = preferredAxisLabel ? dim.axes.indexOf(preferredAxisLabel) : -1;
      activeAxis = matchedIdx >= 0 ? matchedIdx : bottleneckIndex(dim);
      svg.hidden = false;
      if (fallbackFigure) fallbackFigure.hidden = true;
      renderRadar();
    } else if (fallbackFigure) {
      if (svg) svg.hidden = true;
      fallbackFigure.hidden = false;
    }

    if (updateHash) {
      try { history.replaceState(null, '', `#diagnostic-${key}`); } catch {}
    }
    return true;
  }

  window.CCOCR_DIAG_NAV = {
    open(key, axisLabel) {
      if (showDimension(key, true, axisLabel)) {
        document.getElementById('diagnostics').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  function readHash() {
    if (!location.hash.startsWith('#diagnostic-')) return;
    if (showDimension(location.hash.slice('#diagnostic-'.length), false)) {
      document.getElementById('diagnostics').scrollIntoView({ block: 'start' });
    }
  }

  tabs.forEach(tab => tab.addEventListener('click', () => showDimension(tab.dataset.diagnostic)));
  select.addEventListener('change', () => showDimension(select.value));
  window.addEventListener('hashchange', readHash);

  renderLegend();
  showDimension('layout', false);
  if (document.readyState === 'complete') readHash();
  else window.addEventListener('load', readHash, { once: true });
})();
