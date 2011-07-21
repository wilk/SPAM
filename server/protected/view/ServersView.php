<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ServersView
 *
 * @author Icymars
 */
class ServersView {

    //put your code here
    public static function createXml($server) {
        
        $xml =new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><servers></servers>');
        foreach ($server as $serverID) {
            $thisServer = $xml->addChild('server');
            $thisServer->addAttribute('serverID', $serverID);
        }
        return $xml->asXML();
    }

}

?>