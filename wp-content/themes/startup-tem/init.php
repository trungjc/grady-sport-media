<?php
/*
 * This file is part of the Designmodo WordPress Theme.
 *
 * (c) Designmodo Inc. <info@designmodo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
// Class loader

use Symfony\Component\ClassLoader\ClassLoader;
if (!class_exists('Symfony\\Component\\ClassLoader\\ClassLoader')) {
    require_once SF_BASE_PATH . '/vendor/Symfony/Component/ClassLoader/ClassLoader.php';
}

$loader = new ClassLoader();
$loader->addPrefix('Symfony', SF_BASE_PATH . '/vendor/');
$loader->addPrefix('Designmodo', SF_BASE_PATH . '/vendor/');
$loader->register();
$loader->setUseIncludePath(true);

use Designmodo\WpTheme\Utility\Context;
use Designmodo\WpTheme\Utility\Menu;
use Designmodo\WpTheme\Utility\Post;
use Designmodo\WpTheme\Utility\Timber;
use Designmodo\WpTheme\Utility\Migrations;
use Designmodo\WpTheme\Utility\Rewrite;
use Designmodo\WpTheme\Utility\Api;
use Designmodo\WpTheme\Utility\ContactForm;
use Designmodo\WpTheme\Utility\User;
use Designmodo\WpTheme\Utility\SettingsPage;
use Designmodo\WpTheme\License\License;

// Init exception handler
set_exception_handler(function ($exception)
{
    echo '
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Oops!</title>
    <style>
    </style>
  </head>
  <body>
  	<div>
	    <h1>Beep beep boop!</h1>
        <h2>Error occurred :(</h2>
        <p>Something went wrong while displaying this page.</p>
        <p>Please, let us know about this incident via <a href="mailto:' . get_option('admin_email') . '?subject=' . rawurlencode('I found an error #' . $exception->getCode() . ' on your web site ' . $_SERVER['SERVER_NAME'] . '.') . '&body=' . rawurlencode('
Hi! I just found an error on your web site ' . $_SERVER['SERVER_NAME'] . '.
Here is details:
' . $exception->getCode() . ': ' . $exception->getMessage() . '
On the ' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']) . '">email</a>.</p>
        <pre>' . $exception->getCode() . ': ' . $exception->getMessage() . '</pre>
	</div>
  </body>
</html>';
});

// Initialize the theme
add_action(
    'init',
    function () {
        // Init the migration tool
        Migrations::init();

        // License init
        License::init();

        // Init template engine
        Timber::init();

        // Register custom post type
        Post::registerCustomPostType();

        // Init menus
        Menu::init();

        // Setting page init
        SettingsPage::init();

        // Declarate theme supported features
        add_theme_support('post-formats');
        add_theme_support('post-thumbnails');
        add_theme_support('menus');

        // Add Mediaelement on the page
        wp_enqueue_style( 'wp-mediaelement' );
        wp_enqueue_script( 'wp-mediaelement' );

        // Rewriter init
        Rewrite::init();

        // Ajax handler
        add_action('wp_ajax_sf_api', array('Designmodo\WpTheme\Utility\Api', 'handler'));
        add_action('wp_ajax_nopriv_sf_api', array('Designmodo\WpTheme\Utility\Api', 'handler'));

        // Contact form handler
        ContactForm::handler();

        // Registrantion of new user handler
        User::registrationHandler();
    }
);