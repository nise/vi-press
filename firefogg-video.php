<?php
$videoId = $_GET['id'];
$title = 'fixme';
$description = 'fixme';

?>
<!DOCTYPE html>
<html>
  <head>
      <title><?php echo $title ?></title>
  </head>
  <body>
    <h1><?php echo $title ?></h1>
    <p>
    <?php echo $description ?>
    </p>
    <p>
      <video src="./videos/<?php echo $videoId ?>.ogv" autoplay controls></video>
    </p>
  </body>
</html>
