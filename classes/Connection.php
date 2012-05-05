<?php

Class Connection {
	private $cnn = NULL;

	private static $server = "localhost";
	private static $username = "root";
	private static $password = "";

	private static $DataBase = "tigoform";

// 	private static $server = "localhost";
// 	private static $username = "yessui_tigoform1";
// 	private static $password = "lasmachas";

// 	private static $DataBase = "yessui_tigoform";

//--------------------------------------------------

	private static $instance;
	private static $objCount;

	Public static function getConnection(){

		$obj = self::singleton();

		if($obj->cnn){
			return $obj->cnn;
		}else{

// 			$obj->cnn = mysql_connect( self::$server, self::$username, self::$password);
// 			return $obj->cnn;

			$obj->cnn = new mysqli($this->host, $this->username, $this->password, $this->DB);
			return $obj->cnn;
		}


	}

	Public static function getDB(){
		return self::$DataBase;
	}


    // SINGLETON --------------------------------------
	public static function singleton(){
		if(!isset(self::$instance )){
			$c = __CLASS__;
			self::$instance = new $c();
		}

		self::$objCount++;

		return self::$instance;
	}

}

?>

