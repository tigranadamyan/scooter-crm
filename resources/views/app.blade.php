<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scooter CRM</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="/build/assets/app.css?v={{ md5_file(public_path('build/assets/app.css')) }}" />
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/build/assets/app.js?v={{ md5_file(public_path('build/assets/app.js')) }}"></script>
</body>
</html>
