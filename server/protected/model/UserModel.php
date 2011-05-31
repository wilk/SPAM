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
        //risorsa da cercare
        $utente = '/ltw1102/' . $this->nomeUtente;
        //se non esiste il file
        if (!$index /*|| oppure non esiste la risorsa <-- qui sto sbiellando*/) {
                    /*dove la risorsa dovrebbe essere del tipo $index[$utente]*/
            echo 'la risorsa non esiste\n';
            return true;
        }//devo specificare per forza else, non so perchè
        else {
            return false;
        }
    }
    
    public function addUser(){
        $parser = ARC2::getRDFParser();
        $parser->parse(self::$pathUtenti);
        $index = $parser->getSimpleIndex();
        $ns = array (
            'foaf' => 'http://xmlns.com/foaf/0.1/',
            'tweb' => 'http://vitali.web.cs.unibo.it/TechWeb11/'
        );
        $conf = array('ns' => $ns);
        $ser = ARC2::getRDFXMLSerializer($conf);
        //crea il soggetto della mia risorsa
        $utente = '/ltw1102/' . $this->nomeUtente;        
        $index[$utente] = array(
            'rdf:type' => array(
                'tweb:Person'
            ),
            'foaf:nick' => array(
                $this->nomeUtente
            ),
        );

        $RDFdoc = $ser->getSerializedIndex($index);
        //DEBUG
        print_r($RDFdoc);
        //
        @file_put_contents(self::$pathUtenti, $RDFdoc);
    }
}

?>