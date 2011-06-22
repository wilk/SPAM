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

    public function notAuth() {
        header('Status: 401');
        print ("Devi eseguire il login per utilizzare questa funzione!!");
    }

    public static function notFound($msg) {
        header('Status: 404');
        print ($msg);
    }

    public function notSupport() {
        header('Status: 405');
    }

    public static function badReq($msg) {
        header('Status: 400');
        print $msg;
    }

    public static function internalError() {
        header('Status: 500');
        print 'Anche le scimmie cadono dagli alberi .. risolveremo il problema il prima possibile.';
    }

    public static function notImpl() {
        header('Status: 501');
        print 'Ora pretendi troppo. Questa non l\'abbiamo implementata.';
    }
    public static function conflict() {
        header('Status: 409');
        print 'Ti vedo indeciso! Mi chiedi un rdf ma non l\'accetti.';
    }

}

?>