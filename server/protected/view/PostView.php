<?php

class PostView {
    /* prende in input il post come array e lo ritorna in html+rdfa */

    public static function renderPost($p, $userID=null, $postID=null) {
        //Definisco template di un articolo HTML standard da inviare
        print_r($p);
        print "\n\r";
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
   <span property="tweb:countLike" content="%LIKEVALUE%" />
   <span property="tweb:countDislike" content="%DISLIKEVALUE%" />
</article>';
        //Identifico array delle variabili del template da sostituire
        $article_vars = array("%POSTID%", "%USERID%", "%POSTDATE%", "%POSTCONTENT%", "%USERLIKE%", "%LIKEVALUE%", "%DISLIKEVALUE%");
        //Controllo se l'utente ha un preferenza di like o dislike
        $userPref = '';
        if (isset($p['http://vitali.web.cs.unibo.it/vocabulary/like'])) {
            foreach ($p['http://vitali.web.cs.unibo.it/vocabulary/like'] as $likeUser) {
                if ($likeUser == "spam:/Spammers/" . $userID) {
                    $userPref = '<span rev="tweb:like" resource="/Spammers/' . $userID . '" />';
                    break;
                }
            }
        }
        if (isset($p['http://vitali.web.cs.unibo.it/vocabulary/dislike'])) {
            foreach ($p['http://vitali.web.cs.unibo.it/vocabulary/dislike'] as $dislikeUser) {
                if ($dislikeUser == "spam:/Spammers/" . $userID) {
                    $userPref = '<span rev="tweb:dislike" resource="/Spammers/' . $userID . '" />';
                    break;
                }
            }
        }
//Specifico array con i valori da inserire
        $article_values = array(
            "/Spammers/" . $userID . '/' . $postID,
            "/" . $userID . '/' . $postID,
            $p['http://purl.org/dc/terms/created'][0],
            htmlentities($p['http://rdfs.org/sioc/ns#content'][0], ENT_QUOTES, 'UTF-8'),
            $userPref,
            $p['http://vitali.web.cs.unibo.it/vocabulary/countLike'][0],
            $p['http://vitali.web.cs.unibo.it/vocabulary/countDislike'][0],
        );
        $article_html = str_replace($article_vars, $article_values, $articleTemplate);
        return $article_html;
    }

    /* il parametro $m è un array multiplo di post */

    public static function renderMultiplePost($m) {
        $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><archive></archive>');
        foreach ($m as $post) {
            $myPost = $xml->addChild('post');
            $myPost->addChild('content', 'text/html; charset=UTF8');
            $myPost->addChild('affinity', rand(3, 13));
            $myPost->addChild($this->renderPost($post));
            ;
        }
        return $xml->asXML();
    }

}

?>