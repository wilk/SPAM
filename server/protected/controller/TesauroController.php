<?php

include_once 'protected/model/ThesModel.php';

class TesauroController extends DooController {

    public function addTerm() {
;
    }

    public function sendThesaurus() {
        $thes = new ThesModel();
        $tesauro = $thes->getTesauro();
        header('Content-type: application/rdf+xml');
        print $tesauro;
    }

}

?>
