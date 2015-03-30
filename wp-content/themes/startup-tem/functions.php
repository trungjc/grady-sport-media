<?php
/*
 * This file is part of the Designmodo WordPress Theme.
 *
 * (c) Designmodo Inc. <info@designmodo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// Config loader.
$_designmodo_theme_config = array();
require_once 'config/config.php';
if (getenv('APPLICATION_ENV')) {
    require_once 'config/' . getenv('APPLICATION_ENV') . '.php';
}
if (!empty($_designmodo_theme_config)) {
    foreach ($_designmodo_theme_config as $k => $v) {
        define($k, $v);
    }

    // Check PHP version
    if (version_compare(phpversion(), SF_MIN_PHP_VERSION, '<') && ! is_admin()) {
        throw new Exception('This theme requires PHP 5.3.0 or greater. You have ' . phpversion(), 986545);
    }

    // Load initializer
    require_once 'init.php';
}