<?php

include_once 'protected/model/PostModel.php';
include_once 'protected/model/UserModel.php';
include_once 'protected/model/ThesModel.php';
include_once 'protected/view/PostView.php';
include_once 'protected/controller/ErrorController.php';
include_once 'protected/module/simple_html_dom.php';

class SearchController extends DooController {

    private $listaPost = array();
    private $toMerge = array();
    static $from = "2011/01/01 00:00:00";
    private $salt;
    private $request;
    private $SRV;

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
        else
            $role = $_SESSION['user']['group'];

//if not login, group = anonymous
//$role = (isset($_SESSION['user']['group'])) ? $_SESSION['user']['group'] : 'anonymous';
//check against the ACL rules
        if ($rs = $this->acl()->process($role, $resource, $action)) {
//echo $role .' is not allowed for '. $resource . ' '. $action;
            return $rs;
        }
    }

    public function searchServer() {
        $this->searchMain(TRUE);
    }

    /* il booleano $extRequest viene settano nel route a TRUE se si tratta di /searchserver */

    public function searchMain($extRequest = FALSE) {
        if (!(isset($this->params['limit'])) || !(isset($this->params['type'])))
//BAD REQUEST
            return 400;
        $limite = $this->params['limit'];
        $tipo = $this->params['type'];

        /* Qui definisco i tipi di ricerca */
        $types = array(
            'author',
            'following',
            'recent',
            'related',
            'fulltext',
            'affinity'
        );

        $this->load()->helper('DooRestClient');
        $this->request = new DooRestClient;
        $this->SRV = new SRVModel($this->request);

        switch ($tipo) {
            case $types[0]: //author
                if (!(isset($this->params['var1'])) || !(isset($this->params['var2'])))
//BAD REQUEST
                    return 400;
                $srv = $this->params['var1'];
                $usr = urldecode($this->params['var2']);
                if ($srv == 'Spammers') {//richiesta interna
                    $user = new UserModel($usr);
                    if (!$user->ifUserExist())
                        ErrorController::notFound("Errore: l'utente $usr non esiste.\n");
                    if (!$user->checkPosts())
                        ErrorController::notFound("Errore: l'utente $usr non ha pubblicato messaggi.\n");

                    $this->rcvFromINTServer($user, $limite);
                    $this->displayPosts();
                } else {//richiesta esterna
                    $parametri = array($limite, $tipo, $srv, $usr);
                    $metodo = 'searchserver/' . implode('/', $parametri);
                    $res = $this->rcvFromEXTServer($srv, $metodo);
                    if (is_numeric($res))
                        return $res;
                    print $res;
                }
                break;

            case $types[1]: //following
                if (isset($_SESSION['user']['username'])) {
                    $user = new UserModel($_SESSION['user']['username']);
                    $follows = $user->getFollows();
                    $size = sizeof($follows);
                    if ($size == 0)
                        ErrorController::notFound('Attualmente non ci sono utenti seguiti.');
                    foreach ($follows as $follow) {
                        $posts;
                        list($domain, $srv, $usr) = explode('/', $follow);
                        if ($srv == 'Spammers') {//richiesta interna
                            $utente = new UserModel($usr);
                            $this->rcvFromINTServer($utente, $limite);
                        } else {//richiesta esterna
                            $parametri = array($limite, $types[0], $srv, $usr);
                            $metodo = 'searchserver/' . implode('/', $parametri);
                            $XMLresult = $this->rcvFromEXTServer($srv, $metodo);
                            if ($XMLresult != false)
                                $posts = $this->parseEXTContent($XMLresult);
                        }
                    }
//qui devo ordinare la mia lista
                    $this->sortPost($limite);
                    $this->displayPosts();
                } else
                    return 401;
                break;

            case $types[2]: //recent
                $pIDs = 0;
                $posts;
                $post = new PostModel();

                if (isset($this->params['var1'])) {
                    $termine = $this->params['var1'];
                    $tesauro = new ThesModel(); //oggetto del tesauro
                    $pathTerm = $tesauro->returnPath($termine);
                    $tesauro = new ThesModel(TRUE); //oggetto del tesapost
                    if ($pathTerm !== false)
                        $pIDs = $tesauro->getPostsFromThes($pathTerm, $limite, TRUE);
                    else
                        $pIDs = $tesauro->getPostsByCtag($termine, $limite);
                    if ($pIDs != 0)
                        $posts = $post->getPostArray($pIDs);
                }
                else // qui ricerco senza termine --> OCCHIO ALLA RELATED
                    $posts = $post->getPostArray(NULL, $limite);

                if (isset($posts)) {
//                    echo sizeof($posts); die();
                    foreach ($posts as $post) {
                        $nodo['articolo'] = $post;
                        $nodo['peso'] = strtotime($post[key($post)]['http://purl.org/dc/terms/created'][0]);
//print_r($nodo); die();
                        array_push($this->listaPost, $nodo);
                        array_push($this->toMerge, $nodo['peso']);
                    }
                }

                if ($extRequest === FALSE) {
                    $servers;
                    $this->initServers($servers);

                    $metodo = '/' . $tipo;
                    if (isset($this->params['var1']))
                        $metodo .= '/' . $this->params['var1'];

                    if ($this->rcvFromEXTServers($servers, $limite, $metodo)) {

                        $badServer = array();
                        foreach ($servers as $value) {
                            if ($value['code'] === 200)
                                $this->parseEXTContent($value['data']);
                            else if ($value['code'] === 500)
                                array_push($badServer, $value['name']);

//$test[] = $value['url'].' => '.$value['code']."\n";
                        }
//print_r($test);die();
//qui fanculizzo i server
                        /* if (count($badServer))
                          $this->funcoolizer($badServer);
                         */
                    } else
                        return 500;
                }

                $this->sortPost($limite);
                $this->displayPosts();
                break;

            case $types[3]: //related
                if (!(isset($this->params['var1'])))
//BAD REQUEST
                    return 400;
                $this->salt = strtotime("now") - strtotime(self::$from);
                $termine = $this->params['var1'];
                $tesauro = new ThesModel(); //oggetto del tesauro
                $pathTerm = $tesauro->returnPath($termine);
//$pIDs = 0;
                if ($pathTerm === false)
                    ErrorController::notFound("Il termine non è presente nel tesauro.\n");

                $tesauro = new ThesModel(TRUE); //oggetto del tesapost
                $pIDs = $tesauro->getPostsFromThes($pathTerm, $limite);

                $posts;
                $post = new PostModel();
                if ($pIDs)
                    $posts = $post->getPostArray($pIDs);

                if (isset($posts)) {
                    foreach ($posts as $post) {
                        $nodo['articolo'] = $post;
                        $nodo['peso'] = strtotime($post[key($post)]['http://purl.org/dc/terms/created'][0]);
                        $nodo['peso'] += $this->salt * $this->calcWeight($post, $pathTerm);
                        array_push($this->listaPost, $nodo);
                        array_push($this->toMerge, $nodo['peso']);
                    }
                } //print_r($this->listaPost); die();

                if ($extRequest === FALSE) {
                    $servers;
                    $this->initServers($servers);

                    $metodo = '/' . implode('/', array($tipo, $termine));

                    if ($this->rcvFromEXTServers($servers, $limite, $metodo)) {

                        $badServer = array();
                        foreach ($servers as $value) {
                            if ($value['code'] === 200)
                                $this->parseEXTContent($value['data'], $pathTerm);
                            else if ($value['code'] === 500)
                                array_push($badServer, $value['name']);

//$test[] = $value['url'].' => '.$value['code']."\n";
                        }
//print_r($test);die();
//qui fanculizzo i server
                        /* if (count($badServer))
                          $this->funcoolizer($badServer);
                         */
                    } else
                        return 500;
                }
//					 $this->calcWeight();
                $this->sortPost($limite);
                $this->displayPosts();
                break;

            case $types[4]: //fulltext
                if (!(isset($this->params['var1'])))
//BAD REQUEST
                    ErrorController::badReq("Devi specificare il testo da cercare!!");
                $stringToSearch = urldecode($this->params['var1']);
//Inizializzo il timer e inizio a cercare in locale
                $mtime = microtime();
                $mtime = explode(' ', $mtime);
                $mtime = $mtime[1] + $mtime[0];
                $starttime = $mtime;
                $listOfWords = $this->utf8_str_word_count($stringToSearch, 1);
                $listOfWords = array_unique($listOfWords);
                //print_r($listOfWords);
                $post = new PostModel();
                $allPost = $post->getPostArray(NULL, 'all');
//$listPost = array();
                foreach ($allPost as $i => $pID) {
                    $postContentHTML = str_get_html(html_entity_decode($pID[key($pID)]["http://rdfs.org/sioc/ns#content"][0], ENT_COMPAT, 'UTF-8'));
                    $findTerm;
                    $creato = $pID[key($pID)]["http://purl.org/dc/terms/created"][0];
                    $myPeso = $this->pesoFullText($postContentHTML, $listOfWords, $findTerm, $creato);
                    if ($findTerm != 0) {
                        $this->listaPost[$findTerm][] = array(
                            "articolo" => $pID,
                            "peso" => $myPeso,
                        );
                    }
                }
                $mtime = microtime();
                $mtime = explode(" ", $mtime);
                $mtime = $mtime[1] + $mtime[0];
                $endtime = $mtime;
                $totaltime = ($endtime - $starttime);
                //print "Tempo trascorso $totaltime\n\r";
//                print_r($this->listaPost);
//                die();
//Eseguo richiesta esterna
                if ($extRequest === FALSE) {
                    $servers;
                    $this->initServers($servers);

                    $metodo = '/' . $tipo;
                    if (isset($this->params['var1']))
                        $metodo .= '/' . $this->params['var1'];

                    if ($this->rcvFromEXTServers($servers, $limite, $metodo)) {

                        $badServer = array();
                        foreach ($servers as $value) {
                            if ($value['code'] === 200)
                                $this->parseEXTContent2($value['data'], $listOfWords);
                            else if ($value['code'] === 500)
                                array_push($badServer, $value['name']);

//$test[] = $value['url'].' => '.$value['code']."\n";
                        }
//print_r($test);die();
//qui fanculizzo i server
                        /* if (count($badServer))
                          $this->funcoolizer($badServer);
                         */
                    } else
                        return 500;
                }
                //print "numero di elementi in listapost: " . count($this->listaPost) . "\n\r";
                $c = count($this->listaPost);
                //print "listaPost è fatto di: $c elementi";
                //print_r($this->listaPost);die();
                for ($i = $c; $i > 0; $i--) {
                    $arrayPesi = array();
                    foreach ($this->listaPost[$i] as $key => $post) {
                        //print ("\n\rla key è: $key e il peso è: " .$post['peso']);
                        $arrayPesi[$key] = $post['peso'];
                        //$arrayPost[$key]=$post['post'];
                    }
                    array_multisort($arrayPesi, SORT_DESC, $this->listaPost[$i]);
                }
                //TODO:far tornare array con solo n elementi
                $postToRender = array();
                $internalCount = 0;
                $i = count($this->listaPost);
                for ($i; $i > 0; $i--) {
                    foreach ($this->listaPost[$i] as $key => $post) {
                        if ($limite != "all" && $internalCount == $limite)
                            break;
                        $postToRender[] = $post;
                        $internalCount++;
                    }
                }
                $this->listaPost = $postToRender;
                $this->displayPosts();
//                ErrorController::notImpl();
                break;

            case $types[5]: //affinity
                if (!(isset($this->params['var1'])) ||
                        !(isset($this->params['var2'])) ||
                        !(isset($this->params['var3'])))
                //BAD REQUEST
                    return 400;
                ErrorController::notImpl();
//                break;
                $srv = urldecode($this->params['var1']);
                $usr = urldecode($this->params['var2']);
                $pid = urldecode($this->params['var3']);
                $content;
                $timeOfPost;
                $post = new PostModel();
                if ($srv == 'Spammers') {
                    $ID = 'spam:/' . implode('/', array($srv, $usr, $pid));
                    if (!$post->postExist($ID))
                        ErrorController::notFound('Questo post non esiste!!');
                    $art = $post->getPost($ID);
                    $content = html_entity_decode($art[key($art)]['http://rdfs.org/sioc/ns#content'][0], ENT_COMPAT, 'UTF-8');
                    $timeOfPost = $art[key($art)]["http://purl.org/dc/terms/created"][0];
                } else {
                    $url = $this->SRV->getUrl($srv);
                    //print "Il server è:$url\n\r";
                    $this->request->connect_to("$url/postserver/$usr/$pid")
                            ->accept(DooRestClient::HTML)
                            ->get();
                    if (!$this->request->isSuccess()) {
                        header("Status:" . $this->request->resultCode());
                        die("C'è stato un problema nella ricezione del post dall'esterno.");
                    }
                    $content = str_get_html($this->request->result());
                    $timeOfPost = $content->find('article', 0)->content;
                    $content = $content->find('article', 0)->innertext;
                }//l'articolo da affinare!
                //print ("$content\n\r");
                $html = str_get_html($content);
                $arr = array();
                foreach ($html->find("span[typeof=skos:Concept]") as $tag) {
                    $arr[$tag->about] = 0;
                }
                //print_r ($arr);
                //Peso i post del nostro server
                $allPost = $post->getPostArray(NULL, 'all');
//                print (key($art));
//                $key=array_search(key($art),$allPost[]);
//                print "La chiave è: $key\n\r";
//                unset($allPost[$key]);
//                print"tutti i post\n\r";
                //print_r($allPost);              
                $tempoPostConfronto = strtotime($timeOfPost);
                if (isset($art)) {
                    foreach ($allPost as $key => $myPost) {
                        //print key($myPost)." questo è mypost mentre art vale ".key($art)."\n\r";
                        if (key($myPost) == key($art)) {
                            //print "c'èèèè";
                            unset($allPost[$key]);
                            break;
                        }
                    }
                }
//                print_r($allPost);
//                die();
                foreach ($allPost as $i => $pID) {
                    //print "Il mio post $postContentHTML";die();
                    //print "questo è l'articolo:\n\r";
                    //print_r ($pID);
                    //print "\n\r";
                    foreach ($arr as $key => $peso) {
                        $pathTerm = explode('/', $key);
                        unset($pathTerm[0]);
//                        print "Stampo il pathterm come array:\n\r";
//                        print_r ($pathTerm);
//                        print "\n\r";
                        $arr[$key] = $this->calcWeight($pID, $pathTerm);
                        //print "Il peso per $key è: $arr[$key]\n\r";
                    }
//                    print "il peso totale per questo articolo è:" . array_sum($arr) . "\n\r";
                    $sumPeso = array_sum($arr);
                    //Se il peso è positivo allora considero l'articolo
                    if ($sumPeso > 0) {
                        $tempoPostConfrontato = strtotime($pID[key($pID)]["http://purl.org/dc/terms/created"][0]);
                        if ($tempoPostConfrontato >= $tempoPostConfronto)
                            $realPeso = ($sumPeso * 1000) / (($tempoPostConfrontato - $tempoPostConfronto) / 3600);
                        else
                            $realPeso= ( $sumPeso * 1000) / (($tempoPostConfronto - $tempoPostConfrontato) / 3600);
                        $numDislike = $pID[key($pID)]["http://vitali.web.cs.unibo.it/vocabulary/countDislike"][0];
                        $numLike = $pID[key($pID)]["http://vitali.web.cs.unibo.it/vocabulary/countLike"][0];
                        if ($numDislike > $numLike)
                            $realPeso = $realPeso / ($numDislike - $numLike);
                        else if ($numLike > $numDislike)
                            $realPeso = $realPeso * ($numLike - $numDislike);
                        $this->listaPost[] = array(
                            "articolo" => $pID,
                            "peso" => $realPeso,
                        );
                    }
                }
                print "Adesso parte la richiesta esterna\n\r";
                if ($extRequest === FALSE) {
                    $servers;
                    $this->initServers($servers);

                    $metodo = '/' . $tipo;
                    $metodo .= '/' . $this->params['var1'].'/'.$this->params['var2'].'/'.$this->params['var3'].'/1/1';
//                    print "$metodo\n\r";
                    if ($this->rcvFromEXTServers($servers, $limite, $metodo)) {

                        $badServer = array();
                        foreach ($servers as $value) {
                            if ($value['code'] === 200)
                                $this->parseEXTContent3($value['data'], $arr, $tempoPostConfronto);
                            else if ($value['code'] === 500)
                                array_push($badServer, $value['name']);
                            else print $value['code']."\n\r";
//$test[] = $value['url'].' => '.$value['code']."\n";
                        }
//print_r($test);die();
//qui fanculizzo i server
                        /* if (count($badServer))
                          $this->funcoolizer($badServer);
                         */
                    } else
                        return 500;
                }
                print "uscito dalla richiesta..muoio!\n\r";
                die();
                print "\n\rEcco gli articoli con rispettivi pesi(solo quelli il cui valore è positivo\n\r";
                print_r($this->listaPost);
                die();


            default: //beh, altrimenti errore
                ErrorController::notImpl();
                break;
        }
    }

    private function initServers(&$servers) {
        if (isset($_SESSION['user']['username'])) {
            $ext = TRUE;
            $user = new UserModel($_SESSION['user']['username']);
            $servers = $user->getServers();
        } else //qui la ricerca è interna, ma non ci sono utenti loggati
            $servers = $this->SRV->getDefaults();


        $a = array();
        foreach ($servers as $value) {
            if ($value != 'Spammers') {
                $k['name'] = $value;
                $k['url'] = $this->SRV->getUrl($value);
                $k['code'] = 0;
                $k['data'] = 0;
                array_push($a, $k);
            }
        }
        $servers = $a;
        return;
    }

    private function calcWeight($articolo, $term) {
        $arr = array();

        if (!is_string($articolo))
            $articolo = html_entity_decode($articolo[key($articolo)]['http://rdfs.org/sioc/ns#content'][0], ENT_QUOTES, 'utf-8');

        $html = str_get_html($articolo);
        foreach ($html->find("span[typeof=skos:Concept]") as $tag)
            $arr[$tag->about] = 0;

        foreach ($arr as $tag => $peso) {
            $termtmp = $term;
            $none = 0;
            $lenght = sizeof($termtmp);
            while ($none < $termtmp) {
                $term2search = '/' . implode('/', $termtmp);
//echo $term2search; echo $tag; die();
                if (stristr($tag, $term2search)) {
                    $avanzati = sizeof(explode('/', substr($tag, strlen($term2search)))) - 1;
                    $totali = sizeof(explode('/', $tag)) - 1;
                    $arr[$tag] = 1 - ($none / $lenght) - ($avanzati / $totali);
                    break;
                } else {
                    $none++;
                    array_pop($termtmp);
                }
            }
            if ($arr[$tag] == 0)
                $arr[$tag] -= $none;
        }
        arsort($arr, SORT_NUMERIC);
        return current($arr);
    }

    private function sortPost($limite) {
        if (/* !(isset($this->listaPost)) || */sizeof($this->listaPost) == 0)
            ErrorController::notFound("La ricerca non ha prodotto risultati.\n");
        if (!isset($this->toMerge))
            ErrorController::internalError();
        arsort($this->toMerge, SORT_NUMERIC);
        $toRender = array_slice($this->toMerge, 0, $limite, TRUE);
        $temp = array();
        foreach ($toRender as $k => $n)
            array_push($temp, $this->listaPost[$k]);

        $this->listaPost = $temp;
    }

    private function funcoolizer(&$badS) {
        if (!isset($_SESSION['user']['username']))
            return;
        $user = new UserModel($_SESSION['user']['username']);
        $listaServers = $user->getServers();
        $user->setServers(array_diff($listaServers, $badS));
    }

    private function displayPosts() {
        if (sizeof($this->listaPost) == 0)
            ErrorController::notFound("La ricerca non ha prodotto risultati.\n");
        if (isset($_SESSION['username']['user']))
            $XMLPosts = PostView::renderMultiplePost($this->listaPost, $_SESSION['username']['user']);
        $XMLPosts = PostView::renderMultiplePost($this->listaPost);
        $this->setContentType('xml');
        print $XMLPosts;
    }

    private function rcvFromEXTServer($server, $method) {
        $url = $this->SRV->getUrl($server);
        $this->request->connect_to($url . $method)
                ->accept(DooRestClient::XML)
                ->get();
        if ($this->request->isSuccess())
            return $this->request->result();
        else
            return $this->request->resultCode();
    }

    private function rcvFromEXTServers(&$servers, $limite, $metodo) {
        if (count($servers) <= 0)
            return false;

        $hArr = array(); //handle array

        foreach ($servers as $k => $server) {

            $url = $server['url'] . 'searchserver/' . $limite . $metodo;
            //print "il mio url è: $url\n\r";
            $h = curl_init();
            curl_setopt($h, CURLOPT_URL, $url);
            curl_setopt($h, CURLOPT_HEADER, 0);
            curl_setopt($h, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($h, CURLOPT_HTTPHEADER, array(
                "Content-Type: application/xml; charset=utf-8"
            ));
            curl_setopt($h, CURLOPT_TIMEOUT, 2);

            array_push($hArr, $h);
        }

        $mh = curl_multi_init();
        foreach ($hArr as $k => $h)
            curl_multi_add_handle($mh, $h);

        $running = null;
        do
            curl_multi_exec($mh, $running); while ($running > 0);

// get the result and save it in the result ARRAY
        foreach ($hArr as $k => $h) {
            $servers[$k]['data'] = curl_multi_getcontent($h);
            $servers[$k]['code'] = curl_getinfo($h, CURLINFO_HTTP_CODE);
        }
//close all the connections
        foreach ($hArr as $k => $h)
            curl_multi_remove_handle($mh, $h);

        curl_multi_close($mh);

        return true;
    }

    private function parseEXTContent($toParse, $pathTerm = NULL) {
        $html = str_get_html($toParse);
        foreach ($html->find('article') as $articolo) {
            $node['articolo'] = $articolo->outertext;
            $node['peso'] = strtotime($articolo->content);
            if ($pathTerm)
                $node['peso'] += $this->salt * $this->calcWeight($articolo->innertext, $pathTerm);
            array_push($this->listaPost, $node);
            array_push($this->toMerge, $node['peso']);
        }
    }

//Usata per la fulltext
    private function parseEXTContent2($toParse, $listOfWords) {
        //print ("L'xml che mi arriva:\n\r");
        //print_r($toParse);
        $html = str_get_html($toParse);
        foreach ($html->find('article') as $articolo) {
            $findTerm;
            $creato = $articolo->content;
            $myPeso = $this->pesoFullText($articolo, $listOfWords, $findTerm, $creato);
            if ($findTerm != 0) {
                $this->listaPost[$findTerm][] = array(
                    "articolo" => $articolo->outertext,
                    "peso" => $myPeso,
                );
            }
        }
    }

    //Usata per l'affinity
    private function parseEXTContent3($toParse, $arr, $tempoPostConfronto) {
        print ("L'xml che mi arriva:\n\r");
        print_r($toParse);
        $html = str_get_html($toParse);
        foreach ($html->find('article') as $articolo) {
            $tempoPostConfrontato = strtotime($articolo->content);
            $numDislike = $articolo->find('span[tweb:countDislike]',0)->content;
            $numLike = $articolo->find('span[tweb:countLike]',0)->content;
            print $numDislike;
            die();
        }
    }

    private function pesoAffinity($articolo, $arr, $tempoPostConfrontato, $tempoPostConfronto, $numDislike, $numLike) {
        foreach ($arr as $key => $peso) {
            $pathTerm = explode('/', $key);
            unset($pathTerm[0]);
//                        print "Stampo il pathterm come array:\n\r";
//                        print_r ($pathTerm);
//                        print "\n\r";
            $arr[$key] = $this->calcWeight($articolo, $pathTerm);
            //print "Il peso per $key è: $arr[$key]\n\r";
        }
//                    print "il peso totale per questo articolo è:" . array_sum($arr) . "\n\r";
        $sumPeso = array_sum($arr);
        //Se il peso è positivo allora considero l'articolo
        if ($sumPeso > 0) {
            //$tempoPostConfrontato = strtotime($pID[key($pID)]["http://purl.org/dc/terms/created"][0]);
            //$tempoPostConfronto = strtotime($timeOfPost);
            if ($tempoPostConfrontato >= $tempoPostConfronto)
                $realPeso = ($sumPeso * 1000) / (($tempoPostConfrontato - $tempoPostConfronto) / 3600);
            else
                $realPeso= ( $sumPeso * 1000) / (($tempoPostConfronto - $tempoPostConfrontato) / 3600);
//            $numDislike = $pID[key($pID)]["http://vitali.web.cs.unibo.it/vocabulary/countDislike"][0];
//            $numLike = $pID[key($pID)]["http://vitali.web.cs.unibo.it/vocabulary/countLike"][0];
            if ($numDislike > $numLike)
                $realPeso = $realPeso / ($numDislike - $numLike);
            else if ($numLike > $numDislike)
                $realPeso = $realPeso * ($numLike - $numDislike);
            $this->listaPost[] = array(
                "articolo" => $articolo,
                "peso" => $realPeso,
            );
        }
    }

    private

    function pesoFullText($articolo, $listOfWords, &$findTerm, $creato) {
        $content = $articolo->plaintext;
        $findTerm = 0;
        $matchEsatto = 0;
        $matchParziale = 0;
        $wordInContent = $this->utf8_str_word_count($content, 1);
        //print_r($wordInContent);
        foreach ($listOfWords as $indice => $word) {
            $find = false;
            if (strlen((string) $word) > 1) {
                if (stristr((string) $word, "'") !== false) {
                    $word = explode("'", (string) $word);
                    $word = $word[1];
                }
                //print "Sto cercando questo termine: $word\n\r";
                foreach ($wordInContent as $indice => $thisWord) {
                    if (stristr((string) $thisWord, "'") !== false) {
                        $thisWord = explode("'", (string) $thisWord);
                        $thisWord = $thisWord[1];
                    }
                    //print "Sto controllando questo termine: $thisWord\n\r";
                    if (strtolower((string) $thisWord) == strtolower((string) $word)) {
                        // print ("trovato il match di $word con $thisWord\n\r");
                        $matchEsatto++;
                        $find = true;
                        //print ("numero di matchEsatti: $matchEsatto\n\r");
                    } else if (stristr((string) $thisWord, (string) $word)) {
                        //print ("trovata l'occorrenza di $word in $thisWord\n\r");
                        $matchParziale++;
                        $find = true;
                        //print ("numero di matchParziali: $matchParziale\n\r");
                    }
                }
                if ($find) {
                    $findTerm++;
                }
            }
        }
        //print ("totale termini trovati: $findTerm\n\r");
        if ($findTerm != 0) {
//                    print ("$matchEsatto\n\r");
//                    print ("$matchParziale\n\r");
//                    print (time());
//                    print (strtotime($pID[key($pID)]["http://purl.org/dc/terms/created"][0]));

            $tempo = time() - strtotime($creato);
            //print ("Differenza di tempo è:$tempo\n\r");
            $peso = (((($matchEsatto + ($matchParziale * 0.5))) * 1000) / ($tempo / 3600)) * ($findTerm * $findTerm);
//                    print $peso;
//                    print "Termini trovati $findTerm";
            return $peso;
        }
    }

    private

    function rcvFromINTServer($usr, $countPost) {
        $post = new PostModel();
        $postIDs = $usr->getPosts($countPost);
        $posts = $post->getPostArray($postIDs);
        foreach ($posts as $post) {
            $nodo['articolo'] = $post;
            $nodo['peso'] = strtotime($post[key($post)]['http://purl.org/dc/terms/created'][0]);
            array_push($this->listaPost, $nodo);
            array_push($this->toMerge, $nodo['peso']);
        }
    }

    function utf8_str_word_count($string, $format = 0, $charlist = null) {
        $result = array();

        if (preg_match_all('~[\p{L}\p{Mn}\p{Pd}\'\x{2019}' . preg_quote($charlist, '~') . ']+~u', $string, $result) > 0) {
            if (array_key_exists(0, $result) === true) {
                $result = $result[0];
            }
        }

        if ($format == 0) {
            $result = count($result);
        }

        return $result;
    }

}

?>
