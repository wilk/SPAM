<?php

include_once 'protected/module/arc/ARC2.php';
include_once 'protected/module/Graphite.php';

/*  thesaurus model class */

class ThesModel {

    //private $broaderIsVitali = true;
    private $index;
    public $srvLabel;
    private $termBroader;
    private static $pathTesauro = 'data/tesauro.rdf';
    private static $pathTesaPost = 'data/tesapost.rdf';
    private $prefLabel = 'http://www.w3.org/2004/02/skos/core#prefLabel';
    private $narrower = 'http://www.w3.org/2004/02/skos/core#narrower';
    private $broader = 'http://www.w3.org/2004/02/skos/core#broader';
    private $inScheme = 'http://www.w3.org/2004/02/skos/core#inScheme';
    static $siocPost = 'http://rdfs.org/sioc/ns#Post';
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

//    public function extendTesauro($parent, $term) {
//        //Controllo la presenza di parent e term nel tesauro
//        if ($this->isInAndValid($parent)) {
//            if (!($this->isInAndValid($term))) {
//                $this->addTerm($parent, $term);
//                return true;
//            } else {
//                echo "Il term esiste già";
//                return false;
//            }
//        } else {
//            echo "Il parentterm non esiste o non è una foglia del tesauro condiviso!";
//            return false;
//        }
//        return true;
//    }

    /*
     * @param $term Il label della risorsa di cui si vuole il path
     * 
     * Controlla se il label esiste nel tesauro e in caso positivo ritorna il suo path relativo. Altrimenti torna false
     * 
     * @return $path
     */

    public function returnPath($term) {
        foreach ($this->index as $key => $label) {
            if ($label[$this->prefLabel][0] == $term) {
                $pathArray = explode('/', strstr(parse_url($key, PHP_URL_PATH), 'thesaurus/'));
                unset($pathArray[0]);
                return $pathArray;
            }
        }
        return false;
    }

//    private function isInAndValid($term) {
//        foreach ($this->index as $key => $label) {
//            if ($label[$this->prefLabel][0] == $term) {
//                if (isset($label[$this->narrower])) {
//                    $find = stripos($label[$this->narrower][0], $this->vitaliPath);
//                    if ($find === false) {
//                        if (isset($label[$this->broader]))
//                            $this->termBroader = $label[$this->broader][0];
//                        else
//                            $this->termBroader = $this->srvLabel;
//                        return true;
//                    }
//                } else {
//                    if ($label[$this->inScheme][0] == $this->srvLabel) {
//                        $this->broaderIsVitali = stripos($label[$this->broader][0], $this->vitaliPath);
//                        if ($this->broaderIsVitali === false) {
//                            $this->termBroader = $label[$this->broader][0];
//                            return true;
//                        } else {
//                            $this->termBroader = $this->srvLabel;
//                            print $this->termBroader;
//                            return true;
//                        }
//                    } else {
//                        $this->termBroader = $label[$this->broader][0];
//                        return true;
//                    }
//                }
//            }
//        }
//        return false;
//    }

//    private function addTerm($parent, $term) {
//        $myTermBroader = $this->termBroader . '/' . $parent;
//        if ($this->broaderIsVitali === false) {
//            $this->writeLocalTerm($myTermBroader, $term);
//        } else {
//            if ($this->index[$myTermBroader][$this->inScheme][0] == $this->srvLabel) {
//                $this->writeLocalTerm($myTermBroader, $term);
//            } else {
//                $this->index[$myTermBroader]['skos:narrower'][] = $this->srvLabel . '/' . $term;
//                $this->index[$this->srvLabel . '/' . $term] = array(
//                    'rdf:type' => array(
//                        'skos:Concept'
//                    ),
//                    'skos:inScheme' => array(
//                        $this->srvLabel
//                    ),
//                    'skos:prefLabel' => array(
//                        $term
//                    ),
//                    'skos:broader' => array(
//                        $myTermBroader
//                    ),
//                );
//            }
//        }
//        $this->writeInTesauro();
//    }
    
    public function extendThes($parentPath, $term) {
        $deep = count(explode('/', $parentPath));
        if ($deep == 3)
            $this->addChildToSharedThes($parentPath, $term);
        else
            $this->writeLocalTerm($parentPath, $term);
        $this->writeInTesauro();
        return true;
    }

    private function addChildToSharedThes($parentPath, $term) {
        $myTermBroader = $this->vitaliPath . '/' . $parentPath;
        $this->index[$myTermBroader]['skos:narrower'][] = $this->srvLabel . '/' . $parentPath . '/' . $term;
        $this->index[$this->srvLabel . '/' . $parentPath . '/' . $term] = array(
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

    private function writeLocalTerm($parentPath, $term) {
        $myTermBroader = $this->srvLabel . '/' . $parentPath;
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

    public function addPost2Thes($arrayDescriptions, $postID) {
        foreach ($arrayDescriptions as $key => $value) {
            if(!isset($this->index[$key]))
                    $this->index[$key] = $value;
            $this->index[$key]['sioc:Post'][] = $postID;
        }
        $this->writeInTesauro();
    }
    
    public function getPostsFromThes($path, $limite, $specific = FALSE){
        $pIDs = array();
        for ($i=sizeof($path);$i>0;$i--){
            if ($limite == 0)
                break;
            $mandrakata = implode('/', array_slice($path, 0, $i));
            if (isset($this->index[$mandrakata])){
                //qui se è settato il termine, mi aspetto che abbia dei sioc:Post associati
                $nposts = sizeof($this->index[$mandrakata][self::$siocPost]);
                if ($limite == 'all' || 
                        $nposts<$limite){
                    array_push($pIDs, $this->index[$mandrakata][self::$siocPost]);
                } else {
                    array_push($pIDs, array_slice($this->index[$mandrakata][self::$siocPost], 0, $limite));
                    break;
                }
            }
            if ($specific == TRUE)
                break;
        }
        return $pIDs;
    }
    
    public function getPostsByCtag($term, $limite){
        $pIDs = array();
        $label = 'http://ltw1102.web.cs.unibo.it/tags/';
        $label .= $term;
        if (!isset($this->index[$label]))
            return 0;
        $c = sizeof($this->index[$label][self::$siocPost]);
        if ($c < $limite)
            return $this->index[$label][self::$siocPost];
        return array_slice($this->index[$label][self::$siocPost], 0, $limite);
    }

}

?>