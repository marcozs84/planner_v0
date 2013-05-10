<?php
require_once 'PHPUnit/Extensions/SeleniumTestCase.php';

class WebTest extends PHPUnit_Extensions_SeleniumTestCase
{
	protected function setUp(){
		$this->setBrowser('chrome');
		$this->setBrowserUrl('http://planner/');
	}

	public function testTitle(){
		$this->open('http://planner/');
		$this->assertEquals('Insert title here', $this->title());
		$this->assertTitle('Example WWW Page');
	}
}
?>