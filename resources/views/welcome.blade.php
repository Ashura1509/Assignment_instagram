<!DOCTYPE html>
<html>
<head>
    <title>My Laravel App</title>
    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" 
    rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/js/app.jsx']) <!-- This loads your Vite-compiled JavaScript and CSS -->
</head>
<body>
    <div id="example"></div> <!-- This is where the Example component will render -->
</body>
</html>