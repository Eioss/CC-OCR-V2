'use strict';

(() => {
  const examples = window.CCOCR_EXAMPLES;
  if (!examples) return;
  const byId = id => document.getElementById(id);
  const indexByTask = { recognition: 0, parsing: 0, grounding: 0, extraction: 0, qa: 0 };
  let task = 'recognition';
  let renderedPillsTask = null;
  let expanded = false;
  let enlarged = false;

  const current = () => examples[task][indexByTask[task]];
  const layout = byId('case-layout');
  const frame = byId('case-image-frame');
  const wrap = byId('case-image-wrap');
  const scrollBadge = byId('case-scroll-badge');
  const initialImg = byId('case-image');

  // Track container width passively via ResizeObserver to avoid forced synchronous reflow on clicks
  let cachedLayoutWidth = layout.clientWidth || 920;
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0 && Math.abs(w - cachedLayoutWidth) > 1) {
          cachedLayoutWidth = w;
          applyImageSizing(current());
        }
      }
    });
    ro.observe(layout);
  } else {
    window.addEventListener('resize', () => {
      cachedLayoutWidth = layout.clientWidth || 920;
      applyImageSizing(current());
    }, { passive: true });
  }

  // Mount & pre-decode all 10 lightweight WebP previews once so switching is a <1ms visibility toggle
  const imageNodes = new Map();
  let activeImg = null;

  function ensureImageNode(item, eager = false) {
    let node = imageNodes.get(item.id);
    if (!node) {
      if (initialImg && item.id === '86307ef9eb94' && !imageNodes.size) {
        node = initialImg;
        node.removeAttribute('id');
      } else {
        node = document.createElement('img');
        node.decoding = 'async';
        node.src = 'assets/examples/preview/' + item.id + '.webp';
        node.onerror = () => {
          node.onerror = null;
          node.src = item.image;
        };
        node.hidden = true;
        wrap.insertBefore(node, byId('case-box'));
      }
      node.alt = item.title + '. ' + item.description;
      imageNodes.set(item.id, node);
    }
    if (eager && node.decode) {
      node.decode().catch(() => {});
    }
    return node;
  }

  // Seed initial image node immediately, then pre-decode all remaining examples during idle time
  ensureImageNode(current(), true);

  let allWarmed = false;
  function warmAllExamples() {
    if (allWarmed || navigator.connection?.saveData) return;
    allWarmed = true;
    const allItems = Object.values(examples).flat();
    let idx = 0;
    const step = () => {
      if (idx >= allItems.length) return;
      ensureImageNode(allItems[idx++], true);
      if ('requestIdleCallback' in window) {
        requestIdleCallback(step, { timeout: 400 });
      } else {
        setTimeout(step, 24);
      }
    };
    step();
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      io.disconnect();
      warmAllExamples();
    }, { rootMargin: '1200px' });
    io.observe(byId('examples'));
  } else {
    window.addEventListener('load', warmAllExamples, { once: true });
  }

  function updateScrollBadge() {
    if (!scrollBadge) return;
    if (!enlarged) {
      scrollBadge.hidden = true;
      return;
    }
    const canScrollV = frame.scrollHeight - frame.clientHeight > 24;
    const canScrollH = frame.scrollWidth - frame.clientWidth > 24;
    if (!canScrollV && !canScrollH) {
      scrollBadge.hidden = true;
      return;
    }
    scrollBadge.hidden = false;
    scrollBadge.textContent = canScrollH && !canScrollV ? 'Scroll ↔' : 'Scroll ↕';
  }

  frame.addEventListener('scroll', () => {
    if (scrollBadge && !scrollBadge.hidden) scrollBadge.hidden = true;
  }, { passive: true });

  function showAnswer(item) {
    const long = item.answer.length > 480;
    const excerpt = long ? item.answer.slice(0, 360).replace(/\s+\S*$/, '') + '…' : item.answer;
    byId('example-answer').textContent = long && !expanded ? excerpt : item.answer;
    byId('example-answer-label').textContent = item.answerLabel + (long && !expanded ? ' (excerpt)' : '');
    byId('example-expand').hidden = !long;
    byId('example-expand').textContent = expanded ? 'Show excerpt' : 'Show full answer';
    byId('example-expand').setAttribute('aria-expanded', String(expanded));
  }

  function canZoom(item) {
    return item.width > 460 || item.height > 460;
  }

  function applyImageSizing(item) {
    const natW = item.width;
    const natH = item.height;
    const ratio = natW / natH;
    const zoomable = canZoom(item);
    if (!zoomable) enlarged = false;

    const isWide = ratio > 3.2;
    layout.classList.toggle('is-wide', isWide);
    frame.classList.toggle('is-enlarged', enlarged);

    // Reserve exact intrinsic aspect ratio on wrapper so layout never shifts by even 1px
    wrap.style.aspectRatio = `${natW} / ${natH}`;

    const containerW = Math.max(280, cachedLayoutWidth);
    const halfW = Math.round(containerW * 0.5);

    if (!enlarged) {
      wrap.style.width = '100%';
      if (isWide) {
        layout.style.removeProperty('--visual-col');
        layout.style.removeProperty('--mobile-visual-max');
      } else if (natW < 320) {
        const compactW = Math.max(180, Math.round(natW * 2));
        layout.style.setProperty('--visual-col', `${compactW}px`);
        layout.style.setProperty('--mobile-visual-max', `${compactW}px`);
      } else if (ratio < 0.82) {
        const fitW = Math.min(halfW, Math.max(150, Math.round(410 * ratio)));
        layout.style.setProperty('--visual-col', `${fitW}px`);
        layout.style.setProperty('--mobile-visual-max', `${fitW}px`);
      } else if (natW < halfW) {
        layout.style.setProperty('--visual-col', `${natW}px`);
        layout.style.setProperty('--mobile-visual-max', `${natW}px`);
      } else {
        layout.style.removeProperty('--visual-col');
        layout.style.removeProperty('--mobile-visual-max');
      }
    } else {
      layout.style.removeProperty('--visual-col');
      layout.style.removeProperty('--mobile-visual-max');
      const approxFrameW = isWide ? containerW : Math.round((containerW - 32) * 0.51);
      if (ratio >= 0.82) {
        const zoomedW = Math.min(natW, Math.max(Math.round(approxFrameW * 1.8), 840));
        wrap.style.width = `${zoomedW}px`;
      } else {
        wrap.style.width = '100%';
      }
    }

    byId('example-zoom').hidden = !zoomable;
    byId('example-zoom').textContent = enlarged ? 'Fit whole image' : 'Enlarge image';
    byId('example-zoom').setAttribute('aria-pressed', String(enlarged));
    byId('example-res').textContent = `${natW} × ${natH} px`;

    if (!enlarged) {
      frame.scrollTop = 0;
      frame.scrollLeft = 0;
      if (scrollBadge) scrollBadge.hidden = true;
    } else {
      requestAnimationFrame(() => {
        if (!enlarged || item !== current()) return;
        const y = item.box ? (item.box[1] + item.box[3]) / 2000 : (item.focusY || 0.25);
        const x = item.box ? (item.box[0] + item.box[2]) / 2000 : 0.5;
        frame.scrollTop = Math.max(0, wrap.offsetHeight * y - frame.clientHeight / 2);
        frame.scrollLeft = Math.max(0, wrap.offsetWidth * x - frame.clientWidth / 2);
        updateScrollBadge();
      });
    }
  }

  function syncCasePills() {
    const container = byId('example-case-pills');
    if (!container) return;
    const activeIdx = indexByTask[task];

    // Only rebuild buttons when switching tracks; within the same track just flip aria-pressed
    if (renderedPillsTask !== task) {
      renderedPillsTask = task;
      const frag = document.createDocumentFragment();
      examples[task].forEach((entry, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-pressed', String(idx === activeIdx));
        btn.textContent = `${idx + 1} · ${entry.title}`;
        btn.addEventListener('click', () => {
          if (indexByTask[task] === idx) return;
          indexByTask[task] = idx;
          render();
        });
        frag.appendChild(btn);
      });
      container.replaceChildren(frag);
    } else {
      [...container.children].forEach((btn, idx) => {
        btn.setAttribute('aria-pressed', String(idx === activeIdx));
      });
    }
  }

  function renderTags(item) {
    const container = byId('example-tags');
    if (!container) return;
    const frag = document.createDocumentFragment();

    if (item.categoryLabel && item.categoryKey) {
      const catBtn = document.createElement('button');
      catBtn.type = 'button';
      catBtn.className = 'example-tag example-tag-category';
      catBtn.title = `View ${item.categoryLabel} in Leaderboard`;
      catBtn.textContent = item.categoryLabel;
      catBtn.addEventListener('click', () => {
        window.CCOCR_NAV?.jumpToCategory(item.categoryKey);
      });
      frag.appendChild(catBtn);
    }

    if (Array.isArray(item.tags)) {
      for (const tag of item.tags) {
        const tagBtn = document.createElement('button');
        tagBtn.type = 'button';
        tagBtn.className = 'example-tag';
        tagBtn.title = `Inspect ${tag.label} in Fine-Grained Diagnosis`;
        tagBtn.textContent = tag.label;
        tagBtn.addEventListener('click', () => {
          window.CCOCR_DIAG_NAV?.open(tag.diagnostic, tag.axis);
        });
        frag.appendChild(tagBtn);
      }
    }
    container.replaceChildren(frag);
  }

  function render() {
    const item = current();
    expanded = false;
    enlarged = canZoom(item) && (task === 'qa' || (task === 'grounding' && item.width / item.height < 2.2));

    syncCasePills();
    renderTags(item);

    byId('example-title').textContent = item.title;
    byId('example-description').textContent = item.description;
    byId('example-position').textContent = `${indexByTask[task] + 1} / ${examples[task].length}`;
    byId('example-prompt-label').textContent = item.promptAbridged ? 'Prompt (abridged)' : 'Prompt';
    byId('example-prompt').textContent = item.prompt;
    byId('example-answer-note').hidden = !item.answerNote;
    byId('example-answer-note').textContent = item.answerNote || '';
    byId('example-prompt-file').href = item.promptFile;
    byId('example-answer-file').href = item.answerFile;
    byId('example-image-link').href = item.image;
    byId('example-id').textContent = item.id;
    byId('example-panel').setAttribute('aria-labelledby', `example-${task}-tab`);

    const box = byId('case-box');
    box.hidden = !item.box;
    if (item.box) {
      const [x1, y1, x2, y2] = item.box;
      box.style.left = `${x1 / 10}%`;
      box.style.top = `${y1 / 10}%`;
      box.style.width = `${(x2 - x1) / 10}%`;
      box.style.height = `${(y2 - y1) / 10}%`;
    }

    // Instant pre-mounted image swap without DOM node destruction
    const nextImg = ensureImageNode(item, true);
    if (activeImg && activeImg !== nextImg) activeImg.hidden = true;
    nextImg.hidden = false;
    activeImg = nextImg;

    showAnswer(item);
    applyImageSizing(item);
  }

  document.querySelectorAll('[data-example-task]').forEach(button => {
    button.addEventListener('pointerenter', warmAllExamples, { once: true, passive: true });
    button.addEventListener('click', () => {
      if (task === button.dataset.exampleTask) return;
      task = button.dataset.exampleTask;
      document.querySelectorAll('[data-example-task]').forEach(tab => {
        const active = tab === button;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      render();
    });
  });

  function move(delta) {
    indexByTask[task] = (indexByTask[task] + delta + examples[task].length) % examples[task].length;
    render();
  }

  byId('example-prev').addEventListener('click', () => move(-1));
  byId('example-next').addEventListener('click', () => move(1));
  byId('example-expand').addEventListener('click', () => {
    expanded = !expanded;
    showAnswer(current());
  });
  byId('example-zoom').addEventListener('click', () => {
    enlarged = !enlarged;
    applyImageSizing(current());
  });

  const copyBtn = byId('copy-answer');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(current().answer);
        copyBtn.textContent = 'Copied';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1800);
      } catch {}
    });
  }

  render();
})();
