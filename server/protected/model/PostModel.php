<?php

include_once 'protected/module/arc/ARC2.php';
include_once 'protected/module/Graphite.php';

class PostModel {
    
    public function parseArticle($data) {
        //inizializzo il parser
        $parser = ARC2::getSemHTMLParser();
        $base = 'http://ltw1102.web.cs.unibo.it/Spammers/';
        $parser->parse($base, $data);
        $parser->extractRDF('rdfa');
        
        $triples = $parser->getTriples();
        print_r($triples);
        $index = $parser->getSimpleIndex(0);
        print_r($index);
        $rdfxml = $parser->toRDFXML($triples);
        print_r($rdfxml);
        
        //$base = 'http://ltw1102.web.cs.unibo.it';
//        $parser->parse(/*$base,*/ $data);
//        $index = $parser->getSimpleIndex(0);
//        print_r($index);
        return true;
    }
}

?>
