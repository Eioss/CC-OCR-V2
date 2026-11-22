'use strict';

(() => {
  const examples = window.CCOCR_EXAMPLES;
  if (!examples) return;
  const byId = id => document.getElementById(id);
  const indexByTask = { recognition: 0, parsing: 0, grounding: 0, extraction: 0, qa: 0 };
  let task = 'recognition';
  let expanded = false;
  let enlarged = false;

  const current = () => examples[task][indexByTask[task]];
  const frame = byId('case-image-frame');
  const wrap = byId('case-image-wrap');
  const scrollBadge = byId('case-scroll-badge');
  let img = byId('case-image');
  const previews = new Map();
  let nearby = false;

  function preview(item) {
    if (!previews.has(item.id)) {
      const picture = new Image();
      picture.alt = item.title + '. ' + item.description;
      picture.onerror = () => {
        picture.onerror = null;
        picture.src = item.image;
      };
      picture.src = 'assets/examples/preview/' + item.id + '.webp';
      previews.set(item.id, picture);
    }
    return previews.get(item.id);
  }

  function prepare() {
    if (!navigator.connection?.saveData) {
      examples[task].forEach(item => preview(item).decode().catch(() => {}));
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      nearby = true;
      observer.disconnect();
      prepare();
    }, { rootMargin: '500px' });
    observer.observe(frame);
  }

  function updateScrollBadge() {
    if (!scrollBadge) return;
    const canScrollV = frame.scrollHeight - frame.clientHeight > 24;
    const canScrollH = frame.scrollWidth - frame.clientWidth > 24;
    if (!enlarged || (!canScrollV && !canScrollH)) {
      scrollBadge.hidden = true;
      return;
    }
    scrollBadge.hidden = false;
    scrollBadge.textContent = canScrollH && !canScrollV ? 'Scroll image ↔' : 'Scroll image ↕';
  }

  frame.addEventListener('scroll', () => {
    if (scrollBadge && !scrollBadge.hidden) scrollBadge.hidden = true;
  }, { passive: true });

  function showAnswer() {
    const item = current();
    const long = item.answer.length > 480;
    const excerpt = item.answer.slice(0, 360).replace(/\s+\S*$/, '') + '…';
    byId('example-answer').textContent = long && !expanded ? excerpt : item.answer;
    byId('example-answer-label').textContent = item.answerLabel + (long && !expanded ? ' (excerpt)' : '');
    byId('example-expand').hidden = !long;
    byId('example-expand').textContent = expanded ? 'Show excerpt' : 'Show full answer';
    byId('example-expand').setAttribute('aria-expanded', String(expanded));
  }

  function focusImage() {
    if (!enlarged) {
      frame.scrollTop = 0;
      frame.scrollLeft = 0;
      updateScrollBadge();
      return;
    }
    const item = current();
    const y = item.box ? (item.box[1] + item.box[3]) / 2000 : (item.focusY || 0.25);
    const x = item.box ? (item.box[0] + item.box[2]) / 2000 : 0.5;
    frame.scrollTop = Math.max(0, wrap.offsetHeight * y - frame.clientHeight / 2);
    frame.scrollLeft = Math.max(0, wrap.offsetWidth * x - frame.clientWidth / 2);
    updateScrollBadge();
  }

  function getDimensions(item) {
    if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      // Preserve true aspect ratio from decoded image while keeping full-res metadata scale
      const loadedRatio = img.naturalWidth / img.naturalHeight;
      const metaRatio = item.width / item.height;
      if ((loadedRatio > 1) !== (metaRatio > 1)) {
        return { width: item.height, height: item.width };
      }
    }
    return { width: item.width, height: item.height };
  }

  function canZoom(item) {
    const { width, height } = getDimensions(item);
    return width > 460 || height > 460;
  }

  function setImageSize() {
    const item = current();
    const { width: natW, height: natH } = getDimensions(item);
    const ratio = natW / natH;
    const zoomable = canZoom(item);
    if (!zoomable) enlarged = false;

    const layout = byId('case-layout');
    const isWide = ratio > 3.2;
    layout.classList.toggle('is-wide', isWide);
    frame.classList.toggle('is-enlarged', enlarged);

    const containerW = Math.max(280, layout.clientWidth || 960);
    const halfW = Math.round(containerW * 0.5);

    if (!enlarged) {
      wrap.style.width = '100%';
      if (isWide) {
        layout.style.removeProperty('--visual-col');
        layout.style.removeProperty('--mobile-visual-max');
      } else if (natW < 320) {
        // Small native image (e.g. 98x95 seal): compact column tightly hugging image
        const compactW = Math.max(180, Math.round(natW * 2));
        layout.style.setProperty('--visual-col', `${compactW}px`);
        layout.style.setProperty('--mobile-visual-max', `${compactW}px`);
      } else if (ratio < 0.82) {
        // Tall portrait document in fit-whole mode: hug image aspect ratio cleanly
        const fitW = Math.min(halfW, Math.max(150, Math.round(410 * ratio)));
        layout.style.setProperty('--visual-col', `${fitW}px`);
        layout.style.setProperty('--mobile-visual-max', `${fitW}px`);
      } else if (natW < halfW) {
        // Medium square/landscape image smaller than half-width (e.g. 404x403 label)
        layout.style.setProperty('--visual-col', `${natW}px`);
        layout.style.setProperty('--mobile-visual-max', `${natW}px`);
      } else {
        layout.style.removeProperty('--visual-col');
        layout.style.removeProperty('--mobile-visual-max');
      }
    } else {
      layout.style.removeProperty('--visual-col');
      layout.style.removeProperty('--mobile-visual-max');
      const frameW = Math.max(240, frame.clientWidth);
      if (ratio >= 0.82) {
        const zoomedW = Math.min(natW, Math.max(Math.round(frameW * 1.8), 840));
        wrap.style.width = `${zoomedW}px`;
      } else {
        wrap.style.width = '100%';
      }
    }

    byId('example-zoom').hidden = !zoomable;
    byId('example-zoom').textContent = enlarged ? 'Fit whole image' : 'Enlarge image';
    byId('example-zoom').setAttribute('aria-pressed', String(enlarged));
    byId('example-res').textContent = `${natW} × ${natH} px`;
    requestAnimationFrame(focusImage);
  }

  window.addEventListener('resize', () => requestAnimationFrame(setImageSize), { passive: true });

  function renderCasePills() {
    const container = byId('example-case-pills');
    if (!container) return;
    container.innerHTML = '';
    examples[task].forEach((entry, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-pressed', String(idx === indexByTask[task]));
      btn.textContent = `${idx + 1}. ${entry.title}`;
      btn.addEventListener('click', () => {
        if (indexByTask[task] === idx) return;
        const delta = idx - indexByTask[task];
        indexByTask[task] = idx;
        render(delta);
      });
      container.appendChild(btn);
    });
  }

  function renderTags(item) {
    const container = byId('example-tags');
    if (!container) return;
    container.innerHTML = '';

    if (item.categoryLabel && item.categoryKey) {
      const catBtn = document.createElement('button');
      catBtn.type = 'button';
      catBtn.className = 'example-tag example-tag-category';
      catBtn.title = `View ${item.categoryLabel} in Leaderboard`;
      catBtn.textContent = item.categoryLabel;
      catBtn.addEventListener('click', () => {
        window.CCOCR_NAV?.jumpToCategory(item.categoryKey);
      });
      container.appendChild(catBtn);
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
        container.appendChild(tagBtn);
      }
    }
  }

  let entrance;
  function render(direction = 0) {
    const item = current();
    expanded = false;
    enlarged = canZoom(item) && (task === 'qa' || (task === 'grounding' && item.width / item.height < 2.2));

    renderCasePills();
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

    const next = preview(item);
    if (img !== next) {
      img.onload = null;
      next.id = 'case-image';
      img.replaceWith(next);
      img = next;
    }
    next.onload = () => setImageSize();
    if (nearby) prepare();
    showAnswer();
    setImageSize();

    entrance?.cancel();
    if (direction && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      entrance = byId('case-layout').animate([
        { transform: `translateX(${Math.sign(direction) * 6}px)`, opacity: 0.9 },
        { transform: 'translateX(0)', opacity: 1 }
      ], { duration: 145, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
  }

  document.querySelectorAll('[data-example-task]').forEach(button => {
    button.addEventListener('click', () => {
      if (task === button.dataset.exampleTask) return;
      const order = Object.keys(indexByTask);
      const direction = order.indexOf(button.dataset.exampleTask) - order.indexOf(task);
      task = button.dataset.exampleTask;
      document.querySelectorAll('[data-example-task]').forEach(tab => {
        const active = tab === button;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      render(direction);
    });
  });

  function move(delta) {
    indexByTask[task] = (indexByTask[task] + delta + examples[task].length) % examples[task].length;
    render(delta);
  }

  byId('example-prev').addEventListener('click', () => move(-1));
  byId('example-next').addEventListener('click', () => move(1));
  byId('example-expand').addEventListener('click', () => {
    expanded = !expanded;
    showAnswer();
  });
  byId('example-zoom').addEventListener('click', () => {
    enlarged = !enlarged;
    setImageSize();
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
