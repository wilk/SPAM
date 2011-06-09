<?php
include_once 'protected/model/PostModel.php';
include_once 'protected/view/PostView.php';

class SearchController extends DooController {
	
	/*qui sono mazzate*/
	public function searchMain(){
            $post = new PostModel;
            $lista = $post->getPostArray();
            $XMLPosts = PostView::renderMultiplePost($lista);
            $this->setContentType('xml');
            print $XMLPosts;
        }
}
?>
