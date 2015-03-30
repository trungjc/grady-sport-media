<?php
// $f contains file
// To empty the subscribers list file.




// Opening file
$f = @fopen("sm_subcribers-list.csv", "r+");
if ($f !== false) {
    ftruncate($f, 0);
    fclose($f);

    echo 'Success!';
}

else{
	echo "Some Error Occurred!";
}


?>