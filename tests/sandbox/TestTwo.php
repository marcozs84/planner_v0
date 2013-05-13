<?php
require_once 'PHPUnit/Extensions/SeleniumTestCase.php';

class WebTest extends PHPUnit_Extensions_SeleniumTestCase
{
	protected function setUp(){
		$this->setBrowser('chrome');
// 		$this->setBrowserUrl('http://planner/');
		$this->setBrowserUrl('http://www.example.com/');
	}

	public function testTitle(){
		$this->open('http://planner/');
		$this->assertEquals('Insert title here', $this->title());
		$this->assertTitle('Example WWW Page');
// 		$this->url('http://www.example.com/');
// 		$this->assertEquals('Example WWW Page', $this->title());
	}
}
?>