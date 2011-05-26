<?php
/*Classe per i test*/
class TestController extends DooController{
    
    public function extresource(){
        $url = $_POST['url'];

        $ch = curl_init();
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt ($ch, CURLOPT_URL, $url);
        curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 20);
        // questa la vedo in più
        //curl_setopt ($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11');

        // chiamo solo l'header
        curl_setopt($ch, CURLOPT_HEADER, true); // header will be at output
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'HEAD'); // HTTP request is 'HEAD'

        $content = curl_exec ($ch);
        curl_close ($ch);

        print $content;
    }
}

?>
