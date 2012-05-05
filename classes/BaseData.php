<?php
Class BaseData {
	
	function __set($data,$value){
		$data = ucwords(strtolower($data));

		$fn_name = 'set' . $data;
        if(method_exists($this, $fn_name)){
            $this->$fn_name($value);
        }
	}
	
	public function __get($name){
		$name = ucwords(strtolower($name));
        $fn_name = 'get' . $name;
        if (method_exists($this, $fn_name)){
            return $this->$fn_name();
        }else{
            return null;
        }
    }
	
//	public $apellido = "";
//	private $nombre = "";
//	
//	function setNombre($nombre){
//		$this->nombre = "lala ".$nombre;
//	}
//	function getNombre(){
//		return $this->nombre;
//	}
	
	public function find($id){
		return $this->fill_object_by_id($id);
	}
	
	public function fill_fields($result){
		$rs = $result[0];
		foreach($rs as $key => $value){
			$this->$key = $value;
		}
	}
	
	public function printFields(){
		$fields = $this->getFields();
		print "<pre>";
		print_r($fields);
	}
	
	public function fill_object_by_id($mod_id){
		$result = $this->get_rs_by_id($mod_id);

		if($result){
			$this->fill_fields($result);
			return true;
		}else{
			return false;
		}
	}
	
	public function fill_object_by_field($field,$value){
		$result = $this->get_rs_by_field($field,$value);
		if($result){
			$this->fill_fields($result);
			return true;
		}else{
			return false;
		}
	}
	
	public function get_rs(){
		$com = new Communicator();
		return Query::Select($this->getFields(),$this->table,'',$com);
	}
	
	/**
	 * Return a RecordSet
	 *
	 * @param int $id
	 * @return RecordSet
	 */
	public function get_rs_by_id($id, Communicator &$com = null){
		$conex = Connection::getConnection();
		
		if(is_null($com)){
			$com = new Communicator();
		}

		if($conex){
			
			$query = new QuerySelect();
			$query->fields = $this->getFields();
			$query->table = $this->table;
			$query->where = "$this->key = $id";
			$result = $query->execute($com);
			return $result;
		}else{
			$com->setMessage('Un error ocurrió durante la conexión');
			throw new Exception($com->getMessage());
			return false;
		}
	}
	
	/**
	 * Enter description here...
	 *
	 * @param string $field
	 * @param string $value
	 * @return RecordSet
	 */
	public function get_rs_by_field($field,$value, $orderby = ""){
		$conex = Connection::getConnection();
		$com = new Communicator();
		if($conex){
			$query = new QuerySelect();
			$query->fields = $this->getFields();
			$query->table = $this->table;
			$query->where = "$field = '$value'";
			$query->orderby = $orderby;
			$result = $query->execute($com);
			return $result;
		}else{
			$com->setMessage('Un error ocurrió durante la conexión');
			return false;
		}
	}
	
}

//$db = new BaseData();
//
//$db->nombre = "juan";
//$db->apellido = " alvarez";
//
//print $db->nombre ."<br />";
//print $db->apellido ."<br />";