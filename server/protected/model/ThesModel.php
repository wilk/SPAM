<?php
include_once 'protected/module/arc/ARC2.php';
include_once 'protected/module/Graphite.php';

/*  thesaurus model class */
class ThesModel {
    
    static public function test(){
        $prova = '
        <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:sioc="http://rdfs.org/sioc/ns#"
            xmlns:ctag="http://commontag.org/ns#"
            xmlns:skos="http://www.w3.org/2004/02/skos/core#">
                <rdf:Description rdf:about="messaggiodipippo">
                    <sioc:Post>testo di sto cazzo di mess</sioc:Post>
                    <ctag:Tag>tag</ctag:Tag>
                    <skos:Topic>minchia</skos:Topic>
                </rdf:Description>
        <rdf:RDF>';
        $parser = ARC2::getRDFXMLParser();
        $base = 'http://localhost:81/';
        $parser->parse(/*'data/tesauro.rdf'*/$base, $prova);
        $index = $parser->getSimpleIndex(0);
        print_r($index);
        $ser = ARC2::getRDFXMLSerializer();
        $RDF = $ser->getSerializedIndex($index);
        print_r($RDF);        
    }
}

?>
