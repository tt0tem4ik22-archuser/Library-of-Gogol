function generatePage() {
    const text = "Тест"
    const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Библиотека имени Гоголя</title>
    <link rel="stylesheet" href="../style/style.css" />
</head>
<body>
    <div class="container">
        <h1>author - book</h1>
        <p>${text}</p>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });

    const pageUrl = URL.createObjectURL(blob);

    window.open(pageUrl, '_blank');
}

generatePage();