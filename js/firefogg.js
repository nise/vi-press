 
 
var $ = jQuery;
 
 $(document).ready(function($){
            $('#submit').hide();
            $('#progress').hide();
        });

        if(typeof(Firefogg) == 'undefined') {
        	$('#firefogg-error').html('You dont have Firefogg, please go to http://firefogg.org to install it').
          //alert('You dont have Firefogg, please go to http://firefogg.org to install it');
          return;
          //document.location.href = 'http://firefogg.org';
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

encode_and_upload('media-upload.php?referer=wptuts-settings&type=video&TB_iframe=true&post_id=0', data); 
//          encode_and_upload(window.location.href, data);  
        }
        function encode_and_upload(postUrl, data) {
          var options = JSON.stringify({'maxSize': 200, 'videoBitrate': 500});
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
              if(ogg.resultUrl){
              	alert('done');
                document.location.href = ogg.resultUrl;
              }
              else {
                alert('upload failed');
                alert(ogg.responseText);
              }
            }
          }
          updateStatus()
        }
