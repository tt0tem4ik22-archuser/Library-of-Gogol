// Этот код написан чатом гпт, потому что мне лень думать над ним

(function () {
  const ID_PREFIX = 'load_txt'; 
  const TEXT_ROOT = '/';

  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  document.addEventListener('click', async function (e) {
    const a = e.target.closest('a');
    if (!a) return;

    if (!a.id || !a.id.startsWith(ID_PREFIX)) return;

    e.preventDefault();

    const linkText = (a.textContent || a.innerText || '').trim();
    if (!linkText) return;
    const fileName = encodeURIComponent(linkText) + '.txt';
    const url = TEXT_ROOT + fileName;

    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      const content = await res.text();
      const lines = content.replace(/\r/g, '').split('\n');
      const h2Text = (lines[0] || '').trim();
      const h1Text = (lines[1] || '').trim();

      const rest = lines.slice(2).join('\n').trim();

      const paragraphs = rest
        ? rest.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0)
        : [];

      const w = window.open('', '_blank');
      const doc = w.document;

      doc.open();
      doc.write('<!DOCTYPE html><html><head><meta charset="utf-8"/><title>' +
        escapeHtml(h1Text || linkText) +
        '</title><link rel="stylesheet" href="../../style/style.css" /></head><body></body></html>');
      doc.close();

      const body = doc.body;

      if (h2Text) {
        const el2 = doc.createElement('h2');
        el2.textContent = h2Text;
        body.appendChild(el2);
      }

      if (h1Text) {
        const el1 = doc.createElement('h1');
        el1.textContent = h1Text;
        body.appendChild(el1);
      }

      paragraphs.forEach(p => {
        const pEl = doc.createElement('p');
        pEl.textContent = p;
        body.appendChild(pEl);
      });
    } catch (err) {
      console.error('Не удалось загрузить файл текста', err);
    }
  });
})();