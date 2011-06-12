<?php

include_once 'protected/model/UserModel.php';

class FollowController extends DooController{
	
	public function setFollow(){
            if (!(isset($_POST['serverID'])) && 
                    !(isset($_POST['userID'])) &&
                        !(isset($_POST['value']))){
                //mancano parametri (i.e. la richiesta è stata fatta male)
                //return 406;
            } else {
                $risorsa = '/' . $_POST['serverID'] . '/' . $_POST['userID'];
                $v = $_POST['value'];
                $utente = new UserModel($_SESSION['user']['username']);
                $utente->handleFollow($risorsa, $v);
            }
        }
}
?>
