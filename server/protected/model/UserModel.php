<?php

/**
 * Mi aspetto che questa classe riceva il nome dell'utente tramite $_POST da client,
 * controlli se l'utente esiste altrimenti lo crei.
 */
include_once 'protected/module/arc/ARC2.php';
include_once 'protected/module/Graphite.php';

class UserModel {

    private $index;
    public $nomeUtente;
    public $usrLabel;
    private static $pathUtenti = 'data/users.rdf';

    function __construct($usr) {
        //TODO: effettuare controlli su $usr
        $this->nomeUtente = $usr;
        $this->usrLabel = 'spam:/Spammers/' . $this->nomeUtente;
        $parser = ARC2::getRDFParser();
        $parser->parse(self::$pathUtenti);
        $this->index = $parser->getSimpleIndex();
    }

    function writeInUsers() {
        $ns = array(
            'foaf' => 'http://xmlns.com/foaf/0.1/',
            'tweb' => 'http://vitali.web.cs.unibo.it/vocabulary/',
            'spam' => 'http://ltw1102.web.cs.unibo.it/',
            'sioc' => 'http://rdfs.org/sioc/ns#'
        );
        $conf = array('ns' => $ns);
        $ser = ARC2::getRDFXMLSerializer($conf);
        $RDFdoc = $ser->getSerializedIndex($this->index);
        @file_put_contents(self::$pathUtenti, $RDFdoc);
    }

    public function firstTime() {
        //se non esiste il file ritorna
        if (!$this->index) {
            return true;
        } else {
            foreach ($this->index as $usr => $value) {
                if ($usr == $this->usrLabel)
                    return false;
            }
        }//nuovo utente
        return true;
    }

    public function addUser() {
        //crea il soggetto della mia risorsa
        $this->index[$this->usrLabel] = array(
            'rdf:type' => array(
                'foaf:Person'
            ),
            'foaf:nick' => array(
                $this->nomeUtente
            ),
        );
        $this->writeInUsers();
    }

    public function getServers() {
        return $this->index[$this->usrLabel]['http://vitali.web.cs.unibo.it/vocabulary/server'];
    }

    public function setServers($a) {
        foreach ($a as $server) {
            $this->index[$this->usrLabel]['tweb:server'][] = $server;
        }
        $this->writeInUsers();
    }

    public function addPost2Usr($id) {
        $this->index[$this->usrLabel]['sioc:Post'][] = $id;
        $this->writeInUsers();
        return 201;
    }
    
    public function handleFollow($r, $v){
        $siocFollow = 'http://rdfs.org/sioc/ns#follows';
        $risorsa = 'http://ltw1102.web.cs.unibo.it' . $r;
        if (isset($this->index[$this->usrLabel][$siocFollow])) {
            foreach($this->index[$this->usrLabel][$siocFollow] as $k => $seg){
                if ($seg == $risorsa) {
                    if ($v) return;
                    //else la devo togliere
                    unset($this->index[$this->usrLabel][$siocFollow][$k]);
                    break;
                }
            }
        }//altrimenti se non esiste
        if ($v)
            $this->index[$this->usrLabel][$siocFollow][] = 'spam' . $r;
        $this->writeInUsers();
        return;
    }

}

?>