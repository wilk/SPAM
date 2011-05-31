<?php

class SearchController extends DooController {
    /* qui sono mazzate */

    public function searchMain() {
        ;
    }

    public function fakeSearch() {
        $eol = "\r\n";
        $data = '';

        $mime_boundary = "aXFFS";

        $data .= '--' . $mime_boundary . $eol;
        $data .= 'Content-Type: text/html; charset=UTF-8' . $eol . $eol;
        $data .= '<article
   xmlns:sioc="http://rdfs.org/sioc/ns#"
   xmlns:ctag="http://commontag.org/ns#"
   xmlns:skos="http://www.w3.org/2004/02/skos/core#"
   xmlns:dcterms="http://purl.org/dc/terms/"
   xmlns:tweb="http://vitali.web.cs.unibo.it/vocabulary/"
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
</article>' . $eol;
        $content = $data . $data . $data . $data . $data . $data . $data . $data . $data . $data;
        $content .= '--' . $mime_boundary . $eol;
        echo header('Content-Type: multipart/form-data; boundary="aXFFS"');
        echo $content;
        //return 200;
    }

}

?>
