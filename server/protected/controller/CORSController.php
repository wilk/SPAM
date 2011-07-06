<?php

class CORSController extends DooController {

    public function sendOk() {
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
        header("Access-Control-Max-Age: 1728000");
    }

}
?>