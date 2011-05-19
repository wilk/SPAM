<?php

class PostController extends DooController{
  
    public function createPost(){
        echo ('Sto cazzo stai per creare un post!!');
    }
    
    public function sendPost() {
        /*Salvo il valore serverID dell'URI e lo stampo*/
        $server=$this->params['serverID'];
        echo ($server);
        /*Creo una connessione ed eseguo una richiesta al server;
         * ritorno il codice ricevuto dal server;
         */
        $this->load()->helper('DooRestClient');
        $request= new DooRestClient;
        $request->connect_to("http://spam2.localhost:8888/post/server02/user4/post6")->get();
        return ($request->resultCode());
    }
    
    /*il retweet crea un messaggio sul server quando il client gli passa
     *un <article> esattamente come accade in createPost;
     *al momento lascio cmq il suo metodo*/
    public function createRetweet(){;}
    
    /*questa mi sa che dovrebbe essere private*/
    public function hasReply(){;}
}
?>
