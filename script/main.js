fetch('data.txt')
            .then(response => response.text())
            .then(text => {
                // Вставляем текст в блок div
                document.getElementById('content').innerText = text;
            })
            .catch(error => {
                console.error('Ошибка загрузки файла:', error);
                document.getElementById('content').innerText = 'Не удалось загрузить текст.';
            });