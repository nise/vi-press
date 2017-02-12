<?php
/*
author: niels.seidel@nise81.com

*/

if (isset($_POST['entry'])) {
	write_log($_POST['entry']);
}

//
function write_log($message) {
 $logfile= "./scm-lab.debug";
  // Append to the log file
  if($fd = @fopen($logfile, "a")) {
    $result = fputs($fd, $message);
    fclose($fd);
 
    if($result > 0)
      return true;  
    else
      return 'Unable to write to '.$logfile.'!';
  }
  else {
    return 'Unable to open log '.$logfile.'!';
  }
}


?>
