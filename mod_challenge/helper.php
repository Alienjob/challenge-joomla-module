<?php

class modHelloWorldHelper
{

    public static function getType( $params )
    {
        return $params -> get('type', 'minus789');
    }
    public static function getName( $params )
    {
        return $params -> get('name', 'Вычитание 7 8 9');
    }

}
?>