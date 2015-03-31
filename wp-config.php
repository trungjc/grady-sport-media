<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link http://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'grady-sport-media');


/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

define('DB_USER', getenv('C9_USER'));
define('DB_PASSWORD', '');
define('DB_HOST', getenv('IP'));
/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '7>s&|Q|R`S,q:-l{&CKu}.`D+j;n}4W5_S_8INy`[u:[rJ>}h`usd+!uK?21w.?7');
define('SECURE_AUTH_KEY',  '>*wI+A]&+qR#^F,2+Uw*3t||:.QNBk<09KP[EX?mse=9Fx+~~I!C_COC5TZ:jr(Q');
define('LOGGED_IN_KEY',    ',)MCp{<6k9|(,P|(>5l8.,i95%%:cRpHRI)pXBe`$Eawr+FzNZwC2e{_haJM+Kb0');
define('NONCE_KEY',        'GrORa3l~m9-1FD;1)w.Eza>ke;;*D.nBzMwQNCTMsvh$qHMg||*)C,K4e@f8X,g)');
define('AUTH_SALT',        '2-x9T6EfY)@ozf~Z@$<%L1qVWY;Z+:Fv}|)z= )/kg{;8h,o;LQejCW-ryj)6m,{');
define('SECURE_AUTH_SALT', '+rzJGp@~@uHVG%p0]{+]7sz@m=+cY7Q ?$_P3b7Tz:T4g{Y|L:OU~r2Ck@n$hV-l');
define('LOGGED_IN_SALT',   'Su:Z,E:!~hH?DnS_Ug4f=Cb/y|A5N+A)I@>>J+@q>jtYf4x-Ee=T`][*tmS~@e9O');
define('NONCE_SALT',       ']omBZ[BQF=)n.C%}ln-X#cLX]Dw?r[|7Ai!BezRhkGF&*^>>y+A)jG;dW_Jzn;sG');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'jc_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
