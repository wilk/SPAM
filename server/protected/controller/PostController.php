<?php

class PostController extends DooController{
  
    public function createPost(){
        echo ('Sto cazzo stai per creare un post!!');
    }
    
    public function recivePost() {
         $ch = curl_init(); 
            curl_setopt($ch, CURLOPT_URL, "http://spam2.localhost:8888/post/server02/user4/post6"); 
            curl_setopt($ch, CURLOPT_HEADER, TRUE); 
            curl_setopt($ch, CURLOPT_NOBODY, TRUE); // remove body 
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE); 
            $head = curl_exec($ch); 
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE); 
            curl_close($ch); 
        $server=$this->params['serverID'];
        echo ($server);
        echo ($httpCode);
    }
}
?>
