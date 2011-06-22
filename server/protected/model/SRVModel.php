<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of SRVModel
 *
 * @author clem
 */
class SRVModel {

    static private $_SERVERSBASE =
            "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb11/Spam/ServerFederatiGiusta.xml";

//    
//    function __construct() {
//        $this->load()->helper('DooRestClient');
//        $request = new DooRestClient;
//        $request->connect_to(self::$_SERVERSBASE)->get();
//        $this->serverList = $request->xml_result();
//    }

    public static function getDefaults($request) {
        $request->connect_to(self::$_SERVERSBASE)->get();
        $serverList = $request->xml_result();
        $idsServer = array();
        foreach ($serverList->server as $myServer)
            array_push($idsServer, (string) $myServer->attributes()->serverID);
        return $idsServer;
    }

    /* questa mi serve per ritornare l'indirizzo del server.
     * 
     * @param $s = serverID
     */

    public static function getUrl($request, $s) {
        $request->connect_to(self::$_SERVERSBASE)->get();
        $serverList = $request->xml_result();
        foreach ($serverList->server as $myServer) {
            if ($myServer->attributes()->serverID == $s)
                return $myServer->attributes()->serverURL;
        }
        return 0;
    }

}

?>