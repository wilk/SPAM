<?php

/**
 * Mi aspetto che questa classe riceva il nome dell'utente tramite $_POST da client,
 * controlli se l'utente esiste altrimenti lo crei.
 */
include_once 'protected/module/arc/ARC2.php';
include_once 'protected/module/Graphite.php';
include_once 'protected/controller/ErrorController.php';

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
        file_put_contents(self::$pathUtenti, $RDFdoc) or ErrorController::internalError();
    }

    public function ifUserExist() {
        if (isset($this->index[$this->usrLabel]))
            return TRUE;
        else
            return FALSE;
    }

    public function firstTime() {
        //se non esiste il file ritorna
        if (!$this->index) {
            return true;
        } else {
            if (isset($this->index[$this->usrLabel]))
                return false;
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
        unset($this->index[$this->usrLabel]['http://vitali.web.cs.unibo.it/vocabulary/server']);
        foreach ($a as $server) {
            $this->index[$this->usrLabel]['tweb:server'][] = $server;
        }
        $this->writeInUsers();
    }

    public function checkPosts() {
        if (!isset($this->index[$this->usrLabel]['http://rdfs.org/sioc/ns#Post']))
            return false;
        else
            return true;
    }

    public function getPosts($c) {
        $postsUtente = array_reverse($this->index[$this->usrLabel]['http://rdfs.org/sioc/ns#Post'], TRUE);
        $size = sizeof($postsUtente);
        if ($size < $c)
            return $postsUtente;
        else
            return array_slice($postsUtente, 0, $c, TRUE);
    }

    public function addPost2Usr($id) {
        $this->index[$this->usrLabel]['sioc:Post'][] = $id;
        $this->writeInUsers();
        return 201;
    }

    public function getFollows() {
        if (isset($this->index[$this->usrLabel]['http://rdfs.org/sioc/ns#follows'])) {
            $a = array();
            foreach ($this->index[$this->usrLabel]['http://rdfs.org/sioc/ns#follows'] as $v) {
                array_push($a, (strstr($v, '/')));
            }
            return $a;
        }
    }

//DEPRECATED    
//    public function handleFollow($r, $v){
//        $siocFollow = 'http://rdfs.org/sioc/ns#follows';
//        if (isset($this->index[$this->usrLabel][$siocFollow])) {
//            foreach($this->index[$this->usrLabel][$siocFollow] as $k => $seg){
//                if ($seg == $r) {
//                    if ($v) return;
//                    //else la devo togliere
//                    unset($this->index[$this->usrLabel][$siocFollow][$k]);
//                    $this->writeInUsers();
//                    return;
//                }
//            }
//        }//altrimenti se non esiste
//        if ($v) {
//            $this->index[$this->usrLabel]['sioc:follows'][] = $r;
//            $this->writeInUsers();
//        }return;
//    }
    public function handleFollow($r, $v) {
        $siocFollow = 'http://rdfs.org/sioc/ns#follows';
        if ($v) {
            if (isset($this->index[$this->usrLabel][$siocFollow])) {
                if (($key = array_search($r, $this->index[$this->usrLabel][$siocFollow])) !== false)
                    ErrorController::badReq("L'utente è gia seguito");
                $this->index[$this->usrLabel]['sioc:follows'][] = $r;
                $this->writeInUsers();
            }else {
                $this->index[$this->usrLabel]['sioc:follows'][] = $r;
                $this->writeInUsers();
            }
        } else {
            if (isset($this->index[$this->usrLabel][$siocFollow])) {
                if (($key = array_search($r, $this->index[$this->usrLabel][$siocFollow]))!== false) {
                    unset($this->index[$this->usrLabel][$siocFollow][$key]);
                    $this->writeInUsers();
                }
                else
                    ErrorController::badReq("Non stai seguendo questo utente!");
            } else
                ErrorController::badReq("Non stai seguendo questo utente!");
        }
    }
}
?>