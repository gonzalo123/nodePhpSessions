<?php
include_once 'NodeSessions.php';
NodeSession::start();
//session_start();

if (!isset($_SESSION["gonzalo"])) $_SESSION["gonzalo"] = 0;
$_SESSION["gonzalo"]++;
$_SESSION["arr"] = array('key' => uniqid());
var_dump($_SESSION);
