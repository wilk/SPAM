<?php
include_once 'protected/module/arc/ARC2.php';
include_once 'protected/module/Graphite.php';
/*Classe per i test*/
class TestController extends DooController{

    public function getHead(){
        if (!isset($_POST['url']))
            ErrorController::badReq ("<b>Nessun url da proxare.</b>\n Riprova passando un link corretto alla POST.\n");
        $url =html_entity_decode($_POST['url']);
        $url = quoted_printable_decode($url);
        $this->load()->helper('DooRestClient');
        $request = new DooRestClient;
        $request->connect_to($url)->get();
        echo $request->resultContentType();
    }
    
    public function tester() {
        $prova = '
            <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
              xmlns:ns0="http://rdfs.org/sioc/ns#"
              xmlns:ns1="http://commontag.org/ns#"
              xmlns:ns2="http://www.w3.org/2004/02/skos/core#">

            <rdf:Description rdf:about="postID">
                
                <ns0:Post>
                       qui ci vorrei il mio testo
                </ns0:Post>
                <ns0:topic>
                        <rdf:type rdf:resource="http://commontag.org/ns#Tag" ns1:label="hashtag"/>
                </ns0:topic>
            </rdf:Description>
            </rdf:RDF>';

        $parser = ARC2::getRDFParser();
        $base = 'http://ltw1102.cs.unibo.it/Spammers/';
        $parser->parse($base, $prova);
        $index = $parser->getSimpleIndex();
        print_r($index);
        
        $dollaro['rdf:Bag']['rdf:about'] = $index;
        $dollaro['rdf:Bag']['rdf:about'] = $index;
        
        $ns = array (
            'sioc' => "http://rdfs.org/sioc/ns#",
            'ctag' => "http://commontag.org/ns#",
            'skos' => "http://www.w3.org/2004/02/skos/core#",
            'foaf' => 'http://xmlns.com/foaf/0.1/',
            'tweb' => 'http://vitali.web.cs.unibo.it/TechWeb11/',
            'spammers' => 'http://ltw1102.web.cs.unibo.it/Spammers/'
        );
        $conf = array('ns' => $ns);
        $ser = ARC2::getRDFXMLSerializer($conf);
        $doc = $ser->getSerializedIndex($index);
        print_r($doc);
    }
}

?>
