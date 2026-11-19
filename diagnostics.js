(() => {
  const tabs = [...document.querySelectorAll('[data-diagnostic]')];
  const select = document.getElementById('diagnostic-select');
  const panel = document.getElementById('diagnostic-panel');
  const image = document.getElementById('diagnostic-image');
  const imageLink = document.getElementById('diagnostic-image-link');
  const original = document.getElementById('diagnostic-original');

  function showDimension(key, updateHash = true) {
    const selected = tabs.find(tab => tab.dataset.diagnostic === key);
    if (!selected) return false;
    const title = selected.textContent;
    const description = selected.dataset.description;
    tabs.forEach(tab => {
      tab.setAttribute('aria-selected', String(tab === selected));
      tab.tabIndex = tab === selected ? 0 : -1;
    });
    select.value = key;
    panel.setAttribute('aria-labelledby', selected.id);
    document.getElementById('diagnostic-title').textContent = title;
    document.getElementById('diagnostic-description').textContent = description;
    document.getElementById('diagnostic-chart-caption').textContent = `${title}. Scores range from 0 to 100; higher is better.`;
    const source = `assets/diagnostics/${key}.png`;
    image.src = source;
    image.alt = `Radar chart comparing six models on ${title}: ${description}`;
    imageLink.href = source;
    imageLink.setAttribute('aria-label', `Open ${title} chart at full resolution`);
    original.href = source;
    if (updateHash) {
      // Some local-file browsers restrict history changes; selection still works.
      try { history.replaceState(null, '', `#diagnostic-${key}`); } catch {}
    }
    return true;
  }

  function readHash() {
    if (!location.hash.startsWith('#diagnostic-')) return;
    if (showDimension(location.hash.slice('#diagnostic-'.length), false)) {
      document.getElementById('diagnostics').scrollIntoView({ block: 'start' });
    }
  }

  tabs.forEach(tab => tab.addEventListener('click', () => showDimension(tab.dataset.diagnostic)));
  select.addEventListener('change', () => showDimension(select.value));
  window.addEventListener('hashchange', readHash);
  if (document.readyState === 'complete') readHash();
  else window.addEventListener('load', readHash, { once: true });
})();
