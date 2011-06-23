<?php

include_once 'protected/module/arc/ARC2.php';
include_once 'protected/module/Graphite.php';
include_once 'protected/model/SRVModel.php';
include_once 'protected/model/ThesModel.php';
include_once 'protected/module/simple_html_dom.php';

class PostModel {

    private static $pathPost = 'data/posts.rdf';
    /* RDF properties */
    private static $siocTopic = 'http://rdfs.org/sioc/ns#topic';
    private static $siocContent = 'http://rdfs.org/sioc/ns#content';
    private static $siocPost = 'http://rdfs.org/sioc/ns#Post';
    private $index;
    public $postID;
    private $msg2 = '
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
    static $msg = '
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
            </article>';

    function __construct() {
        $parser = ARC2::getRDFParser();
        $parser->parse(self::$pathPost);
        $this->index = $parser->getSimpleIndex();
    }

    private function saveInPost() {
        //$index['chronos']['sioc:Post'][] = $p;
        $ns = array(
            'sioc' => 'http://rdfs.org/sioc/ns#',
            'dcterms' => 'http://purl.org/dc/terms/',
            'ctag' => 'http://commontag.org/ns#',
            'skos' => 'http://www.w3.org/2004/02/skos/core#',
            'tweb' => 'http://vitali.web.cs.unibo.it/vocabulary/',
            'spam' => 'http://ltw1102.web.cs.unibo.it/'
        );
        $conf = array('ns' => $ns);
        $ser = ARC2::getRDFXMLSerializer($conf);
        $rdfxml = $ser->getSerializedIndex($this->index);
        //print_r($rdfxml);
        @file_put_contents(self::$pathPost, $rdfxml);
    }

    public static function parseArticle($data, $base = 'http://ltw1102.web.cs.unibo.it/') {
        //commentare la riga successiva per bypassare la stringa per i test
        $data = self::$msg;
        //inizializzo il parser per parserizzare HTML+RDFa
        $parser = ARC2::getSemHTMLParser();
        $parser->parse($base, $data);
        $parser->extractRDF('rdfa');
        $parsedArray = $parser->getSimpleIndex();
        //print_r($parsedArray);
        $html = str_get_html($data);
        $testoHTML = html_entity_decode($html->find('article', 0)->innertext, ENT_QUOTES, 'UTF-8');
        /* questo controllo serve quando ricevo da client e non so nulla del messaggio,
         * quindi il mio array sarà vuoto: lo creo mettendo solo il testo del messaggio;
         * ci penserà la initNewPost ad arricchirlo.
         */
        if (!sizeof($parsedArray))
            $parsedArray['null'][self::$siocContent][] = $testoHTML;
        else {
            foreach ($parsedArray as $k => $resource) {
                $parsedArray[$k][self::$siocContent][] = $testoHTML;
                break;
            }
        }
        //print_r($parsedArray);
        return $parsedArray;
    }

    public function initNewPost($data) {
        $index = self::parseArticle($data);
        $usrResource = 'spam:/Spammers/' . $_SESSION['user']['username'];
        /* Customize post */
        $pre = array();
        $pre['rdf:type'][] = 'sioc:Post';
        $pre['sioc:has_creator'][] = $usrResource;
        $pre['dcterms:created'][] = date(DATE_ATOM);
        $pre['tweb:countLike'][] = 0;
        $pre['tweb:countDislike'][] = 0;
        /* questi non se li caga
          $pre['tweb:like'] = array();
          $pre['tweb:disklike'] = array();
         * 
         */
        $this->postID = $usrResource . '/' . rand();
        $customized[$this->postID] = $pre;
//        print_r($index);
//        $post = current($index);
//        print_r($post);
        foreach ($index as $post) {
            foreach ($post as $k => $risorsa) {
                if ($k == self::$siocContent) {
                    $customized[$this->postID]['sioc:content'][] = $risorsa[0];
                } elseif ($k == self::$siocTopic) {
                    $customized[$this->postID]['sioc:topic'] = $risorsa;
                    $tesauro = new ThesModel(TRUE);
                    foreach ($risorsa as $i) {
                        if ($index[$i]['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0] == 'http://commontag.org/ns#Tag')
                            $customized[$i] = $index[$i];
                        else {
                            $tesauro->addPost2Thes($i, $index[$i], $this->postID);
                        }
                    }
                }
            }break;
        }

        //print_r($customized);
        foreach ($customized as $k => $v) {
            $this->index[$k] = $v;
        }
        $this->saveInPost();
        return $this->postID;
    }

    public function addRespamOf($r) {
        $pID = $this->postID;
        if (isset($this->index[$pID]['tweb:respamOf'][0]))
            $this->index[$pID]['tweb:respamOf'][0] = $r;
        else
            $this->index[$pID]['tweb:respamOf'][] = $r;
        $this->saveInPost();
    }

    public function addReplyOf($reply) {
        $this->index[$this->postID]['sioc:reply_of'][] = $reply;
        $this->saveInPost();
        return $this->postID;
    }

    public function addHasReply($p, $path = null) {
        if (!$path)
            $this->index[$p]['sioc:has_reply'][] = $this->postID;
        else
            $this->index[$p]['sioc:has_reply'][] = $path;
        $this->saveInPost();
    }

    public function postExist($r) {
        if (isset($this->index[$r]))
            return true;
        return false;
    }

    public function getPost($r) {
        $a = array(
            $r => $this->index[$r]
        );
        return $a;
    }
    
    //devo gestire il limite
    public function getPostArray($a = NULL) {
        $lista = array();
        if ($a != NULL) {//se ricevo una lista di postid
            foreach ($a as $i) {
                if ($this->postExist($i))
                    array_push($lista, $this->getPost($i));
            }
        }
        else {//TODO altrimenti pusho i post che trovo
            //$a = array_reverse($this->index, TRUE);
            foreach ($this->index as $k => $post) {
                if ($post['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0] == 'http://rdfs.org/sioc/ns#Post')
                    array_push ($lista, $this->getPost($k));
            }
        }
        //print_r($lista);
        return $lista;
    }

    public function addLike($p, $value, $userID, $serverID="Spammers") {
        switch ($value) {
            case 0:
                if(!$this->neutralLike($p, $serverID, $userID))
                        $this->neutralDislike($p, $serverID, $userID);
                $this->saveInPost();
                break;
            case 1:
                //Se c'è tweb:dislike rimuovilo, aggiungi tweb:like, decrementa countDislike e incrementa countLike
                $this->neutralDislike($p, $serverID, $userID);
                $this->like($p, $serverID, $userID);
                $this->saveInPost();
                break;
            case -1:
                //Se c'è tweb:like rimuovilo, aggiungi tweb:dislike, decrementa countLike e incrementa countDislike
                $this->neutralLike($p, $serverID, $userID);
                $this->dislike($p, $serverID, $userID);
                $this->saveInPost();
                break;
        }
    }

    public function neutralLike($p, $serverID, $userID) {
        //Rimuovi tweb:like/dislike e decrementa il valore appropriato
        if (isset($this->index[$p]['http://vitali.web.cs.unibo.it/vocabulary/like'])) {
            foreach ($this->index[$p]['http://vitali.web.cs.unibo.it/vocabulary/like'] as $key => $likeUser) {
                if ($likeUser == "spam:/" . $serverID . "/" . $userID) {
                    unset($this->index[$p]['http://vitali.web.cs.unibo.it/vocabulary/like'][$key]);
                    $this->index[$p]['http://vitali.web.cs.unibo.it/vocabulary/countLike'][0]--;
                    return true;
                }
            }
        }
    }
    
    public function neutralDislike($p, $serverID, $userID) {    
        if (isset($this->index[$p]['http://vitali.web.cs.unibo.it/vocabulary/dislike'])) {
            foreach ($this->index[$p]['http://vitali.web.cs.unibo.it/vocabulary/dislike'] as $key => $dislikeUser) {
                if ($dislikeUser == "spam:/" . $serverID . "/" . $userID) {
                    unset($this->index[$p]['http://vitali.web.cs.unibo.it/vocabulary/dislike'][$key]);
                    $this->index[$p]['http://vitali.web.cs.unibo.it/vocabulary/countDislike'][0]--;
                    return;
                }
            }
        }
    }

    public function like($p, $serverID, $userID) {
        $this->index[$p]['tweb:like'][] = "spam:/" . $serverID . "/" . $userID;
        $this->index[$p]['http://vitali.web.cs.unibo.it/vocabulary/countLike'][0]++;
    }

    public function dislike($p, $serverID, $userID) {
        $this->index[$p]['tweb:dislike'][] = "spam:/" . $serverID . "/" . $userID;
        $this->index[$p]['http://vitali.web.cs.unibo.it/vocabulary/countDislike'][0]++;
    }

}

?>