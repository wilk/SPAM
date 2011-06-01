<?php

/**
 * Mi aspetto che questa classe riceva il nome dell'utente tramite $_POST da client,
 * controlli se l'utente esiste altrimenti lo crei.
 */

include_once 'protected/module/arc/ARC2.php';
include_once 'protected/module/Graphite.php';

class UserModel {
    
    public $nomeUtente;
    private static $pathUtenti = 'data/users.rdf';
    
    function __construct($usr) {
        //TODO: effettuare controlli su $usr
        $this->nomeUtente = $usr;
    }
    
    public function firstTime() {
        $parser = ARC2::getRDFParser();
        $parser->parse(self::$pathUtenti);
        $index = $parser->getSimpleIndex();
        $utente = 'spammers:'.$this->nomeUtente;
        //se non esiste il file ritorna
        if (!$index) { return true; } 
        else {
            foreach ($index as $valore => $value) 
                { if($valore == $utente) 
                    { echo $valore; return false; }}
        }//nuovo utente
         return true;
    }
    
    public function addUser(){
        $parser = ARC2::getRDFParser();
        $parser->parse(self::$pathUtenti);
        $index = $parser->getSimpleIndex();
        $ns = array (
            'foaf' => 'http://xmlns.com/foaf/0.1/',
            /*'tweb' => 'http://vitali.web.cs.unibo.it/TechWeb11/',*/
            'spammers' => 'http://ltw1102.web.cs.unibo.it/Spammers/'
        );
        $conf = array('ns' => $ns);
        $ser = ARC2::getRDFXMLSerializer($conf);
        //crea il soggetto della mia risorsa
        $utente = 'spammers:'.$this->nomeUtente;        
        $index[$utente] = array(
            'rdf:type' => array(
                'foaf:Person'
            ),
            'foaf:nick' => array(
                $this->nomeUtente
            ),
        );

        $RDFdoc = $ser->getSerializedIndex($index);
        @file_put_contents(self::$pathUtenti, $RDFdoc);
    }
}

?>