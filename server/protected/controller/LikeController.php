<?php

include_once 'protected/model/PostModel.php';

class LikeController extends DooController {
    /* questa si occupa di soddisfare il client */

    public $articolo;

    public function setLike() {
        session_name('ltwlogin');
        session_start();
        $serverID = $_POST['serverID'];
        $userID = $_POST['userID'];
        $postID = $_POST['postID'];
        $value = $_POST['value'];
        if ($serverID == "Spammers") {
          $this->articolo = new PostModel();
          $p= $this->articolo->getPost('spam:/' . $serverID . '/' . $userID . '/' . $postID);
          $this->articolo->addLike($p, $value, $_SESSION['user']['username']);
        }
    }

    /* informa della preferenza il server che possiede il messaggio */

    public function propagateLike() {
        ;
    }

}

?>
