<?php
/**
 * This one doesn't work with chrome
 */
require_once 'PHPUnit/Extensions/SeleniumTestCase.php';

class WebTest extends PHPUnit_Extensions_SeleniumTestCase {

	protected function setUp(){
// 		$this->setBrowser('chrome');	//DIDN'T WORK
// 		$this->setBrowser('*chrome');	//DIDN'T WORK

		$this->setBrowser('*firefox');
		$this->setBrowserUrl('http://www.example.com/');
	}

	public function testTitle(){
		$this->open('http://www.example.com/');
		$this->assertEquals('Insert title here', $this->title());
		$this->assertTitle('Example WWW Page');
	}
}
?>