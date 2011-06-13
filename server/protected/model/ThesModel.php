<?php

include_once 'protected/module/arc/ARC2.php';
include_once 'protected/module/Graphite.php';

/*  thesaurus model class */

class ThesModel {

    private $index;
    public $usrLabel;
    private static $pathTesauro = 'data/tesauro.rdf';

    function __construct() {
        $this->usrLabel = 'http://ltw1102.web.cs.unibo.it/thesaurus/';
        $parser = ARC2::getRDFXMLParser();
        $parser->parse(self::$pathTesauro);
        $this->index = $parser->getSimpleIndex(0);
    }

    public function getTesauro() {
        $ser = ARC2::getRDFXMLSerializer();
        $RDF = $ser->getSerializedIndex($this->index);
        return($RDF);
    }

}

?>
