<?php

include_once 'protected/module/arc/ARC2.php';
include_once 'protected/module/Graphite.php';

class PostModel {
    
    private static $pathPost = "data/post.rdf";

    public function parseArticle($data) {
        $msg2 = '
            <article prefix="
               sioc: http://rdfs.org/sioc/ns#
               ctag: http://commontag.org/ns#
               skos: http://www.w3.org/2004/02/skos/core#
               dcterms: http://purl.org/dc/terms/
               tweb: http://vitali.web.cs.unibo.it/vocabulary/"

               about="/tw12/pippo/11" typeof="sioc:Post" rel="sioc:has_creator" resource="/tw12/pippo"
               property="dcterms:created" content="2006-09-07T09:33:30Z">
               <div about="/tw12/pippo/11">
                  Testo di un post contenente 
                  <span rel="sioc:topic">#<span typeof="ctag:Tag" property="ctag:label">hashtag</span></span>,
                  altri hashtag che si riferiscono a concetti del tesauro condiviso (ad esempio 
                  <span rel="sioc:topic">#<span typeof="skos:Concept" about="/sport/calcio/portiere" 
                  rel="skos:inScheme" resource="http://vitali.web.cs.unibo.it/TechWeb11/thesaurus">portiere</span> </span>)
                  o del tesauro esteso (ad esempio 
                  <span rel="sioc:topic">#<span typeof="skos:Concept" about="/sport/calcio/portiere/roma" 
                  rel="skos:inScheme" resource="http://ltw11.web.cs.unibo.it/thesaurus">roma</span></span>)
                  o link sparsi (ad esempio, http://www.example.com),
                  e perché no un po\' di audio (ad esempio, 
                  <span resource="audio" src="http://www.example.com/song.mp3" />),
                  o un po\' di video (ad esempio, 
                  <span resource="video" src="http://www.example.com/video.ogv" />),
                  e immagini (ad esempio, 
                  <span resource="image" src="http://www.example.com/pic.png" />).
                  <span rev="tweb:like" resource="/tw14/pluto" />
                  <span property="tweb:countLike" content="1" />
                  <span property="tweb:countDislike" content="5" />
               </div>
            </article>
            ';
        $msg = '
            <article
               xmlns:sioc="http://rdfs.org/sioc/ns#"
               xmlns:ctag="http://commontag.org/ns#"
               xmlns:skos="http://www.w3.org/2004/02/skos/core#"
               typeof="sioc:Post">
               Testo di un post contenente
               <span rel="sioc:topic">#<span typeof="ctag:Tag" property="ctag:label">hashtag</span></span>,
               altri hashtag che si riferiscono a concetti del tesauro condiviso (ad esempio 
               <span rel="sioc:topic">#
                  <span typeof="skos:Concept" 
                     about="/sport/calcio/portiere" 
                     rel="skos:inScheme"
                     resource="http://vitali.web.cs.unibo.it/TechWeb11/thesaurus">
                     portiere</span>
               </span>)
               o del tesauro esteso (ad esempio
               <span rel="sioc:topic">#
               <span typeof="skos:Concept" 
                  about="/sport/calcio/portiere/roma" 
                  rel="skos:inScheme"
                  resource="http://ltw11.web.cs.unibo.it/thesaurus">roma</span></span>)
               e altro html sparso (ad esempio, <a href="http://www.example.com">http://www.example.com</a>)
            </article';
        //inizializzo il parser
        $parser = ARC2::getSemHTMLParser();
        $base = 'http://ltw1102.web.cs.unibo.it/';
        $parser->parse($base, $msg);
        $parser->extractRDF('rdfa');
        $index = $parser->getSimpleIndex();
        //DEBUG----> print_r($index);
        
        /* RDF properties */
//        $rdfType   = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
        $siocTopic = 'http://rdfs.org/sioc/ns#topic';
//        $cTag      = 'http://commontag.org/ns#Tag';
//        $cLabel    = 'http://commontag.org/ns#label';
//        $sConcept  = 'http://www.w3.org/2004/02/skos/core#Concept';
        
        /*Customize post*/
        $pre = array();
        $pre['rdf:type'][] = 'sioc:Post';
        $pre['sioc:Post'][] = 'questo è il mio messaggio';
        $pre['sioc:has_creator'][] = 'autore';
        $pre['dcterms:created'][] = date(DATE_ATOM);
        $pre['tweb:countLike'][] = 0;
        $pre['tweb:countDislike'][] = 0;
        $postID = 'riferimento Post';
        $customized[$postID] = $pre;
        foreach ($index as $subj) {
            foreach ($subj as $k => $type){
                if ($k == $siocTopic){
                    $customized[$postID]['sioc:topic'] = $type;
                    foreach ($type as $i) {
                        $customized[$i] = $index[$i];
                    }
                }
            }
        }
        
        print_r($customized);
        $this->savePost($customized, $postID);
        return true;
    }
    
    private function savePost($a, $p){
        $parser = ARC2::getRDFParser();
        $parser->parse(self::$pathPost);
        $index = $parser->getSimpleIndex();
        foreach ($a as $k => $v) {
            $index[$k] = $v;
        }
        //$index['chronos']['sioc:Post'][] = $p;
        $ns = array (
            'sioc' => "http://rdfs.org/sioc/ns#",
            'dcterms' => 'http://purl.org/dc/terms/',
            'ctag' => "http://commontag.org/ns#",
            'skos' => "http://www.w3.org/2004/02/skos/core#",
            'foaf' => 'http://xmlns.com/foaf/0.1/',
            'tweb' => 'http://vitali.web.cs.unibo.it/TechWeb11/',
            'spammers' => 'http://ltw1102.web.cs.unibo.it/Spammers/'
        );
        $conf = array('ns' => $ns);
        $ser = ARC2::getRDFXMLSerializer($conf);
        $rdfxml = $ser->getSerializedIndex($index);
        print_r($rdfxml);
        //@file_put_contents(self::$pathPost, $rdfxml);
    }
}

?>