<?php

$videoId = $_GET['id'];
$add_php = 'http://' . $_SERVER['SERVER_NAME'] .  $_SERVER['PHP_SELF'];

if($_SERVER['REQUEST_METHOD'] == 'POST') {
  $title = $_POST['title'];
  $description = $_POST['description'];
  if ($title) {
    $videoId = 'fixme';
    $uploadUrl = $add_php . '?videoId=' . $videoId;
    echo json_encode(array('result' => 1, 'uploadUrl' => $uploadUrl));
  }
  else {
    //save video
    $videoId = 'fixme';
    $filename = 'videos/' . $videoId . '.ogv';
    if($_FILES['chunk']['error'] == UPLOAD_ERR_OK) {
      $chunk = fopen($_FILES['chunk']['tmp_name'], 'r');
      if(!file_exists($filename)) {
        $f = fopen($filename, 'w');
      } else {
        $f = fopen($filename, 'a');
      }
      while ($data = fread($chunk, 1024))
        fwrite($f, $data);
      fclose($f);
      if($_POST['done'] == 1) {
        $resultUrl = str_replace('firefogg-add.php', 'firefogg-video.php', $add_php) . "?id=" . $videoId;
        echo json_encode(array('result' => 1, 'done' => 1, 'resultUrl' => $resultUrl));
      }
      else {
        echo json_encode(array('result' => 1));
      }
    } else {
      echo json_encode(array('result' => -1));
    }
  }
  exit();
}

$title = 'fixme';
$description = 'fixme';

?>
<!DOCTYPE html>
<html>
  <head>
      <title>Add Video</title>
      <style>
        #progress {
          width: 200px;
          height: 20px;
          background-color: #eee;
        }
        #progressbar {
          height: 20px;
          background-color: #00f;
        }
      </style>
      <script src="http://firefogg.org/js/jquery.js"></script>
      <script>
        $(document).ready(function(){
            $('#submit').hide();
            $('#progress').hide();
        });

        if(typeof(Firefogg) == 'undefined') {
          alert('You dont have Firefogg, please go to http://firefogg.org to install it');
          document.location.href = 'http://firefogg.org';
        }
        var ogg = new Firefogg();

        function selectVideo() {
          if(ogg.selectVideo()) {
            $('#selectVideoButton').hide();
            $('#submit').show();
          }
        }

        function submitForm() {
          var _data = $('#addVideo').serializeArray();
          var data = {}
          $(_data).each(function() {
            data[this.name] = this.value;
          })
          $('#addVideo').hide();
          $('#progress').show();

          encode_and_upload(window.location.href, data);  
        }
        function encode_and_upload(postUrl, data) {
          var options = JSON.stringify({'maxSize': 320, 'videoBitrate': 500});
          ogg.upload(options, postUrl, JSON.stringify(data));
          var updateStatus = function() {
            var status = ogg.status();
            var progress = ogg.progress();

            //do something with status and progress, i.e. set progressbar width:
            var progressbar = document.getElementById('progressbar');
            progressbar.style.width= parseInt(progress*200) +'px';
            $('#progressstatus').html(parseInt(progress*100) + '% - ' + status);

            //loop to get new status if still encoding
            if(ogg.state == 'encoding' || ogg.state == 'uploading') {
              setTimeout(updateStatus, 500);
            }
            //encoding and upload sucessfull, could can also be 'encoding failed'
            else if (ogg.state == 'done') {
              if(ogg.resultUrl)
                document.location.href = ogg.resultUrl;
              else {
                alert('upload failed');
                alert(ogg.responseText);
              }
            }
          }
          updateStatus()
        }
      </script>
  </head>
  <body>
    <h1>Add Video</h1>
    <p>
      <div id="progress">
        <div id="progressbar"></div>
        <div id="progressstatus"></div>
      </div>
    </p>
    <p>
      <form id="addVideo">
        <p>Title: <input type="text" name="title" value="" /></p>
        <p>Description: <textarea name="description"></textarea></p>
        <input type="button" value="Select Video..." id="selectVideoButton" onclick="selectVideo()" />
        <input type="button" value="Submit" id="submit" onclick="submitForm()" />
      </form>
    </p>
  </body>
</html>
