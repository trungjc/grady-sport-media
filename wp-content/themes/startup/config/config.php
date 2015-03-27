<?php
/*
 * This file is part of the Designmodo WordPress Theme.
 *
 * (c) Designmodo Inc. <info@designmodo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
$_designmodo_theme_options = get_option('sf_settings');
$_designmodo_theme_config = array();
$_designmodo_theme_config['SF_DEBUG_MODE'] = false;
$_designmodo_theme_config['SF_DS'] = '/';
$_designmodo_theme_config['SF_TEMPLATE_ID_REGEX'] = '/^([a-z0-9\-\_\.]+)$/i';
$_designmodo_theme_config['SF_TEMPLATE_DELIMETER'] = '.';
$_designmodo_theme_config['SF_UPGRADE_URL'] = 'http://designmodo.com/';
$_designmodo_theme_config['SF_RENEW_LICENSE_URL'] = 'http://designmodo.com/my-account';
$_designmodo_theme_config['SF_BASE_PATH'] = str_replace('\\', '/', dirname(dirname(__FILE__))) . $_designmodo_theme_config['SF_DS'];
$_designmodo_theme_config['SF_TPL_PATH'] = $_designmodo_theme_config['SF_BASE_PATH'] . 'templates/startup-framework/build-wp/ui-kit';
$_designmodo_theme_config['SF_RESOURCES_URI'] = str_replace('\\', '/', 'templates/startup-framework/build-wp/');
$_designmodo_theme_config['SF_TPL_BUILDIN_PATH'] = $_designmodo_theme_config['SF_BASE_PATH'] . 'templates/common/ui-kit';
$_designmodo_theme_config['SF_TPL_EXT'] = '.html.twig';
$_designmodo_theme_config['SF_TPL_CACHE_PATH'] = $_designmodo_theme_config['SF_BASE_PATH'] . 'vendor/Timber/cache/twig';
$_designmodo_theme_config['SF_TPL_JS_CONFIG_PATH'] = $_designmodo_theme_config['SF_BASE_PATH'] . 'js/config';
$_designmodo_theme_config['SF_WP_TPL_URI'] = get_template_directory_uri();
$_designmodo_theme_config['SF_THEME_VERSION'] = '1.2.7';
$_designmodo_theme_config['SF_POST_TYPE'] = 'sf_page';
$_designmodo_theme_config['SF_UNRELATED_COMPONENT_MAX_AGE'] = (60 * 60 * 24 * 1); // 1 day
$_designmodo_theme_config['SF_TPL_CACHE'] = (bool)(!isset($_designmodo_theme_options['SF_TPL_CACHE']) ? true : $_designmodo_theme_options['SF_TPL_CACHE']);
$_designmodo_theme_config['SF_TPL_CACHE_MAX_AGE'] = $_designmodo_theme_config['SF_TPL_CACHE'] ? (60 * 60 * 24 * 1) : false; // 1 day
$_designmodo_theme_config['SF_MIN_PHP_VERSION'] = '5.3.0';
$_designmodo_theme_config['SF_BLOG_URI'] = (empty($_designmodo_theme_options['SF_BLOG_URI']) ? 'blog' : $_designmodo_theme_options['SF_BLOG_URI']);
$_designmodo_theme_config['SF_POST_TEASER_LIMIT'] = 120;