<?php
 
defined('_JEXEC') or die;

require_once( dirname(__FILE__) . '/helper.php' );

$typeChallenge = modHelloWorldHelper::getType($params);
$nameChallenge = modHelloWorldHelper::getName($params);
require( JModuleHelper::getLayoutPath('mod_challenge'));

?>