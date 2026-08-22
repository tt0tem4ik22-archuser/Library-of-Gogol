(function () {
  // Настройка: любые ссылки, чьи id начинаются с этого префикса, будут обрабатываться
  const ID_PREFIX = 'loadTxt-'; // изменить при необходимости
  // Путь к папке на сервере, где лежат .txt файлы
  const TEXT_ROOT = '/texts/'; // скорректируйте под ваш сервер

  // Утилита: экранируем текст для безопасного вывода в атрибуты/HTML, если нужен
  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Обработчик клика по документу (делегация)
  document.addEventListener('click', async function (e) {
    const a = e.target.closest('a');
    if (!a) return;

    // Проверяем id на нужный префикс
    if (!a.id || !a.id.startsWith(ID_PREFIX)) return;

    e.preventDefault();

    // Имя файла: текст ссылки + ".txt"
    const linkText = (a.textContent || a.innerText || '').trim();
    if (!linkText) return;

    // Рекомендуем кодировать имя файла
    const fileName = encodeURIComponent(linkText) + '.txt';
    const url = TEXT_ROOT + fileName;

    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      const content = await res.text();
      // Разбираем содержимое: первая строка -> h2, вторая -> h1
      // Остальные абзацы разделяются двумя переносами строк
      const lines = content.replace(/\r/g, '').split('\n');
      const h2Text = (lines[0] || '').trim();
      const h1Text = (lines[1] || '').trim();

      // Остальная часть файла
      const rest = lines.slice(2).join('\n').trim();

      // Разделяем абзацы по двум переносам строк
      // и очищаем каждый абзац
      const paragraphs = rest
        ? rest.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0)
        : [];

      // Создаем новую страницу по шаблону в новом окне
      const w = window.open('', '_blank');
      const doc = w.document;

      // Шаблон страницы (можно заменить на более сложный)
      // Здесь мы сразу заполняем h2, h1 и параграфы
      doc.open();
      doc.write('<!doctype html><html><head><meta charset="utf-8"/><title>' +
        escapeHtml(h1Text || linkText) +
        '</title></head><body></body></html>');
      doc.close();

      // Добавляем элементы в созданную страницу
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
      // можно показать уведомление пользователю
    }
  });
})();