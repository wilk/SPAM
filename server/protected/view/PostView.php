<?php

class PostView {
    
    /*prende in input il post come array e lo ritorna in html+rdfa*/
    public function renderPost($p){
        $post = current($p);
        $about = key($p);
        //questa è scandalosa... ma funge!
        $subj = substr($about, 30);
        $creator = substr($post['http://rdfs.org/sioc/ns#has_creator'][0], 30);
        $data = $post['http://purl.org/dc/terms/created'][0];
        
        $postHTML = 
        '<article prefix="
           sioc: http://rdfs.org/sioc/ns#
           ctag: http://commontag.org/ns#
           skos: http://www.w3.org/2004/02/skos/core#
           dcterms: http://purl.org/dc/terms/
           tweb: http://vitali.web.cs.unibo.it/vocabulary/"';

        $postHTML .= ' about="'.$subj.'" typeof="sioc:Post" 
                            rel="sioc:has_creator" resource="'.$creator.'" ';
        $postHTML .= 'property="dcterms:created" content="'.$data.'">\n';
        $postHTML .= '<div about="'.$subj.'">\n';
        //corpo del messaggio
        $postHTML .= $post['http://rdfs.org/sioc/ns#Post'][0];
        
        if (isset($post['http://vitali.web.cs.unibo.it/vocabolary/countLike'][0])) {
            $countLike = $post['http://vitali.web.cs.unibo.it/vocabolary/countLike'][0];
            $postHTML .= '<span property="tweb:countLike" content="'.$countLike.'" />';
        }
        if (isset($post['http://vitali.web.cs.unibo.it/vocabolary/countDislike'][0])) {
            $countDislike = $post['http://vitali.web.cs.unibo.it/vocabolary/countDislike'][0];
            $postHTML .= '<span property="tweb:countLike" content="'.$countDislike.'" />';
        }
        $postHTML .= '</article>';
        
        return $postHTML;
    }
}

?>
