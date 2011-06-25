<?php

include_once 'protected/module/arc/ARC2.php';

class PostView {
    /* prende in input il post come array e lo ritorna in html+rdfa */
    //TODO: Aggiungere stampa geotag

    public static function renderPost($p, $myUser=null) {
        //Definisco template di un articolo HTML standard da inviare
        $key = key($p);
        //print_r($p); die();
        $articleTemplate = '<article prefix="
   sioc: http://rdfs.org/sioc/ns#
   ctag: http://commontag.org/ns#
   skos: http://www.w3.org/2004/02/skos/core#
   dcterms: http://purl.org/dc/terms/
   tweb: http://vitali.web.cs.unibo.it/vocabulary/"
    about="%POSTID%" typeof="sioc:Post" rel="sioc:has_creator" resource="%USERID%"
   property="dcterms:created" content="%POSTDATE%">
   %POSTCONTENT%
   %USERLIKE%
   %LIKEVALUE%
   %DISLIKEVALUE%
   %HASREPLY%
   %RESPAMOF%
   %REPLYOF%
</article>';
        //Identifico array delle variabili del template da sostituire
        $article_vars = array("%POSTID%", "%USERID%", "%POSTDATE%", "%POSTCONTENT%", "%USERLIKE%", "%LIKEVALUE%", "%DISLIKEVALUE%", "%HASREPLY%", "%RESPAMOF%", "%REPLYOF%");
        //Controllo se l'utente ha un preferenza di like o dislike
        $userPref = '';
        if ($myUser != null) {
            if (isset($p[$key]['http://vitali.web.cs.unibo.it/vocabulary/like'])) {
                foreach ($p[$key]['http://vitali.web.cs.unibo.it/vocabulary/like'] as $likeUser) {
                    if ($likeUser == "spam:/Spammers/" . $myUser) {
                        $userPref = '<span rev="tweb:like" resource="/Spammers/' . $myUser . '" />';
                        break;
                    }
                }
            }
            if (isset($p[$key]['http://vitali.web.cs.unibo.it/vocabulary/dislike'])) {
                foreach ($p[$key]['http://vitali.web.cs.unibo.it/vocabulary/dislike'] as $dislikeUser) {
                    if ($dislikeUser == "spam:/Spammers/" . $myUser) {
                        $userPref = '<span rev="tweb:dislike" resource="/Spammers/' . $myUser . '" />';
                        break;
                    }
                }
            }
        }
        $listOfReply = '';
        if (isset($p[$key]['http://rdfs.org/sioc/ns#has_reply'])) {
            foreach ($p[$key]['http://rdfs.org/sioc/ns#has_reply'] as $hasReply) {
                $pathPost = strstr($hasReply, '/');
                $listOfReply .= "<span rev=\"sioc:has_reply\" resource=\"$pathPost\" />\n\r";
            }
        }
        $respamOF = '';
        if (isset($p[$key]['http://vitali.web.cs.unibo.it/vocabulary/respamOf'])) {
            $pathPost = strstr($p[$key]['http://vitali.web.cs.unibo.it/vocabulary/respamOf'][0], '/');
            $respamOF = "<span rev=\"tweb:respamOf\" resource=\"$pathPost\" />\n\r";
        }
        $replyOf = '';
        if (isset($p[$key]['http://rdfs.org/sioc/ns#reply_of'])) {
            $pathPost = strstr($p[$key]['http://rdfs.org/sioc/ns#reply_of'][0], '/');
            $respamOF = "<span rev=\"sioc:reply_of\" resource=\"$pathPost\" />\n\r";
        }
        $elementPost = explode('/', strstr($key, '/'));
        unset($elementPost[3]);
        $authorPost = implode('/', $elementPost);
//Specifico array con i valori da inserire
        $article_values = array(
            strstr($key, '/'),
            $authorPost,
            $p[$key]['http://purl.org/dc/terms/created'][0],
            html_entity_decode($p[$key]['http://rdfs.org/sioc/ns#content'][0]),
            $userPref,
            "<span property=\"tweb:countLike\" content=\"" . $p[$key]['http://vitali.web.cs.unibo.it/vocabulary/countLike'][0] . "\" />",
            "<span property=\"tweb:countDislike\" content=\"" . $p[$key]['http://vitali.web.cs.unibo.it/vocabulary/countDislike'][0] . "\" />",
            $listOfReply,
            $respamOF,
        );
        $article_html = str_replace($article_vars, $article_values, $articleTemplate);
        return $article_html;
    }

    public static function renderPostRdf($p) {
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
        $rdfxml = $ser->getSerializedIndex($p);
        return $rdfxml;
    }

    /* il parametro $m è un array multiplo di post */

    public static function renderMultiplePost($m) {
        $dom = new DOMDocument('1.0', 'utf-8');
        $archive = $dom->appendChild($dom->createElement('archive'));
        /* $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><archive></archive>'); */
        foreach ($m as $k => $post) {
//            $myPost = $xml->addChild('post');
//            $myPost->addChild('content', 'text/html; charset=UTF8');
//            $myPost->addChild('affinity', rand(3, 13));
            $myPost = $archive->appendChild($dom->createElement('post'));
            $myPost->appendChild($dom->createElement('content', 'text/html; charset=UTF8'));
            $myPost->appendChild($dom->createElement('affinity', rand(1, 20)));
            $content = self::renderPost($m[$k]);
            //$myPost->addChild(self::renderPost($post));

            $article = $dom->createTextNode($content);
            $myPost->appendChild($article);
        }
        return htmlspecialchars_decode($dom->saveHTML());
    }

}

?>