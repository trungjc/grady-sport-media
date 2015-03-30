<?php

function storeAddress(){


	if(!$_GET['sm_email']){ return "No email address provided"; } 

	if(!preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*$/i", $_GET['sm_email'])) {
		return "Email address is invalid"; 
	}


	$data  = '* Name : '.$_GET['sm_name'];
	$data .= ' Email : '.$_GET['sm_email'].' , '. PHP_EOL;



	/*
	$data = array(

		 array($_GET['name']),
		 array($_GET['email'] )
		);
		*/

	$file = "sm_subcribers-list.csv"; 
	echo $data;

	$fp = fopen($file, "a") or die("Couldn't open $file for writing!");
	fwrite($fp, $data) or die("Couldn't write values to file!"); 

	fclose($fp); 
	echo $data;
	echo "Your Form has been Submitted!";



}

if($_GET['ajax']){ echo storeAddress(); }


 ?>
