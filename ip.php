<?php

/*
author: niels.seidel@nise81.com

This file returns the client remote IP address as json

*/


$arr = array(); 

$arr['ip'] = $_SERVER["REMOTE_ADDR"];

echo json_encode($arr);


?>
