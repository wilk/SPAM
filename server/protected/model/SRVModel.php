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
    private $serverList = NULL;

//    
//    function __construct() {
//        $this->load()->helper('DooRestClient');
//        $request = new DooRestClient;
//        $request->connect_to(self::$_SERVERSBASE)->get();
//        $this->serverList = $request->xml_result();
//    }
    function __construct($request) {
        $request->connect_to(self::$_SERVERSBASE)->get();
        if ($request->isSuccess())
            $this->serverList = $request->xml_result();
        else
            ErrorController::internalError ();
    }

    public function getDefaults() {
        $mirror = $this->serverList;
        $idsServer = array();
        foreach ($mirror->server as $myServer)
            array_push($idsServer, (string) $myServer->attributes()->serverID);
        return $idsServer;
    }

    /* questa mi serve per ritornare l'indirizzo del server.
     * 
     * @param $s = serverID
     */

    public function getUrl($s) {
        $mirror = $this->serverList;
        foreach ($mirror->server as $myServer) {
            if ($myServer->attributes()->serverID == $s)
                return $myServer->attributes()->serverURL;
        }
        return false;
    }

}

?>