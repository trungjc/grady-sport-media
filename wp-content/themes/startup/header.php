<?php
/**
 * The Header for our theme
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *
 * @package WordPress
 * @subpackage Twenty_Fourteen
 * @since Twenty Fourteen 1.0
 */
?><!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) & !(IE 8)]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width">
	<title><?php wp_title( '|', true, 'right' ); ?></title>
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
        <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/modules/flat-ui/bootstrap/css/bootstrap.css">
        <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/modules/flat-ui/css/flat-ui.css">
        <link href='http://fonts.googleapis.com/css?family=Lato:300,400,700,900,700italic|Oswald' rel='stylesheet' type='text/css'>
        <!-- Using only with Flat-UI (free)-->
        <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/modules/common-files/css/icon-font.css">
        <!-- end -->
        <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/modules/common-files/css/animations.css">
        <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/style.css">
        
	<!--[if gte IE 9]>
  <style type="text/css">
    .gradient {
       filter: none;
    }
  </style>
<![endif]-->
	<!--[if lt IE 9]>
	<script src="<?php echo get_template_directory_uri(); ?>/js/html5.js"></script>
	<![endif]-->
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div class="page-wrapper">
	
	
         <!-- header-20 -->
            <header class="header-20" id="header">
                <div class="container">
                    <div class="row">
                        <div class="navbar col-sm-12" role="navigation">
                            <div class="navbar-header">
                                <button type="button" class="navbar-toggle"></button>
                                <a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
                                    <img src="<?php echo get_template_directory_uri(); ?>/img/logo.png"  alt="">
                                </a>
                            </div>
                            <div class="navbar-collapse collapse">
                                <?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu_class' => 'nav-p' ,'items_wrap' => '<ul class="nav">%3$s</ul>') ); ?>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="header-background"></div>
            </header>
	<div id="mains" class="site-mains">
