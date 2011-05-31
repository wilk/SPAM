<?php

/**
 * Description of PostModel
 *
 * @author clem
 */
include_once 'protected/module/arc/ARC2.php';
include_once 'protected/module/Graphite.php';

class PostModel {
    
    public function parseArticle($data) {
        //inizializzo il parser
        $parser = ARC2::getSemHTMLParser();
        $parser->parse($data);
        $parser->extractRDF('rdfa');
        
        $triples = $parser->getTriples();
        $rdfxml = $parser->toRDFXML($triples);
        print_r($rdfxml);
        
        //$base = 'http://ltw1102.web.cs.unibo.it';
//        $parser->parse(/*$base,*/ $data);
//        $index = $parser->getSimpleIndex(0);
//        print_r($index);
    }
}

?>
