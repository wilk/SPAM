<?php

/**
 * Mi aspetto che questa classe riceva il nome dell'utente tramite $_POST da client,
 * controlli se l'utente esiste altrimenti lo crei.
 */
/*
include_once '/home/clem/SPAM_testing/server/protected/module/arc/ARC2.php';
include_once '/home/clem/SPAM_testing/server/protected/module/Graphite.php';
*/
// Include RAP
define("RDFAPI_INCLUDE_DIR", "protected/module/rdfapi-php/api/");
include(RDFAPI_INCLUDE_DIR . "RdfAPI.php");

class UserModel {
    
    public $nomeUtente;
    private static $pathUtenti = '../global/rdf/users.rdf';
    
    function __construct($usr) {
        //TODO: effettuare controlli su $usr
        $nomeUtente = $usr;
    }
    
    public function firstTime() {
        //se il mio rdf non esiste lo creo
        if (!file_exists(self::$pathUtenti)) {
    /**
     * Graphite ha rotto il cazzo!
            //mi definisco i namespace della mia risorsa
            $ns = array (
                'foaf' => 'http://xmlns.com/foaf/0.1/'
            );
            
            $conf = array('ns' => $ns);
            $ser = ARC2::getRDFXMLSerializer($conf);
            //$doc = $ser->getSerializedIndex($index);
            //TODO: aggiungere il soggetto della risorsa rdf:about
            @file_put_contents(self::$pathUtenti, $ser);
        }
        $graph = new Graphite();
        $graph->load(self::$pathUtenti);
        $utenti = $graph->resource(self::$pathUtenti);
        print $graph->dump();
     * 
     */
            $model = ModelFactory::getDefaultModel();
            $model->saveAs(self::$pathUtenti, "rdf");
        }
    }
}

?>
