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
    private $time;
    private $respamOf = null;
    private $replyOf = null;
    private $listOfReply = array();

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
        $limite = $this->params['limit'];
        if ($limite != "all" && !is_numeric($limite))
            ErrorController::badReq("O numeri o 'all' altro non è consentito");
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
                        list($srv, $usr) = explode('/', $follow);
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

//$test[] = $value['url'].' => '.$value['data']."\n";
                        }
//print_r($test);die();
//qui fanculizzo i server
                        /* if (count($badServer))
                          $this->funcoolizer($badServer);
                         */
                    } else
                        return 500;
                }
//print_r($this->listaPost); die();
                $this->sortPost($limite);
                $this->displayPosts();
                break;

            case $types[4]: //fulltext
                if (!(isset($this->params['var1'])))
//BAD REQUEST
                    ErrorController::badReq("Devi specificare il testo da cercare!!");
                $stringToSearch = urldecode($this->params['var1']);
//Inizializzo il timer e inizio a cercare in locale
//                $mtime = microtime();
//                $mtime = explode(' ', $mtime);
//                $mtime = $mtime[1] + $mtime[0];
//                $starttime = $mtime;
                $listOfWords = $this->utf8_str_word_count($stringToSearch, 1);
                $listOfWords = array_unique($listOfWords);
                $this->fullTextCore($listOfWords, $extRequest, $limite);
                //print "numero di elementi in listapost: " . count($this->listaPost) . "\n\r";
                //$c = count($this->listaPost);
                //print "listaPost è fatto di: $c elementi";
                //print_r($this->listaPost);die();
                ////////////////// NEW //////////////////////////
//                ksort($this->listaPost, SORT_NUMERIC);
//                $this->listaPost = array_reverse($this->listaPost, TRUE);
//                $toRender = array();
//                foreach ($this->listaPost as $k => $array) {
//                    if ($limite == 0)
//                        break;
//                    $arrayPesi = array();
//                    foreach ($array as $key => $post)
//                        $arrayPesi[$key] = $post['peso'];
//                    array_multisort($arrayPesi, SORT_DESC, $this->listaPost[$k]);
//                    $n = count($array);
//                    if (is_numeric($limite) && $n > $limite) {
//                        $toRender = array_merge($toRender, array_slice($array, 0, $limite));
//                        break;
//                    }
//                    $toRender = array_merge($toRender, $array);
//                    $limite -= $n;
//                }
//                $this->listaPost = $toRender;
                ////////////////////////////////////////////////
                //print_r($this->listaPost);die();
//                for ($i = $c; $i > 0; $i--) {
//                    $arrayPesi = array();
//                    foreach ($this->listaPost[$i] as $key => $post) {
//                        //print ("\n\rla key è: $key e il peso è: " .$post['peso']);die();
//                        $arrayPesi[$key] = $post['peso'];
//                        //$arrayPost[$key]=$post['post'];
//                    }
//                    array_multisort($arrayPesi, SORT_DESC, $this->listaPost[$i]);
//                }
//                //TODO:far tornare array con solo n elementi
//                $postToRender = array();
//                $internalCount = 0;
//                $i = count($this->listaPost);
//                for ($i; $i > 0; $i--) {
//                    foreach ($this->listaPost[$i] as $key => $post) {
//                        if ($limite != "all" && $internalCount == $limite)
//                            break;
//                        $postToRender[] = $post;
//                        $internalCount++;
//                    }
//                }
//                $this->listaPost = $postToRender;
                $this->sortPost($limite);
                $this->displayPosts();
//                ErrorController::notImpl();
                break;

            case $types[5]: //affinity
                if ((!(isset($this->params['var1'])) && $this->params['var1'] != "") ||
                        (!(isset($this->params['var2'])) && $this->params['var2'] != "") ||
                        (!(isset($this->params['var3'])) && $this->params['var3'] != ""))
                //BAD REQUEST
                    ErrorController::badReq("Non tutti i parametri sono stati specificati");
//                break;
                $srv = urldecode($this->params['var1']);
                $usr = urldecode($this->params['var2']);
                $pid = urldecode($this->params['var3']);
                $content;
                $timeOfPost;
                $origLimite = $limite;
                $post = new PostModel();
                if ($srv == 'Spammers') {
                    $ID = 'spam:/' . implode('/', array($srv, $usr, $pid));
                    if (!$post->postExist($ID))
                        ErrorController::notFound('Questo post non esiste!!');
                    $art = $post->getPost($ID);
//                    print_r($art);
                    if (isset($art[key($art)]['http://vitali.web.cs.unibo.it/vocabulary/respamOf'])) {
                        $respamOf = explode('spam:', $art[key($art)]['http://vitali.web.cs.unibo.it/vocabulary/respamOf'][0]);
                        $this->respamOf = $respamOf[1];
                        $limite--;
                        //print $respamOf;
                    } else if (isset($art[key($art)]['http://rdfs.org/sioc/ns#reply_of'])) {
                        $replyOf = explode('spam:', $art[key($art)]['http://rdfs.org/sioc/ns#reply_of'][0]);
                        $this->replyOf = $replyOf[1];
                        $limite--;
                        //print $replyOf;
                    }
                    if (isset($art[key($art)]['http://rdfs.org/sioc/ns#has_reply'])) {
                        foreach ($art[key($art)]['http://rdfs.org/sioc/ns#has_reply'] as $key => $replyPost) {
                            $replyPost = explode("spam:", $replyPost);
                            $this->listOfReply[] = $replyPost[1];
                            $limite--;
                        }
                    }
                    $content = html_entity_decode($art[key($art)]['http://rdfs.org/sioc/ns#content'][0], ENT_COMPAT, 'UTF-8');
                    $timeOfPost = $art[key($art)]["http://purl.org/dc/terms/created"][0];
                } else {
                    $url = $this->SRV->getUrl($srv);
                    if ($url) {
                        //print "La richiesta è:".$url."postserver/$usr/$pid\n\r";
                        $this->request->connect_to($url . "postserver/$usr/$pid")
                                ->accept(DooRestClient::HTML)
                                ->get();
                        if (!$this->request->isSuccess()) {
                            header("Status:" . $this->request->resultCode());
                            die("C'è stato un problema nella ricezione del post dall'esterno.");
                        }
                        $content = str_get_html($this->request->result());
                        $timeOfPost = $content->find('article', 0)->content;
                        $content = $content->find('article', 0)->innertext;
                        $tempContent = str_get_html($content);
                        if (isset($tempContent->find("span[rel=tweb:respamOf]", 0)->resource)) {
                            $respamOf = $tempContent->find("span[rel=tweb:respamOf]", 0)->resource;
                            $limite--;
                        } else if (isset($tempContent->find("span[rel=sioc:reply_of]", 0)->resource)) {
                            $replyOf = $tempContent->find("span[rel=sioc:reply_of]", 0)->resource;
                            $limite--;
                        }
                        foreach ($tempContent->find("span[rel=sioc:has_reply]") as $reply) {
                            $listOfReply[] = $reply->resource;
                            $limite--;
                        }
                    }else
                        ErrorController::notFound("il server non esiste");
                }////l'articolo da affinare!
//                print ("$content\n\r");
                $html = str_get_html(html_entity_decode($content));
                $arr = array();
                foreach ($html->find("span[typeof=skos:Concept]") as $tag) {
                    $arr[$tag->about] = 0;
                }
//                print "Gli hashtag contenuti nell'articolo";
//                print_r($arr);
//                die();
//               //Se non ci sono hashtag faccio partire una fulltext
                //TODO: Implementare ricerca fulltext in caso di nessun #hashtag
                if (count($arr) == 0) {
                    $stringToSearch = urlencode($html->plaintext);
                    $listOfWords = $this->utf8_str_word_count($stringToSearch, 1);
                    $listOfWords = array_unique($listOfWords);
                    $this->fullTextCore($listOfWords, TRUE, $origLimite);
//                    print_r ($this->listaPost);die();
//                    ksort($this->listaPost, SORT_NUMERIC);
//                    $this->listaPost = array_reverse($this->listaPost, TRUE);
                    //print_r ($this->listaPost);
                    //ELIMINO IL POST DI ORIGINE PER EVITARE CLONI
                    $toCheck = implode('/', array($srv, $usr, $pid));
                    foreach ($this->listaPost as $key => $art) {
                        if (is_array($art['articolo'])) {
                            if (key($art['articolo']) == "spam:/$toCheck") {
                                unset($this->listaPost[$key]);
                                unset($this->toMerge[$key]);
                                array_values($this->listaPost);
                                array_values($this->toMerge);
                            }
                        } else {
                            if (strstr("about=\"/$toCheck\"", $art['articolo'])) {
                                unset($this->listaPost[$key]);
                                unset($this->toMerge[$key]);
                                array_values($this->listaPost);
                                array_values($this->toMerge);
                            }
                        }
                    }
                    $this->processReleatedPostsFullText($listOfWords);
                    $this->sortPost($origLimite);
                    $this->displayPosts();
//                ErrorController::notImpl();
                    break;
                }
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
                    $tempoPostConfrontato = strtotime($pID[key($pID)]["http://purl.org/dc/terms/created"][0]);
                    $numDislike = $pID[key($pID)]["http://vitali.web.cs.unibo.it/vocabulary/countDislike"][0];
                    $numLike = $pID[key($pID)]["http://vitali.web.cs.unibo.it/vocabulary/countLike"][0];
                    $this->pesoAffinity($pID, $arr, $tempoPostConfrontato, $tempoPostConfronto, $numDislike, $numLike);
                }
//                print "Adesso parte la richiesta esterna\n\r";
                if ($extRequest === FALSE) {
                    $servers;
                    $this->initServers($servers);

                    $metodo = '/' . $tipo;
                    $metodo .= '/' . $this->params['var1'] . '/' . $this->params['var2'] . '/' . $this->params['var3'] . '/1/1';
//                    print "$metodo\n\r";
                    if ($this->rcvFromEXTServers($servers, $limite, $metodo)) {

                        $badServer = array();
                        foreach ($servers as $value) {
                            if ($value['code'] === 200)
                                $this->parseEXTContent3($value['data'], $arr, $tempoPostConfronto);
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
                // print "\n\rEcco gli articoli con rispettivi pesi(solo quelli il cui valore è positivo\n\r";
                $this->processReleatedPostsAffinity($arr, $tempoPostConfronto);
//                print "\n\rEcco la lista degli articoli\n\r";
//                print_r($this->listaPost);
//                die();
                $this->sortPost($origLimite);
                $this->displayPosts();
                break;


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
        //anche qui ho aggiunto sto controllo per le related dall'esterno
        if (sizeof($arr)) {
            arsort($arr, SORT_NUMERIC);
            return current($arr);
        } else
            return -1; //qui, purtroppo, gestisco se qualcuno mi manda un post senza tag (i.e. da non credere!)
    }

    private function sortPost($limite) {
        if (/* !(isset($this->listaPost)) || */sizeof($this->listaPost) == 0)
            ErrorController::notFound("La ricerca non ha prodotto risultati.\n");
        if (!isset($this->toMerge))
            ErrorController::internalError();
        arsort($this->toMerge, SORT_DESC);
        if ($limite != "all")
            $toRender = array_slice($this->toMerge, 0, $limite, TRUE);
        else
            $toRender = $this->toMerge;
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
        if ($url) {
            $this->request->connect_to($url . $method)
                    ->accept(DooRestClient::XML)
                    ->get();
            if ($this->request->isSuccess())
                return $this->request->result();
            else
                return $this->request->resultCode();
        }
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
            curl_setopt($h, CURLOPT_TIMEOUT, 5);

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
//        print ("\n\rL'xml che mi arriva:\n\r");
//        print_r($toParse);
        if (!($this->validateXML($toParse)))
            return;
//        print "\r\nValidato";
        $html = str_get_html($toParse);
        foreach ($html->find('article') as $articolo) {
            $node['articolo'] = $articolo->outertext;
            $node['peso'] = strtotime($articolo->content);
            if ($pathTerm) {
                $weight = $this->calcWeight($articolo->innertext, $pathTerm);
                //faccio sto controllo caso mai il post di cui ho calcolato il peso non c'entra nulla
                if ($weight < 0)
                    continue;
                $node['peso'] += $this->salt * $weight;
            }
            array_push($this->listaPost, $node);
            array_push($this->toMerge, $node['peso']);
        }
    }

//Usata per la fulltext
    private function parseEXTContent2($toParse, $listOfWords) {
//        print ("\n\rL'xml che mi arriva:\n\r");
//        print_r($toParse);
        if (!($this->validateXML($toParse)))
            return;
//        print "\r\nValidato";
        $html = str_get_html($toParse);
        foreach ($html->find('article') as $articolo) {
            $findTerm;
            $creato = $articolo->content;
            $myPeso = $this->pesoFullText($articolo, $listOfWords, $findTerm, $creato);
            if ($findTerm != 0) {
                $this->listaPost[] = array(
                    "articolo" => $articolo->outertext,
                    "peso" => $myPeso,
                );
                $this->toMerge[] = array(
                    "peso" => $myPeso,
                );
            }
        }
    }

    //Usata per l'affinity
    private function parseEXTContent3($toParse, $arr, $tempoPostConfronto) {
//        print ("\n\rL'xml che mi arriva:\n\r");
//        print_r($toParse);
        if (!($this->validateXML($toParse)))
            return;
//        print "\r\nValidato";
        $html = str_get_html($toParse);
        foreach ($html->find('article') as $articolo) {
//            print "L'articolo é:\n\r" . $articolo->outertext . "\n\r";
//            print "blabla bla";
            $tempoPostConfrontato = strtotime($articolo->content);
//            print "Tempo dell'articolo che ricevo: $tempoPostConfrontato\n\r";
//            print "Tempo articolo: $tempoPostConfronto\n\r";
            $numDislike = $articolo->find('span[property=tweb:countDislike]', 0)->content;
            $numLike = $articolo->find('span[property=tweb:countLike]', 0)->content;
            $this->pesoAffinity($articolo->outertext, $arr, $tempoPostConfrontato, $tempoPostConfronto, $numDislike, $numLike);
        }
    }

    private function pesoAffinity($articolo, $arr, $tempoPostConfrontato, $tempoPostConfronto, $numDislike, $numLike, $bonus= 0, $toCheck=null) {
//        print "\n\rL'articolo che considero:\n\r";
//        print_r($articolo);
//        print "\n\r";
        foreach ($arr as $key => $peso) {
            $pathTerm = explode('/', $key);
            unset($pathTerm[0]);
//            print "Stampo il pathterm come array:\n\r";
//            print_r($pathTerm);
//            print "\n\r";
            $arr[$key] = $this->calcWeight($articolo, $pathTerm);
//            print "Il peso per $key è: $arr[$key]\n\r";
        }
//        print "il peso totale per questo articolo è:" . array_sum($arr) . "\n\r";
        $sumPeso = array_sum($arr) + $bonus;
        //Se il peso è positivo allora considero l'articolo
        if ($sumPeso > 0 && $tempoPostConfrontato != $tempoPostConfronto) {
            //$tempoPostConfrontato = strtotime($pID[key($pID)]["http://purl.org/dc/terms/created"][0]);
            //$tempoPostConfronto = strtotime($timeOfPost);
            if ($tempoPostConfrontato > $tempoPostConfronto)
                $realPeso = ($sumPeso * 1000) / (($tempoPostConfrontato - $tempoPostConfronto) / 3600);
            else
                $realPeso = ( $sumPeso * 1000) / (($tempoPostConfronto - $tempoPostConfrontato) / 3600);
//            $numDislike = $pID[key($pID)]["http://vitali.web.cs.unibo.it/vocabulary/countDislike"][0];
//            $numLike = $pID[key($pID)]["http://vitali.web.cs.unibo.it/vocabulary/countLike"][0];
            if ($numDislike > $numLike)
                $realPeso = $realPeso / ($numDislike - $numLike);
            else if ($numLike > $numDislike)
                $realPeso = $realPeso * ($numLike - $numDislike);
            if ($toCheck == null) {
                $this->listaPost[] = array(
                    "articolo" => $articolo,
                    "peso" => round($realPeso, 5),
                );
                $this->toMerge[] = array(
                    "peso" => round($realPeso, 5),
                );
            } else {
                foreach ($this->listaPost as $key => $art) {
//                    print "Stampo per capire che succede\n\r";
//                    print_r ($art['articolo']);die();
                    if (is_array($art['articolo'])) {
//                        print "\n\rSono un array\n\r";
//                        print "la key è". key($art['articolo'])."\n\r";
//                        print "L'articolo è $toCheck\n\r";
                        if (key($art['articolo']) == "spam:$toCheck") {
//                            print "siamo uguali ovviamente e il mio peso è:" .round($realPeso, 5);
//                            print "\n\rMentre il peso attuale è ". $art['peso'];
                            $this->listaPost[$key]['peso'] = round($realPeso, 5);
                            $this->toMerge[$key]['peso'] = round($realPeso, 5);
                            return;
                        }
                    } else {
                        if (strstr("about=\"$toCheck\"", $art['articolo'])) {
                            $this->listaPost[$key]['peso'] = round($realPeso, 5);
                            $this->toMerge[$key]['peso'] = round($realPeso, 5);
                            return;
                        }
                    }
                }
                $this->listaPost[] = array(
                    "articolo" => $articolo,
                    "peso" => round($realPeso, 5),
                );
                $this->toMerge[] = array(
                    "peso" => round($realPeso, 5),
                );
            }
        }
    }

    private function pesoFullText($articolo, $listOfWords, &$findTerm, $creato) {
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
                    if ($thisWord == $word) {
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
                if ($find)
                    $findTerm++;
            }
        }
        //print ("totale termini trovati: $findTerm\n\r");
        if ($findTerm != 0) {
//                    print ("$matchEsatto\n\r");
//                    print ("$matchParziale\n\r");
//                    print (time());
//                    print (strtotime($pID[key($pID)]["http://purl.org/dc/terms/created"][0]));

            $tempo = $this->time - (strtotime($creato) - 7200);
            //print ("Differenza di tempo è:$tempo\n\r");
            //$peso = ((($matchEsatto + ($matchParziale * 0.5)) * 3600000) * ($findTerm * $findTerm)) / $tempo;
            $peso = ((($matchEsatto + ($matchParziale * 0.5)) * 3600000) / $tempo) * ($findTerm * $findTerm);
//                    print $peso;
//                    print "Termini trovati $findTerm";
            return round($peso, 5);
        }
    }

    private function rcvFromINTServer($usr, $countPost) {
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
            if (array_key_exists(0, $result) === true)
                $result = $result[0];
        }

        if ($format == 0) {
            $result = count($result);
        }

        if (is_array($result)) {
            foreach ($result as $k => $v) {
                $result[$k] = strtolower((string) $v);
                $temp = stristr((string) $v, "'");
                if ($temp != false)
                    $result[$k] = $temp;
            }
        }

        return $result;
    }

    private function validateXML($toParse) {
        if ($toParse == "")
            return false;
        libxml_use_internal_errors(true);
        $xdoc = new DomDocument;
        $xmlschema = 'data/archive.xsd';
        $xdoc->loadXML($toParse);
        if ($xdoc->schemaValidate($xmlschema)) {
            return true;
        }
        /* GESTIONE ERRORI SULLA VALIDAZIONE
         * Decommentare in caso di debug
         */
//        $errors = libxml_get_errors();
//        if (empty($errors)) {
//            return true;
//        }
//        print "lista errori\n\r";
//        print_r ($errors);
//        print "\n\r";
//        $error = $errors[0];
//
////        $lines = explode("\r", $toParse);
////        $line = $lines[($error->line) - 1];
//
//        print "\n\r" . $error->message . ' at line ' . $error->line . ':<br />'. "\n\r";
        return false;
    }

    private function processReleatedPostsAffinity($arr, $tempoPostConfronto) {
        if ($this->respamOf != null) {
            $tempArray = explode('/', $this->respamOf);
            $srv = $tempArray[1];
            $usr = $tempArray[2];
            $pid = $tempArray[3];
            if ($srv != "Spammers") {
                $url = $this->SRV->getUrl($srv);
                if ($url) {
                    //print "La richiesta è:".$url."postserver/$usr/$pid\n\r";
                    $this->request->connect_to($url . "postserver/$usr/$pid")
                            ->accept(DooRestClient::HTML)
                            ->get();
                    if ($this->request->isSuccess()) {
                        $articolo = str_get_html($this->request->result());
                        $tempoPostConfrontato = strtotime($articolo->content);
//            print "Tempo dell'articolo che ricevo: $tempoPostConfrontato\n\r";
//            print "Tempo articolo: $tempoPostConfronto\n\r";
                        $numDislike = $articolo->find('span[property=tweb:countDislike]', 0)->content;
                        $numLike = $articolo->find('span[property=tweb:countLike]', 0)->content;
                        $this->pesoAffinity($articolo->outertext, $arr, $tempoPostConfrontato, $tempoPostConfronto, $numDislike, $numLike, 5, $this->respamOf);
                    }
                }
            } else {
                $post = new PostModel();
                $pID = 'spam:/' . implode('/', array($srv, $usr, $pid));
                if ($post->postExist($pID)) {
                    $art = $post->getPost($pID);
                    $tempoPostConfrontato = strtotime($art[key($art)]["http://purl.org/dc/terms/created"][0]);
                    $numDislike = $art[key($art)]["http://vitali.web.cs.unibo.it/vocabulary/countDislike"][0];
                    $numLike = $art[key($art)]["http://vitali.web.cs.unibo.it/vocabulary/countLike"][0];
                    $this->pesoAffinity($art, $arr, $tempoPostConfrontato, $tempoPostConfronto, $numDislike, $numLike, 5, $this->respamOf);
                }
            }
        } else if ($this->replyOf != null) {
            $tempArray = explode('/', $this->replyOf);
            $srv = $tempArray[1];
            $usr = $tempArray[2];
            $pid = $tempArray[3];
            if ($srv != "Spammers") {
                $url = $this->SRV->getUrl($srv);
                if ($url) {
                    //print "La richiesta è:".$url."postserver/$usr/$pid\n\r";
                    $this->request->connect_to($url . "postserver/$usr/$pid")
                            ->accept(DooRestClient::HTML)
                            ->get();
                    if ($this->request->isSuccess()) {
                        $articolo = str_get_html($this->request->result());
                        $tempoPostConfrontato = strtotime($articolo->content);
//            print "Tempo dell'articolo che ricevo: $tempoPostConfrontato\n\r";
//            print "Tempo articolo: $tempoPostConfronto\n\r";
                        $numDislike = $articolo->find('span[property=tweb:countDislike]', 0)->content;
                        $numLike = $articolo->find('span[property=tweb:countLike]', 0)->content;
                        $this->pesoAffinity($articolo->outertext, $arr, $tempoPostConfrontato, $tempoPostConfronto, $numDislike, $numLike, 5, $this->replyOf);
                    }
                }
            } else {
                $post = new PostModel();
                $pID = 'spam:/' . implode('/', array($srv, $usr, $pid));
                if ($post->postExist($pID)) {
                    $art = $post->getPost($pID);
                    $tempoPostConfrontato = strtotime($art[key($art)]["http://purl.org/dc/terms/created"][0]);
                    $numDislike = $art[key($art)]["http://vitali.web.cs.unibo.it/vocabulary/countDislike"][0];
                    $numLike = $art[key($art)]["http://vitali.web.cs.unibo.it/vocabulary/countLike"][0];
                    $this->pesoAffinity($art, $arr, $tempoPostConfrontato, $tempoPostConfronto, $numDislike, $numLike, 5, $this->replyOf);
                }
            }
        }
        if (sizeof($this->listOfReply) > 0) {
            foreach ($this->listOfReply as $artReply) {
                $tempArray = explode('/', $artReply);
                $srv = $tempArray[1];
                $usr = $tempArray[2];
                $pid = $tempArray[3];
                if ($srv != "Spammers") {
                    $url = $this->SRV->getUrl($srv);
                    if ($url) {
                        //print "La richiesta è:".$url."postserver/$usr/$pid\n\r";
                        $this->request->connect_to($url . "postserver/$usr/$pid")
                                ->accept(DooRestClient::HTML)
                                ->get();
                        if ($this->request->isSuccess()) {
                            $articolo = str_get_html($this->request->result());
                            $tempoPostConfrontato = strtotime($articolo->content);
//            print "Tempo dell'articolo che ricevo: $tempoPostConfrontato\n\r";
//            print "Tempo articolo: $tempoPostConfronto\n\r";
                            $numDislike = $articolo->find('span[property=tweb:countDislike]', 0)->content;
                            $numLike = $articolo->find('span[property=tweb:countLike]', 0)->content;
                            $this->pesoAffinity($articolo->outertext, $arr, $tempoPostConfrontato, $tempoPostConfronto, $numDislike, $numLike, 2, $artReply);
                        }
                    }
                } else {
                    $post = new PostModel();
                    $pID = 'spam:/' . implode('/', array($srv, $usr, $pid));
                    if ($post->postExist($pID)) {
                        $art = $post->getPost($pID);
                        $tempoPostConfrontato = strtotime($art[key($art)]["http://purl.org/dc/terms/created"][0]);
                        $numDislike = $art[key($art)]["http://vitali.web.cs.unibo.it/vocabulary/countDislike"][0];
                        $numLike = $art[key($art)]["http://vitali.web.cs.unibo.it/vocabulary/countLike"][0];
                        $this->pesoAffinity($art, $arr, $tempoPostConfrontato, $tempoPostConfronto, $numDislike, $numLike, 2, $artReply);
                    }
                }
            }
        }
    }

    private function processReleatedPostsFullText($listOfWords) {
        if ($this->replyOf != null) {
            $tempArray = explode('/', $this->replyOf);
            $srv = $tempArray[1];
            $usr = $tempArray[2];
            $pid = $tempArray[3];
            if ($srv != "Spammers") {
                $url = $this->SRV->getUrl($srv);
                if ($url) {
                    //print "La richiesta è:".$url."postserver/$usr/$pid\n\r";
                    $this->request->connect_to($url . "postserver/$usr/$pid")
                            ->accept(DooRestClient::HTML)
                            ->get();
                    if ($this->request->isSuccess()) {
                        $articolo = str_get_html($this->request->result());
                        $creato = strtotime($articolo->content);
                        $findTerm;
                        $myPeso = $this->pesoFullText($articolo->outertext, $listOfWords, $findTerm, $creato) + 100;
                        $update = false;
                        foreach ($this->listaPost as $key => $art) {
                            if (is_array($art['articolo'])) {
//                        print "\n\rSono un array\n\r";
//                        print "la key è". key($art['articolo'])."\n\r";
//                        print "L'articolo è $toCheck\n\r";
                                if (key($art['articolo']) == "spam:$this->replyOf") {
//                            print "siamo uguali ovviamente e il mio peso è:" .round($realPeso, 5);
//                            print "\n\rMentre il peso attuale è ". $art['peso'];
                                    $this->listaPost[$key]['peso'] = $myPeso;
                                    $this->toMerge[$key]['peso'] = $myPeso;
                                    $update = true;
                                }
                            } else {
                                if (strstr("about=\"$this->replyOf\"", $art['articolo'])) {
                                    $this->listaPost[$key]['peso'] = $myPeso;
                                    $this->toMerge[$key]['peso'] = $myPeso;
                                    $update = true;
                                }
                            }
                        }
                        if (!$update) {
                            $this->listaPost[] = array(
                                "articolo" => $articolo->outertext,
                                "peso" => $myPeso,
                            );
                            $this->toMerge[] = array(
                                "peso" => $myPeso,
                            );
                        }
                    }
                }
            } else {
                $post = new PostModel();
                $pID = 'spam:/' . implode('/', array($srv, $usr, $pid));
                if ($post->postExist($pID)) {
                    $art = $post->getPost($pID);
                    $postContentHTML = str_get_html(html_entity_decode($art[key($art)]["http://rdfs.org/sioc/ns#content"][0], ENT_COMPAT, 'UTF-8'));
                    $findTerm;
                    $creato = $art[key($art)]["http://purl.org/dc/terms/created"][0];
                    $myPeso = $this->pesoFullText($postContentHTML, $listOfWords, $findTerm, $creato) + 100;
                    $update = false;
                    foreach ($this->listaPost as $key => $art) {
                        if (is_array($art['articolo'])) {
//                        print "\n\rSono un array\n\r";
//                        print "la key è". key($art['articolo'])."\n\r";
//                        print "L'articolo è $toCheck\n\r";
                            if (key($art['articolo']) == "spam:$this->replyOf") {
//                            print "siamo uguali ovviamente e il mio peso è:" .round($realPeso, 5);
//                            print "\n\rMentre il peso attuale è ". $art['peso'];
                                $this->listaPost[$key]['peso'] = $myPeso;
                                $this->toMerge[$key]['peso'] = $myPeso;
                                $update = true;
                            }
                        } else {
                            if (strstr("about=\"$this->replyOf\"", $art['articolo'])) {
                                $this->listaPost[$key]['peso'] = $myPeso;
                                $this->toMerge[$key]['peso'] = $myPeso;
                                $update = true;
                            }
                        }
                    }
                    if (!$update) {
                        $this->listaPost[] = array(
                            "articolo" => $art,
                            "peso" => $myPeso,
                        );
                        $this->toMerge[] = array(
                            "peso" => $myPeso,
                        );
                    }
                }
            }
        }
        if (sizeof($this->listOfReply) > 0) {
            foreach ($this->listOfReply as $artReply) {
                $tempArray = explode('/', $artReply);
                $srv = $tempArray[1];
                $usr = $tempArray[2];
                $pid = $tempArray[3];
                if ($srv != "Spammers") {
                    $url = $this->SRV->getUrl($srv);
                    if ($url) {
                        //print "La richiesta è:".$url."postserver/$usr/$pid\n\r";
                        $this->request->connect_to($url . "postserver/$usr/$pid")
                                ->accept(DooRestClient::HTML)
                                ->get();
                        if ($this->request->isSuccess()) {
                            $articolo = str_get_html($this->request->result());
                            $creato = strtotime($articolo->content);
                            $findTerm;
                            $myPeso = $this->pesoFullText($articolo->outertext, $listOfWords, $findTerm, $creato) + 50;
                            $update = false;
                            foreach ($this->listaPost as $key => $art) {
                                if (is_array($art['articolo'])) {
//                        print "\n\rSono un array\n\r";
//                        print "la key è". key($art['articolo'])."\n\r";
//                        print "L'articolo è $toCheck\n\r";
                                    if (key($art['articolo']) == "spam:$this->replyOf") {
//                            print "siamo uguali ovviamente e il mio peso è:" .round($realPeso, 5);
//                            print "\n\rMentre il peso attuale è ". $art['peso'];
                                        $this->listaPost[$key]['peso'] = $myPeso;
                                        $this->toMerge[$key]['peso'] = $myPeso;
                                        $update = true;
                                    }
                                } else {
                                    if (strstr("about=\"$this->replyOf\"", $art['articolo'])) {
                                        $this->listaPost[$key]['peso'] = $myPeso;
                                        $this->toMerge[$key]['peso'] = $myPeso;
                                        $update = true;
                                    }
                                }
                            }
                            if (!$update) {
                                $this->listaPost[] = array(
                                    "articolo" => $articolo->outertext,
                                    "peso" => $myPeso,
                                );
                                $this->toMerge[] = array(
                                    "peso" => $myPeso,
                                );
                            }
                        }
                    }
                } else {
                    $post = new PostModel();
                    $pID = 'spam:/' . implode('/', array($srv, $usr, $pid));
                    if ($post->postExist($pID)) {
                        $art = $post->getPost($pID);
                        $postContentHTML = str_get_html(html_entity_decode($art[key($art)]["http://rdfs.org/sioc/ns#content"][0], ENT_COMPAT, 'UTF-8'));
                        $findTerm;
                        $creato = $art[key($art)]["http://purl.org/dc/terms/created"][0];
                        $myPeso = $this->pesoFullText($postContentHTML, $listOfWords, $findTerm, $creato) + 50;
                        $update = false;
                        foreach ($this->listaPost as $key => $art) {
                            if (is_array($art['articolo'])) {
//                        print "\n\rSono un array\n\r";
//                        print "la key è". key($art['articolo'])."\n\r";
//                        print "L'articolo è $toCheck\n\r";
                                if (key($art['articolo']) == "spam:$this->replyOf") {
//                            print "siamo uguali ovviamente e il mio peso è:" .round($realPeso, 5);
//                            print "\n\rMentre il peso attuale è ". $art['peso'];
                                    $this->listaPost[$key]['peso'] = $myPeso;
                                    $this->toMerge[$key]['peso'] = $myPeso;
                                    $update = true;
                                }
                            } else {
                                if (strstr("about=\"$this->replyOf\"", $art['articolo'])) {
                                    $this->listaPost[$key]['peso'] = $myPeso;
                                    $this->toMerge[$key]['peso'] = $myPeso;
                                    $update = true;
                                }
                            }
                        }
                        if (!$update) {
                            $this->listaPost[] = array(
                                "articolo" => $art,
                                "peso" => $myPeso,
                            );
                            $this->toMerge[] = array(
                                "peso" => $myPeso,
                            );
                        }
                    }
                }
            }
        }
    }

    private function fullTextCore($listOfWords, $extRequest, $limite) {
        $vocab = explode(" ", utf8_decode(file_get_contents("data/vocabolario.dat")));
        //print_r($vocab); die();
        foreach ($listOfWords as $k => $v) {
            if (in_array(utf8_decode($v), $vocab))
                unset($listOfWords[$k]);
        }
//        print_r($listOfWords); //die();
        $post = new PostModel();
        $allPost = $post->getPostArray(NULL, 'all');
//$listPost = array();
        $this->time = time();
        foreach ($allPost as $i => $pID) {
            $postContentHTML = str_get_html(html_entity_decode($pID[key($pID)]["http://rdfs.org/sioc/ns#content"][0], ENT_COMPAT, 'UTF-8'));
            $findTerm;
            $creato = $pID[key($pID)]["http://purl.org/dc/terms/created"][0];
            $myPeso = $this->pesoFullText($postContentHTML, $listOfWords, $findTerm, $creato);
            if ($findTerm != 0) {
                $this->listaPost[] = array(
                    "articolo" => $pID,
                    "peso" => $myPeso,
                );
                $this->toMerge[] = array(
                    "peso" => $myPeso,
                );
            }
        }
//                $mtime = microtime();
//                $mtime = explode(" ", $mtime);
//                $mtime = $mtime[1] + $mtime[0];
//                $endtime = $mtime;
//                $totaltime = ($endtime - $starttime);
        //print "Tempo trascorso $totaltime\n\r";
        //print_r($this->listaPost);
        //die();
//Eseguo richiesta esterna
        if ($extRequest === FALSE) {
            $servers;
            $this->initServers($servers);

            $metodo = '/fulltext';
            if (isset($this->params['var1']))
                $metodo .= '/' . $this->params['var1'];

            if ($this->rcvFromEXTServers($servers, $limite, $metodo)) {

                $badServer = array();
                foreach ($servers as $value) {
                    if ($value['code'] === 200)
                        $this->parseEXTContent2($value['data'], $listOfWords);
                    else if ($value['code'] === 500)
                        array_push($badServer, $value['name']);

//$test[] = $value['url'].' => '.$value['data']."\n";
                }
//print_r($test);die();
//qui fanculizzo i server
                /* if (count($badServer))
                  $this->funcoolizer($badServer);
                 */
            } else
                return 500;
        }
    }

}

?>
