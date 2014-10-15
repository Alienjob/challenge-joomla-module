<?php 

defined('_JEXEC') or die; ?>

<?php 

  $chars = 'abdefhiknrstyzABDEFGHKNQRSTYZ23456789';
  $numChars = strlen($chars);
  $uid = '';
  for ($i = 0; $i < 20; $i++) {
    $uid .= substr($chars, rand(1, $numChars) - 1, 1);
  }


$document = JFactory::getDocument();
$document->addScript('http://joomla/js/react-0.11.1.min.js');
$document->addScript('http://joomla/js/react-bootstrap.js');
$document->addScript('http://joomla/js/challenge.js');
$document->addScript('http://ulogin.ru/js/ulogin.js');

$document->addStyleSheet('http://joomla/style/bootstrap.min.css');
$document->addStyleSheet('http://joomla/style/bootstrap.css.map');
$document->addStyleSheet('http://joomla/style/bootstrap-theme.css');
$document->addStyleSheet('http://joomla/style/bootstrap-theme.css.map');
$document->addStyleSheet('http://joomla/style/Challenge.css');

$document->addStyleSheet('http://joomla/font/glyphicons-halflings-regular.eot');
$document->addStyleSheet('http://joomla/font/glyphicons-halflings-regular.svg');
$document->addStyleSheet('http://joomla/font/glyphicons-halflings-regular.ttf');
$document->addStyleSheet('http://joomla/font/glyphicons-halflings-regular.woff');

echo '<div id = ' . $uid . '> ' . $typeChallenge . ' Для работы уражнений необходим javascript </div>';
$document->addScriptDeclaration('

    if(!window.challengeManager)
        window.challengeManager = new ChallengeManagerMath();
        
    window.callbackUlogin = function (token){
        console.log(" window.callbackUlogin " + token);
       window.challengeManager.ulogin(token);
    }

    jQuery(window).on("load",  function() {
        window.renderChallenge("'.$nameChallenge.'", "'.$uid.'", window.challengeManager.InitData.'.$typeChallenge.', window.challengeManager); 
    });
');


?>

