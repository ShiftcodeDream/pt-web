<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-type: text/html; charset=UTF-8');
header('Access-Control-Allow-Headers: X-Requested-With');
$contenu = file_get_contents("https://www.horaire-maree.fr/maree/CHERBOURG/");
echo $contenu;

