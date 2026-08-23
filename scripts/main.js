// Этот код написан чатом гпт, потому что мне лень думать над ним

(function () {
  console.log("Начинается выполнение скрипта");
  const ID_PREFIX = 'load_txt'; 
  const TEXT_ROOT = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

  console.log("Инициирована функция обезопашивания текста");
  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  console.log("Добавлен слушатель");
  document.addEventListener('click', async function (e) {
    const a = e.target.closest('a');
    if (!a) return;

    if (!a.id || !a.id.startsWith(ID_PREFIX)) return;

    e.preventDefault();

    console.log("Получение названия книги");
    const linkText = (a.textContent || a.innerText || '').trim();
    console.log(linkText);
    if (!linkText) return;
    const fileName = encodeURIComponent(linkText) + '.txt';
    console.log(fileName);
    const url = TEXT_ROOT + fileName;
    console.log(url);

    try {
      console.log("Получение текста книги");
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

      console.log("Открытие нового окна");
      const w = window.open('', '_blank');
      const doc = w.document;

      console.log("Инициация нового документа");
      doc.open();
      doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>` +
        escapeHtml(h1Text || linkText) +
        `</title><link rel="stylesheet" href="../../style/style.css" /></head><body><header class="header">
        <div class="header__mobile">
            <div class="header__mobile-top">
                <h1 class="header__logo">Библиотека имени Гоголя</h1>
            </div>

            <div class="header__bottom_mobile">
                <div class="header__select">
                    <div class="header__select-header">
                        <span class="header__select-current"><a href="/library.html">Каталог</a></span>
                    </div>
                </div>
                <div class="header__select">
                    <div class="header__select-header">
                        <span class="header__select-current"><a href="/download.html">Скачать всю библиотеку</a></span>
                    </div>
                </div>
                <div class="header__select">
                    <div class="header__select-header">
                        <span class="header__select-current"><a href="/rights.html">Для правообладателей</a></span>
                    </div>
                </div>
            </div>
        </div>

        <div class="header__top">
            <div class="header__burger">
                <span class="header__burger-menu"></span>
            </div>
            <h1 class="header__logo">Библиотека имени Гоголя</h1>
        </div>

        <div class="header__bottom">
            <div class="header__select">
                <div class="header__select-header">
                    <span class="header__select-current"><a href="/library.html">Каталог</a></span>
                </div>
            </div>
            <div class="header__select">
                <div class="header__select-header">
                    <span class="header__select-current"><a href="/download.html">Скачать всю библиотеку</a></span>
                </div>
            </div>
            <div class="header__select">
                <div class="header__select-header">
                    <span class="header__select-current"><a href="/rights.html">Для правообладателей</a></span>
                </div>
            </div>
        </div>
    </header></body></html>`);
      doc.close();

      const body = doc.body;
      console.log("Инициация заголовка имени автора");
      if (h2Text) {
        const el2 = doc.createElement('h2');
        el2.textContent = h2Text;
        body.appendChild(el2);
      }
      console.log("Инициация заголовка названия");
      if (h1Text) {
        const el1 = doc.createElement('h1');
        el1.textContent = h1Text;
        body.appendChild(el1);
      }
      console.log("Инициация новых абзацев");
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

console.log("Скрипт выполнен");