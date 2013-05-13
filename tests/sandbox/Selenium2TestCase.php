<?php
/**
 * Tested on Monday 13.05.13,
 * Works with chrome
 * @author marco
 *
 */
class WebTest extends PHPUnit_Extensions_Selenium2TestCase {

	protected function setUp() {
		$this->setBrowser('chrome');
		$this->setBrowserUrl('http://www.example.com/');
	}

	public function testTitle() {
		$this->url('http://www.example.com/');
		$this->assertEquals('Example WWW Page', $this->title());
	}

}
?>
