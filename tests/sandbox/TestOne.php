<?php

/**
 * Logging test case.
 */
// class TestOne extends PHPUnit_Framework_TestCase {
class TestOne extends PHPUnit_Extensions_Selenium2TestCase {

	/**
	 *
	 * @var Logging
	 */
	private $Logging;

	/**
	 * Prepares the environment before running a test.
	 */
	protected function setUp() {
		$this->setBrowser('chrome');	// available if extending PHPUnit_Extensions_Selenium2TestCase
										// look for usage at Selenium2TestCase.php test
		$this->setBrowserUrl('http://planner/');

	}

	/**
	 * Tests Logging->lfile()
	 */
	public function testLfile() {
// 		$this->Logging->lfile(/* parameters */);

		$this->url('http://planner');
		$this->assertEquals('Example WWW Page', $this->title());

	}

}

