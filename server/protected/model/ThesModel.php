<?php

include_once 'protected/module/arc/ARC2.php';
include_once 'protected/module/Graphite.php';

/*  thesaurus model class */

class ThesModel {

    private $index;
    public $srvLabel;
    private $termBroader;
    private static $pathTesauro = 'data/tesauro.rdf';
    private $prefLabel = 'http://www.w3.org/2004/02/skos/core#prefLabel';
    private $narrower = 'http://www.w3.org/2004/02/skos/core#narrower';
    private $broader = 'http://www.w3.org/2004/02/skos/core#broader';
    private $vitaliPath = 'http://vitali.web.cs.unibo.it/TechWeb11/thesaurus';

    function __construct() {
        $this->srvLabel = 'http://ltw1102.web.cs.unibo.it/thesaurus/';
        $parser = ARC2::getRDFXMLParser();
        $parser->parse(self::$pathTesauro);
        $this->index = $parser->getSimpleIndex(0);
        //print_r($this->index);
    }

    public function getTesauro() {
        $ser = ARC2::getRDFXMLSerializer();
        $RDF = $ser->getSerializedIndex($this->index);
        return($RDF);
    }

    public function extendTesauro($parent, $term) {
        //Controllo la presenza di parent e term nel tesauro
        if ($this->isIn($parent)) {
            if (!($this->isIn($term)))
                $this->addTerm($parent, $term);
            else {
                echo "Il term esiste già";
                return false;
            }
        } else {
            echo "Il parentterm non esiste o non è una foglia del tesauro condiviso!";
            return false;
        }
        return true;
    }

    private function isIn($term) {
        foreach ($this->index as $key => $label) {
            if ($label[$this->prefLabel][0]['value'] == $term) {
                if (isset($label[$this->narrower])) {
                    $find = stripos($label[$this->narrower][0]['value'], $this->vitaliPath);
                    if ($find === false)
                        return true;
                }
                else {
                    $this->termBroader = $label[$this->broader][0]['value'];
                    return true;
                }
            }
        }
        return false;
    }

    private function addTerm($parent, $term) {
        $myTermBroader = $this->termBroader . '/' . $parent;
        $this->index[$myTermBroader]['skos:narrower'][] = $this->srvLabel . $term;
        print_r($this->index[$myTermBroader]);
    }

}

?>
