<?php

Class Communicator {
	
    Private $_Message = "";
    Private $_Value = 0;
    
//    function __get($prop_name, &$prop_value){
//    	
//    	return $this->
//    	
//        if (isset($this->elem[$prop_name])) {
//            $prop_value = $this->elem[$prop_name];
//            return true;
//        } else {
//            return false;
//        }
//    }
//
//    // Callback method for setting a property
//    function __set($prop_name, $prop_value){
//    	$prop_name = "set".$prop_name;
//        $this->$prop_name = $prop_value;
//        return true;
//    }
    

    Public function getMessage(){
		Return $this->_Message;
    }

    Public function setMessage($value){
		$this->_Message = $value;
    }

    Public function getValue(){
    	return $this->_Value;
    }
    
    Public function setValue($value){
    	$this->_Value = $value;
    }
    
}