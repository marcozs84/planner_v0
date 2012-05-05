<?php
class Query {
	public function __construct(){

	}

	/**
	 * Enter description here...
	 *
	 * @param array $fields
	 * @param string $table
	 * @param string $where
	 * @param Communicator $com
	 * @return array
	 */
	public static function Select($fields, $table, $where = '', Communicator &$com = null){
		if(count($fields) < 1){
			$com->setMessage("La cantidad de campos debe ser mayor a 0.");
			return false;
		}

//		$apdb = new AppDataBase();
//		$apdb->getConnection();

		$con = Connection::getConnection();

		$campos = implode(',',$fields);

		if(trim($where) != ''){
			$where = " where {$where} ";
		}

		$consulta = "select {$campos} from {$table} {$where} ";

		if(isset($_GET['debug'])){
			print("\$consulta = ".$consulta."<br />");
		}

		$query = @mysql_db_query(Connection::getDB(),$consulta);
		if($query){

			$result = array();
			$fields = array();

			if(mysql_num_rows($query) > 0){

				while( $fld = mysql_fetch_field( $query ) ){
					$fields[] = $fld->name;
				}
				while( $row = mysql_fetch_array( $query ) ){
					$fullrow = array();
					for($j = 0; $j < count( $fields ); $j++){
						$fullrow[$fields[$j]] = $row[$fields[$j]];
					}
					$result[] = $fullrow;
				}
				$com->setMessage("Selección exitosa.");
				$com->setValue(mysql_num_rows($query));
				if(count($result) > 0){
					return $result;
				}else{
					$com->setMessage("La consulta no retornó ningun resultado "."\n".$consulta);
					return $result;
				}
			}else{
				$com->setMessage("La consulta no retornó ningun resultado "."\n".$consulta);
				return $result;
			}
		}else{
			$com->setMessage("Ocurrió un error durante la consulta de selección. "."\n".$consulta);
			return false;
		}
	}

	public static function Insert($table, Array $bind, Communicator &$com = null){

		$fields = array();
		$values = array();
		foreach ($bind as $col=>$val) {
			$fields[] = $col;
			$values[] = $val;
		}

		$con = Connection::getConnection();

		$consulta = "insert into {$table} (".implode(',',$fields).") values (".implode(',',$values).")";

		if(isset($_GET['debug'])){
			print("\$consulta = ".$consulta."<br />");
		}

		$query = @mysql_db_query(Connection::getDB(),$consulta);
		if($query){
			$last_id = @mysql_insert_id();
			$com->setMessage("Registro creado satisfactoriamente.");
			$com->setValue($last_id);
			return true;
		}else{
			$com->setMessage("Ocurrió un error durante la creación del registro. <br />".$consulta);
			return false;
		}
	}

	public static function Update($table,Array $bind, $where,Communicator &$com = null){


		$consulta = "update $table set ";

		$fields = array();
		foreach ($bind as $col=>$val) {
			$fields[] = " $col = $val ";
		}

		$consulta .= implode(',',$fields);

		if(trim($where) != ''){
			$consulta .= " where $where ";
		}

		$con = Connection::getConnection();

		if(isset($_GET['debug'])){
			print("\$consulta = ".$consulta."<br />");
		}

		$query = mysql_db_query(Connection::getDB(),$consulta);
		if($query){
//			$last_id = mysql_insert_id();
			$com->setMessage("Registro actualizado satisfactoriamente.");
			$com->setValue(0);
//			$com->setValue($last_id);
			return true;
		}else{
			$com->setMessage("Ocurrió un error durante la actualización del registro. <br />".$consulta);
			return false;
		}
	}

	/**
	 * Enter description here...
	 *
	 * @param string $table
	 * @param string $where
	 * @param Communicator $com
	 * @return boolean
	 */
	public function Delete($table,$where,Communicator &$com = null){
		if((trim($where) == '')){
			$com->setMessage("Faltan datos para ejecutar la eliminación.");
			return false;
		}

		$con = Connection::getConnection();

		$consulta = "delete from {$table} where {$where}";

		$query = @mysql_db_query(Connection::getDB(),$consulta);
		if($query){
			$com->setMessage("Registro eliminado satisfactoriamente.");
			return true;
		}else{
			$com->setMessage("Ocurrió un error durante la eliminación del registro.");
			return false;
		}
	}

	public function Exec($query,&$com){
		$con = Connection::getConnection();

		$consulta = $query;

		$query = @mysql_db_query(Connection::getDB(),$consulta);
		if($query){

			$result = array();
			$fields = array();

			if(mysql_num_rows($query) > 0){

				while( $fld = mysql_fetch_field( $query ) ){
					$fields[] = $fld->name;
				}
				while( $row = mysql_fetch_array( $query ) ){
					$fullrow = array();
					for($j = 0; $j < count( $fields ); $j++){
						$fullrow[$fields[$j]] = $row[$fields[$j]];
					}
					$result[] = $fullrow;
				}
				$com->setMessage("Selección exitosa.");
				$com->setValue(mysql_num_rows($query));
				if(count($result) > 0){
					return $result;
				}else{
					$com->setMessage("La consulta no retornó ningun resultado "."\n".$consulta);
					return $result;
				}
			}else{
				$com->setMessage("La consulta no retornó ningun resultado "."\n".$consulta);
				return $result;
			}
		}else{
			$com->setMessage("Ocurrió un error durante la consulta de selección. "."\n".$consulta);
			return false;
		}

//		return $query = @mysql_db_query(Connection::getConnection(),$consulta);
	}

}
?>