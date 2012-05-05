<?php
class Mensaje extends BaseData {
	
	public $msg_id = 0;
	public $msg_nombres = '';
	public $msg_cedula = '';
	public $msg_celular = '';
	public $msg_email = '';
	public $msg_consulta = '';
	public $msg_fechaenvio = '';
	public $msg_fecharespuesta = '0000-00-00 00:00:00';
	public $msg_codigoseg = '';
	public $msg_respondido = 0;
	public $msg_respuesta = '';
	public $msg_invalido = 0;
	public $usr_id = 0;
	
	protected $key = 'msg_id';
	protected $table = 'msg_mensaje';
	
	protected function getFields(){
		$keys = array(
			'msg_id',
			'msg_nombres',
			'msg_cedula',
			'msg_celular',
			'msg_email',
			'msg_consulta',
			'msg_fechaenvio',
			'msg_fecharespuesta',
			'msg_codigoseg',
			'msg_respondido',
			'msg_respuesta',
			'msg_invalido',
			'usr_id'
		);

		return $keys;
	}

	public function findByCodigo($codigo){
		return $this->fill_object_by_field('msg_codigoseg', $codigo);
	}
	
	public function Insert(Communicator &$com){
		
		$this->msg_fechaenvio = date("Y-m-d h:m:s");
		
		$bind = array(
			'msg_nombres' => "'$this->msg_nombres'",
			'msg_cedula' => "'$this->msg_cedula'",
			'msg_celular' => "'$this->msg_celular'",
			'msg_email' => "'$this->msg_email'",
			'msg_consulta' => "'$this->msg_consulta'",
			'msg_fechaenvio' => "'$this->msg_fechaenvio'",
			'msg_codigoseg' => "'$this->msg_codigoseg'",
			'msg_respondido' => "$this->msg_respondido",
			'msg_invalido' => "$this->msg_invalido",
			'usr_id' => "$this->usr_id"
		);

		return Query::Insert($this->table,$bind,$com);
	}
	
	public function Update(Communicator &$com){
		
		$this->msg_cedula = md5($this->msg_cedula);
		
		$this->msg_consulta = Tools::sanatize($this->msg_consulta);
		
		$bind = array(
			'msg_nombres' => "'$this->msg_nombres'",
			'msg_cedula' => "'$this->msg_cedula'",
			'msg_celular' => "'$this->msg_celular'",
			'msg_email' => "'$this->msg_email'",
			'msg_consulta' => "'$this->msg_consulta'",
			'msg_fechaenvio' => "'$this->msg_fechaenvio'",
			'msg_fecharespuesta' => "'$this->msg_fecharespuesta'",
			'msg_codigoseg' => "'$this->msg_codigoseg'",
			'msg_respondido' => "'$this->msg_respondido'",
			'msg_respuesta' => "'$this->msg_respuesta'",
			'msg_invalido' => "'$this->msg_invalido'",
			'usr_id' => "$this->usr_id"
		);
		
		return Query::Update($this->table,$bind,"$this->key = $this->msg_id",$com);
	}
	
	public function Delete(Communicator &$com){
		return Query::Delete($this->table,"$this->key = $this->msg_id",$com);
	}

}

?>