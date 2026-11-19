'use strict';
(() => {
  const examples = window.CCOCR_EXAMPLES;
  if (!examples) return;
  const byId = id => document.getElementById(id);
  const indexByTask = {recognition:0, parsing:0, grounding:0, extraction:0, qa:0};
  let task = 'recognition';
  let expanded = false;
  let enlarged = false;
  const current = () => examples[task][indexByTask[task]];
  const frame = byId('case-image-frame');
  const wrap = byId('case-image-wrap');
  const img = byId('case-image');
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
    if (!enlarged) { frame.scrollTop = 0; return; }
    const item = current();
    const y = item.box ? (item.box[1] + item.box[3]) / 2000 : (item.focusY || 0.25);
    frame.scrollTop = Math.max(0, wrap.offsetHeight * y - frame.clientHeight / 2);
  }
  function setImageSize() {
    const item = current();
    const wide = item.width / item.height > 3;
    byId('case-layout').classList.toggle('is-wide', wide);
    frame.classList.toggle('is-enlarged', enlarged);
    wrap.style.setProperty('--fit-width', `${Math.min(Math.max(item.width, 200), 420 * item.width / item.height)}px`);
    byId('example-zoom').hidden = wide;
    byId('example-zoom').textContent = enlarged ? 'Fit whole image' : 'Enlarge image';
    byId('example-zoom').setAttribute('aria-pressed', String(enlarged));
    requestAnimationFrame(focusImage);
  }
  function render() {
    const item = current();
    expanded = false;
    enlarged = task === 'qa' || (task === 'grounding' && item.width / item.height < 3);
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
      const [x1,y1,x2,y2] = item.box;
      box.style.left = `${x1 / 10}%`;
      box.style.top = `${y1 / 10}%`;
      box.style.width = `${(x2 - x1) / 10}%`;
      box.style.height = `${(y2 - y1) / 10}%`;
    }
    img.alt = item.title + '. ' + item.description;
    img.onload = focusImage;
    img.src = item.image;
    showAnswer();
    setImageSize();
  }
  document.querySelectorAll('[data-example-task]').forEach(button => {
    button.addEventListener('click', () => {
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
  byId('example-expand').addEventListener('click', () => { expanded = !expanded; showAnswer(); });
  byId('example-zoom').addEventListener('click', () => { enlarged = !enlarged; setImageSize(); });
  render();
})();
