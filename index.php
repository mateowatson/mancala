<?php
$root_path = $_SERVER['REQUEST_URI'];
$root_path = substr($root_path, -1) === '/' ? $root_path : "$root_path/";
?>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="initial-scale=1, width=device-width" />

	<title>Watson Bros. Games - Mancala</title>

	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

	<link href="https://fonts.googleapis.com/css?family=Faster+One|Josefin+Sans:400,400i,700|Macondo+Swash+Caps" rel="stylesheet">

	<link rel="stylesheet" href="<?php echo $root_path; ?>style.css">
</head>
<body>
	<div id="app">
		<mancala></mancala>
	</div>

	<!-- development version of Vue, includes helpful console warnings -->
	<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

	<!-- Custom js -->
	<script src="<?php echo $root_path; ?>js/app.js"></script>
</body>
</html>
