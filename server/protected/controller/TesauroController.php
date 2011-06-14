<?php

include_once 'protected/model/ThesModel.php';

class TesauroController extends DooController {

    public function addTerm() {
        if (!(isset ($_POST['parentterm']))||!(isset ($_POST['term']))){
            echo "Sia parentterm che term devono essere specificati";
            return 400;
        }
        $parent= $_POST['parentterm'];
        $term=$_POST['term'];
        if ($parent==$term){
            echo "I termini non possono essere uguali";
            return 400;
        }
        $thes = new ThesModel();
        if (!($thes->extendTesauro($parent, $term)))
            return 400;
        else return 201;
    }

    public function sendThesaurus() {
        $thes = new ThesModel();
        $tesauro = $thes->getTesauro();
        header('Content-type: application/rdf+xml');
        print $tesauro;
    }

}

?>
