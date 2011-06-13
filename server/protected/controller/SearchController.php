<?php
include_once 'protected/model/PostModel.php';
include_once 'protected/view/PostView.php';

class SearchController extends DooController {
    public function beforeRun($resource, $action) {
        $role;
        session_name("ltwlogin");
        session_start();
        if (!(isset($_SESSION['user']['username']))) {
            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]
                );
            }
            //termino la sessione
            session_destroy();
            session_name("nologin");
            session_start();
            $role = 'anonymous';
        }
        $role = $_SESSION['user']['group'];

        //if not login, group = anonymous
        //$role = (isset($_SESSION['user']['group'])) ? $_SESSION['user']['group'] : 'anonymous';

        //check against the ACL rules
        if ($rs = $this->acl()->process($role, $resource, $action)) {
            //echo $role .' is not allowed for '. $resource . ' '. $action;
            return $rs;
        }
    }
	
	/*qui sono mazzate*/
	public function searchMain(){
            $post = new PostModel;
            $lista = $post->getPostArray();
            $XMLPosts = PostView::renderMultiplePost($lista);
            $this->setContentType('xml');
            print $XMLPosts;
        }
        public function searchRecent($term=null){
            
        }
}
?>
