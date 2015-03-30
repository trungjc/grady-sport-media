<?php
/*
 * This file is part of the Designmodo WordPress Theme.
 *
 * (c) Designmodo Inc. <info@designmodo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
?><!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) | !(IE 8)  ]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<title><?php wp_title(); ?></title>
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
    <link rel="stylesheet" href="<?php echo get_template_directory_uri() . SF_DS . SF_RESOURCES_URI; ?>flat-ui/bootstrap/css/bootstrap.css">
    <link rel="stylesheet" href="<?php echo get_template_directory_uri() . SF_DS . SF_RESOURCES_URI; ?>flat-ui/css/flat-ui.css">
    <link rel="stylesheet" href="<?php echo get_template_directory_uri() . SF_DS . SF_RESOURCES_URI; ?>common-files/css/animations.css">
    <link rel="stylesheet" href="<?php echo get_template_directory_uri() . SF_DS . SF_RESOURCES_URI; ?>common-files/css/wp-common.css">
    <link rel="stylesheet" href="<?php echo get_template_directory_uri() . SF_DS . SF_RESOURCES_URI; ?>ui-kit/ui-kit-header/css/header-2-style.css">
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/post.css">
    <link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/favicon.ico" />
	<!--[if lt IE 9]>
	<script src="<?php echo get_template_directory_uri(); ?>/js/html5.js"></script>
	<![endif]-->
    <link rel="stylesheet" href="<?php echo admin_url('admin-ajax.php');?>?action=sf_api&method=settings.globalcss.get">
	<?php wp_head(); ?>
</head>
<body <?php body_class('blog'.(has_post_thumbnail() ? '' : ' no-thumbnail')); ?>>
    <div class="designmodo-wrapper">
            <div id="page" class="hfeed site">
                
                <header id="header" class="header-20">
                    <div class="container">
                        <div class="row">
                            <div role="navigation" class="navbar col-sm-12">
                                <div class="navbar-header">
                                    <button class="navbar-toggle" type="button"></button>
                                    <a href="#" class="brand">
                                        <img alt="" src="<?php echo get_template_directory_uri(); ?>/img/logo.png">
                                    </a>
                                </div>
                                <div class="navbar-collapse collapse">
                                    <?php wp_nav_menu(array('theme_location' => Designmodo\WpTheme\Utility\Menu::MENU_LOCATION_HEADER, 'menu_class' => 'nav')); ?>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="header-background"></div>
                </header>
                <div id="main" class="site-main">
