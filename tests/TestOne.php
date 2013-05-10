<?php

/**
 * Logging test case.
 */
class TestOne extends PHPUnit_Framework_TestCase {

	/**
	 *
	 * @var Logging
	 */
	private $Logging;

	/**
	 * Prepares the environment before running a test.
	 */
	protected function setUp() {
		parent::setUp ();

		$this->setBrowser('chrome');
		$this->setBrowserUrl('http://planner/');

	}

	/**
	 * Cleans up the environment after running a test.
	 */
	protected function tearDown() {
		parent::tearDown ();
	}

	/**
	 * Constructs the test case.
	 */
	public function __construct() {
	}

	/**
	 * Tests Logging->lfile()
	 */
	public function testLfile() {
		$this->Logging->lfile(/* parameters */);

		$this->url('http://planner');
		$this->assertEquals('Example WWW Page', $this->title());

	}

}

