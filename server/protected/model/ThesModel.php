<?php

include_once 'protected/module/arc/ARC2.php';
include_once 'protected/module/Graphite.php';

/*  thesaurus model class */

class ThesModel {

    private $broaderIsVitali = true;
    private $index;
    public $srvLabel;
    private $termBroader;
    private static $pathTesauro = 'data/tesauro.rdf';
    private static $pathTesaPost = 'data/tesapost.rdf';
    private $prefLabel = 'http://www.w3.org/2004/02/skos/core#prefLabel';
    private $narrower = 'http://www.w3.org/2004/02/skos/core#narrower';
    private $broader = 'http://www.w3.org/2004/02/skos/core#broader';
    private $inScheme = 'http://www.w3.org/2004/02/skos/core#inScheme';
    private $vitaliPath = 'http://vitali.web.cs.unibo.it/TechWeb11/thesaurus';
    private $file;

    function __construct($check = FALSE) {
        if (!$check)
            $this->file = self::$pathTesauro;
        else
            $this->file = self::$pathTesaPost;
        $this->srvLabel = 'http://ltw1102.web.cs.unibo.it/thesaurus';
        $parser = ARC2::getRDFParser();
        $parser->parse($this->file);
        $this->index = $parser->getSimpleIndex();
    }

    public function getTesauro() {
        $ser = ARC2::getRDFXMLSerializer();
        $RDF = $ser->getSerializedIndex($this->index);
        return($RDF);
    }

    public function extendTesauro($parent, $term) {
        //Controllo la presenza di parent e term nel tesauro
        if ($this->isIn($parent)) {
            if (!($this->isIn($term))) {
                $this->addTerm($parent, $term);
                return true;
            } else {
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
            if ($label[$this->prefLabel][0] == $term) {
                if (isset($label[$this->narrower])) {
                    $find = stripos($label[$this->narrower][0], $this->vitaliPath);
                    if ($find === false) {
                        if (isset($label[$this->broader]))
                            $this->termBroader= $label[$this->broader][0];
                        else
                        $this->termBroader = $this->srvLabel;
                        return true;
                    }
                } else {
                    if ($label[$this->inScheme][0] == $this->srvLabel) {
                        $this->broaderIsVitali = stripos($label[$this->broader][0], $this->vitaliPath);
                        if ($this->broaderIsVitali === false) {
                            $this->termBroader = $label[$this->broader][0];
                            return true;
                        } else {
                            print "sono qui!\n";
                            $this->termBroader = $this->srvLabel;
                            print $this->termBroader;
                            return true;
                        }
                    } else {
                        echo "sono uno stronzo!";
                        $this->termBroader = $label[$this->broader][0];
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private function addTerm($parent, $term) {
        $myTermBroader = $this->termBroader . '/' . $parent;
        if ($this->broaderIsVitali === false) {
            $this->writeLocalTerm($myTermBroader, $term);
        } else {
            if ($this->index[$myTermBroader][$this->inScheme][0] == $this->srvLabel) {
                $this->writeLocalTerm($myTermBroader, $term);
            } else {
                $this->index[$myTermBroader]['skos:narrower'][] = $this->srvLabel . '/' . $term;
                $this->index[$this->srvLabel . '/' . $term] = array(
                    'rdf:type' => array(
                        'skos:Concept'
                    ),
                    'skos:inScheme' => array(
                        $this->srvLabel
                    ),
                    'skos:prefLabel' => array(
                        $term
                    ),
                    'skos:broader' => array(
                        $myTermBroader
                    ),
                );
            }
        }
        $this->writeInTesauro();
    }

    private function writeInTesauro() {
        $ns = array(
            'skos' => 'http://www.w3.org/2004/02/skos/core#',
            'sioc' => 'http://rdfs.org/sioc/ns#'
        );
        $conf = array('ns' => $ns);
        $ser = ARC2::getRDFXMLSerializer($conf);
        $RDFdoc = $ser->getSerializedIndex($this->index);
        @file_put_contents($this->file, $RDFdoc);
    }

    private function writeLocalTerm($myTermBroader, $term) {
        $this->index[$myTermBroader]['skos:narrower'][] = $myTermBroader . '/' . $term;
        $this->index[$myTermBroader . '/' . $term] = array(
            'rdf:type' => array(
                'skos:Concept'
            ),
            'skos:inScheme' => array(
                $this->srvLabel
            ),
            'skos:prefLabel' => array(
                $term
            ),
            'skos:broader' => array(
                $myTermBroader
            ),
        );
    }
    
    /////////////////////////////////
    
    public function addPost2Thes($indice, $contenuto, $postID){
        if (!isset($this->index[$indice]))
                $this->index[$indice] = $contenuto;
        $this->index[$indice]['sioc:Post'][] = $postID;
        $this->writeInTesauro();
    }

}

?>
