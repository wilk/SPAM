<?php

include_once 'protected/model/UserModel.php';

class FollowController extends DooController{
	
	public function setFollow(){
            if (!(isset($_POST['serverID'])) && 
                    !(isset($_POST['userID'])) &&
                        !(isset($_POST['value']))){
                //mancano parametri (i.e. la richiesta è stata formulata male)
                return 406;
            } else {
                /* Faccio un piccolo controllo:
                 * se l'utente da seguire è sul mio server, controllo se esiste. 
                 */
                if ($_POST['serverID'] == 'Spammers') {
                    $test = new UserModel($_POST['userID']);
                    if (!$test->ifUserExist()){
                        echo "Errore: l'utente che si vuole seguire non esiste su questo server.";
                        return 500;
                    }
                }
                $risorsa = 'spam:/' . $_POST['serverID'] . '/' . $_POST['userID'];
                $v = intval($_POST['value']);
                //mi aspetto solo i valori 1 o 0, altrimenti i parametri non sono corretti.
                if (($v != 1) && ($v != 0)) return 406;
                $utente = new UserModel($_SESSION['user']['username']);
                $utente->handleFollow($risorsa, $v);
            }
        }
}
?>