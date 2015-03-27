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

/**
 * Cleaner implements cleaning functions.
 */
class Cleaner
{
    /**
     * Delete unrelated layouts, components, resources
     *
     * @return void
     */
    static public function cleanDb()
    {
        // Delete unrelated(from posts) layouts
        Db::query(
            'DELETE FROM `' . Db::getThemeTableName(Db::TABLE_LAYOUT) . '`
            WHERE id NOT IN (
                SELECT `meta_value` FROM `' . Db::getWpDb()->postmeta . '` WHERE  `meta_key` =  \'_sf_page_layout\'
            )'
        );

        // Delete relation-records
        Db::query(
            'DELETE FROM `' . Db::getThemeTableName(Db::TABLE_LAYOUT_COMPONENT) . '`
            WHERE `layout_id` NOT IN (
                SELECT `id` FROM `' . Db::getThemeTableName(Db::TABLE_LAYOUT) . '`
            )'
        );

        // Delete unrelated(tmp) components
        Db::query(
            'DELETE FROM `' . Db::getThemeTableName(Db::TABLE_COMPONENT) . '`
            WHERE id NOT IN (
                SELECT component_id FROM `' . Db::getThemeTableName(Db::TABLE_LAYOUT_COMPONENT) . '`
            ) AND is_system = 0 AND UNIX_TIMESTAMP(created_ts) < ' . (string)(time() - SF_UNRELATED_COMPONENT_MAX_AGE )
        );

        // Delete resources
        Db::query(
            'DELETE FROM `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '`
            WHERE template_id NOT IN (
                SELECT  `template_id` FROM  `' . Db::getThemeTableName(Db::TABLE_COMPONENT) . '` GROUP BY  `template_id`
            )'
        );

    }
}