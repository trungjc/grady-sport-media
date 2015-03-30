<?php
/*
 * This file is part of the Designmodo WordPress Theme.
 *
 * (c) Designmodo Inc. <info@designmodo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace Designmodo\WpTheme\Utility;

use Designmodo\WpTheme\Utility\Db;
/**
 * Migrations implements migration feature for WP theme.
 */
class Migrations
{

    /**
     * Init Migrations
     *
     * @return void
     */
    static public function init()
    {
        if (get_option('sf_version') != SF_THEME_VERSION) {
            self::migrate();
            add_option('sf_version', SF_THEME_VERSION) || update_option('sf_version', SF_THEME_VERSION);
        }
    }

    /**
     * Run SQL scripts
     *
     * @return void
     */
    static public function migrate()
    {
        $sql = array();

        // New install
        if (!get_option('sf_version')) {

            // Setup settings
            if (!get_option('sf_settings')) {

                $optName = 'sf_settings';
                $optVal = array(
                    'SF_BLOG_URI' => 'blog',
                    'SF_TPL_CACHE' => false,
                    'SF_GLOBAL_CSS' => 'body.startup {
    /* Startup CSS */
}

body.blog {
    /* Blog CSS */
}',
                    'SF_BLOG_TITLE' => 'Startup framework',
                    'SF_BLOG_FOOTER_TEXT' => 'This site made by <a href="#">Designmodo</a>  in 2014.
All rights reserved.
<a href="#">Subscribe</a>  to our news.'
                );
                add_option($optName, $optVal) || update_option($optName, $optVal);
            }

            // Setup DB
            if (Db::getColumn('SHOW TABLES LIKE "' . Db::getThemeTableName(Db::TABLE_COMPONENT) . '"') != Db::getThemeTableName(Db::TABLE_COMPONENT)) {
                $sql[] = '
                    CREATE TABLE `' . Db::getThemeTableName(Db::TABLE_COMPONENT) . '` (
                      `id` int(10) NOT NULL AUTO_INCREMENT,
                      `template_id` varchar(200) NOT NULL,
                      `thumb` LONGTEXT NOT NULL,
                      `model` text NOT NULL,
                      `is_system` tinyint(1) NOT NULL DEFAULT "0",
                      `is_hidden` tinyint(1) NOT NULL DEFAULT "0",
                      `created_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      PRIMARY KEY (`id`)
                    ) DEFAULT CHARSET=utf8;
                    INSERT INTO `' . Db::getThemeTableName(Db::TABLE_COMPONENT) . '` VALUES
                    (1,"common.header","","[]", 1, 1, 1405943921),
                    (2,"common.footer","","[]", 1, 1, 1405943921);
                ';
            }

            if (Db::getColumn('SHOW TABLES LIKE "' . Db::getThemeTableName(Db::TABLE_LAYOUT) . '"') != Db::getThemeTableName(Db::TABLE_LAYOUT)) {
                $sql[] = '
                    CREATE TABLE `' . Db::getThemeTableName(Db::TABLE_LAYOUT) . '` (
                      `id` int(10) NOT NULL AUTO_INCREMENT,
                      `is_system` tinyint(1) NOT NULL DEFAULT 0,
                      PRIMARY KEY (`id`)
                    ) DEFAULT CHARSET=utf8;
                ';
            }

            if (Db::getColumn('SHOW TABLES LIKE "' . Db::getThemeTableName(Db::TABLE_LAYOUT_COMPONENT) . '"') != Db::getThemeTableName(Db::TABLE_LAYOUT_COMPONENT)) {
                $sql[] = '
                    CREATE TABLE `' . Db::getThemeTableName(Db::TABLE_LAYOUT_COMPONENT) . '` (
                      `layout_id` int(10) NOT NULL,
                      `component_id` int(10) NOT NULL,
                      `order` int(10) NOT NULL
                    ) DEFAULT CHARSET=utf8;
                ';
            }

            if (Db::getColumn('SHOW TABLES LIKE "' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '"') != Db::getThemeTableName(Db::TABLE_RESOURCE)) {
                $sql[] = '
                    CREATE TABLE `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '` (
                      `id` int(10) NOT NULL AUTO_INCREMENT,
                      `template_id` varchar(255) NOT NULL,
                      `type` varchar(255) NOT NULL,
                      `data` longtext NOT NULL,
                      `is_custom` tinyint(1) NOT NULL DEFAULT "1",
                      `created_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      PRIMARY KEY (`id`)
                    ) DEFAULT CHARSET=utf8;
                ';
            }

        // Migration
        } else if (version_compare(get_option('sf_version'), SF_THEME_VERSION, '<')) {

            // If old version is older than 1.2.1
            if (version_compare(get_option('sf_version'), '1.2.1', '<')) {
                if (Db::getColumn('SHOW TABLES LIKE "' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '"') != Db::getThemeTableName(Db::TABLE_RESOURCE)) {
                    $sql[] = '
                        CREATE TABLE `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '` (
                          `id` int(10) NOT NULL AUTO_INCREMENT,
                          `template_id` varchar(255) NOT NULL,
                          `type` varchar(255) NOT NULL,
                          `data` longtext NOT NULL,
                          `is_custom` tinyint(1) NOT NULL DEFAULT "1",
                          `created_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          PRIMARY KEY (`id`)
                        ) DEFAULT CHARSET=utf8;
                    ';
                }
                // Hide all lost custom blocks
                $sql[] = '
                    UPDATE `wp_sf_component` SET `is_hidden`= 1 WHERE `template_id` LIKE "custom.%";
                ';
            }
            // Migrate to UTF8
            if (version_compare(get_option('sf_version'), '1.2.2', '<')) {
                Db::query('ALTER TABLE  `' . Db::getThemeTableName(Db::TABLE_LAYOUT) . '` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;');
                Db::query('ALTER TABLE  `' . Db::getThemeTableName(Db::TABLE_COMPONENT) . '` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;');
                Db::query('ALTER TABLE  `' . Db::getThemeTableName(Db::TABLE_COMPONENT) . '` CHANGE  `template_id`  `template_id` VARCHAR( 200 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ;');
                Db::query('ALTER TABLE  `' . Db::getThemeTableName(Db::TABLE_COMPONENT) . '` CHANGE  `thumb`  `thumb` LONGTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ;');
                Db::query('ALTER TABLE  `' . Db::getThemeTableName(Db::TABLE_COMPONENT) . '` CHANGE  `model`  `model` LONGTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ;');
                Db::query('ALTER TABLE  `' . Db::getThemeTableName(Db::TABLE_COMPONENT) . '` CHANGE  `html`  `html` LONGTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ;');
                Db::query('ALTER TABLE  `' . Db::getThemeTableName(Db::TABLE_LAYOUT_COMPONENT) . '` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;');
                Db::query('ALTER TABLE  `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;');
                Db::query('ALTER TABLE  `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '` CHANGE  `template_id`  `template_id` VARCHAR( 255 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ;');
                Db::query('ALTER TABLE  `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '` CHANGE  `type`  `type` VARCHAR( 255 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ;');
                Db::query('ALTER TABLE  `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '` CHANGE  `data`  `data` LONGTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL ;');
            }

            // Get back resource table
            if (version_compare(get_option('sf_version'), '1.2.3', '<')) {
                if (Db::query('ALTER TABLE `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '` ADD `id` INT UNSIGNED NOT NULL FIRST')) {
                    Db::query('ALTER TABLE `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '` DROP `id`');
                    Db::query('ALTER TABLE `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '` DROP PRIMARY KEY');
                    Db::query('ALTER TABLE `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '` ADD `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST');
                }
                Db::query('
                    CREATE TABLE `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '` (
                      `id` int(10) NOT NULL AUTO_INCREMENT,
                      `template_id` varchar(255) NOT NULL,
                      `type` varchar(255) NOT NULL,
                      `data` longtext NOT NULL,
                      `is_custom` tinyint(1) NOT NULL DEFAULT "1",
                      `created_ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      PRIMARY KEY (`id`)
                    ) DEFAULT CHARSET=utf8;
                ');
            }
        }

        if ($sql) {
            require_once (ABSPATH . 'wp-admin/includes/upgrade.php');
            dbDelta(join(PHP_EOL, $sql));
        }
    }
}