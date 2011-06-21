<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of FollowView
 *
 * @author clem
 */
class FollowView {

    public static function renderFollows($follows){
        $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><followers></followers>');
        foreach ($follows as $follow) {
            $folletto = $xml->addChild('follower');
            $thisServer->addAttribute('id', $follow);
        }
        return $xml->asXML();
    }
}

?>
