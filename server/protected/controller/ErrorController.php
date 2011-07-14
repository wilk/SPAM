<?php

/**
 * ErrorController
 * Feel free to change this and customize your own error message
 *
 * @author darkredz
 */
class ErrorController extends DooController {

    public function index() {
        echo '<h1>ERROR 404 not found</h1>';
        echo '<p>This is handler by an internal Route as defined in common.conf.php $config[\'ERROR_404_ROUTE\']</p>
                
<p>Your error document needs to be more than 512 bytes in length. If not IE will display its default error page.</p>

<p>Give some helpful comments other than 404 :(
Also check out the links page for a list of URLs available in this demo.</p>';
    }
    //TODO: Eliminare tutti gli header HTTP, sono stati inseriti per genererare gli errori al di fuori di cgi
    public function notAuth() {
        header('Status: 401');
        header('HTTP/1.1 401');
        die ("Devi eseguire il login per utilizzare questa funzione!!");
    }

    public static function notFound($msg) {
        header('Status: 404');
        header('HTTP/1.1 404');
        die ($msg);
    }

    public function notSupport() {
        header('Status: 405');
        header('HTTP/1.1 405');
    }

    public static function badReq($msg) {
        header('Status: 400');
        header('HTTP/1.1 400');
        die ($msg);
    }

    public static function internalError() {
        header('Status: 500');
        header('HTTP/1.1 500');
        die ('Anche le scimmie cadono dagli alberi .. risolveremo il problema il prima possibile.');
    }

    public static function notImpl() {
        header('Status: 501');
        header('HTTP/1.1 501');
        die ('Ora pretendi troppo. Questa non l\'abbiamo implementata. (per il momento.....)');
    }
    public static function conflict() {
        header('Status: 409');
        header('HTTP/1.1 409');
        die ('Ti vedo indeciso! Mi chiedi un rdf ma non l\'accetti.');
    }

}

?>