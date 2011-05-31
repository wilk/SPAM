<?php

include_once 'protected/model/PostModel.php';
class PostController extends DooController {
    
    public function beforeRun($resource, $action){
		session_start();
		
		//if not login, group = anonymous
		$role = (isset($_SESSION['user']['group'])) ? $_SESSION['user']['group'] : 'anonymous';
		
		//check against the ACL rules
		if($rs = $this->acl()->process($role, $resource, $action )){
			//echo $role .' is not allowed for '. $resource . ' '. $action;
			return $rs;
		}
	}

    public function createPost() {
        /*Recupero nella variabile $content tutto quello che mi viene passato tramite POST
         */
        $content= $_POST['article'];
        echo $content;
        $articolo = new PostModel();
        if ($articolo->parseArticle($content))
            return 201;
    }

    public function sendPost() {
        /* Salvo il valore serverID dell'URI e lo stampo */
        $server = $this->params['serverID'];
        echo ($server);
        /* Creo una connessione ed eseguo una richiesta al server;
         * ritorno il codice ricevuto dal server;
         */
        $this->load()->helper('DooRestClient');
        $request = new DooRestClient;
        $request->connect_to("http://www.google.it")->get();
        return ($request->resultCode());
    }

    /* il retweet crea un messaggio sul server quando il client gli passa
     * un <article> esattamente come accade in createPost;
     * al momento lascio cmq il suo metodo */

    public function createRespam() {
;
    }

    /* questa mi sa che dovrebbe essere private */

    public function hasReply() {
;
    }

}

?>
