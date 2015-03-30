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
use Designmodo\WpTheme\Page\Layout\Component\Template\Template;

/**
 * Timber inits and provides features of the Timber.
 */
class Timber
{

    /**
     * Init the Timber
     *
     * @return void
     */
    static public function init()
    {
        // Load Timber if needed
        include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
        if (! class_exists('\Timber')) {
            require_once SF_BASE_PATH . '/vendor/Timber/timber.php';
        } elseif (! is_admin() && \is_plugin_active('timber-library/timber.php')) {
            throw new \Exception('Please deactivate your Timber plugin before use of this theme.', 705213);
        }

//         \Timber::$locations = array(
//             SF_TPL_PATH,
//             SF_TPL_BUILDIN_PATH
//         );
//         self::cache(SF_TPL_CACHE);

//         // Cache switched off, but cache does not removed.
//         if (! self::cache() && (count(glob(SF_TPL_CACHE_PATH . '/*')) === 0 )) {
//             Timber::clearCache();
//         }

//         if (self::cache() && !file_exists(SF_TPL_CACHE_PATH)) {
//             @mkdir(SF_TPL_CACHE_PATH, 0777, true);
//         }

        // Check whether this is possible to use cache
//         if (self::cache() && (!is_writable(SF_TPL_CACHE_PATH)/*  || !is_writable(dirname(SF_TPL_CACHE_PATH)) */)) {
//             self::cache(false);
//             add_action(
//                 'admin_notices',
//                 function () {
//                     echo '
//                     <div class="error fade" style="">
//                         <p>
//                             <strong>Cache directories are not writable.</strong><br />
//                             Cache will not work till you make the cache directories writable or just assign the 777 permissions. See <a href="http://codex.wordpress.org/Changing_File_Permissions" target="_blank">instructions</a>. <br />
//                             Your cache directories are: <br />
//                             <strong>'.str_replace($_SERVER['DOCUMENT_ROOT'], '', SF_TPL_CACHE_PATH).'</strong><br />
//                             <strong>'.str_replace($_SERVER['DOCUMENT_ROOT'], '', dirname(SF_TPL_CACHE_PATH)).'</strong>
//                         </p>
//                     </div>';
//                 }
//             );
//         }

        // This is where you can add your own fuctions to twig
        add_filter(
            'get_twig',
            function($twig) {
                $twig->addExtension(new \Twig_Extension_StringLoader());
                return $twig;
            }
        );

        // Custom search form
        add_filter(
            'get_search_form',
            function($form) {
                $form = '<form role="search" method="get" id="searchform" class="searchform" action="' . home_url( '/' ) . '" >
                    <div><label class="screen-reader-text" for="s">' . __( 'Search for:' ) . '</label>
                    <input type="text" value="' . get_search_query() . '" name="s" id="s" />
                    <input type="submit" id="searchsubmit" value="'. esc_attr__( 'Search' ) .'" />
                    </div>
                    </form>';
                return $form;
            }
        );

        // Setup context
        Context::getInstance()->set('ajaxurl', admin_url('admin-ajax.php'));
        Context::getInstance()->set('headerMenu', new \TimberMenu(Menu::MENU_LOCATION_HEADER));
        Context::getInstance()->set('footerMenuOneLine', new \TimberMenu(Menu::MENU_LOCATION_FOOTER_ONE_LINE));
        Context::getInstance()->set('footerMenuTwoColumns', new \TimberMenu(Menu::MENU_LOCATION_FOOTER_TWO_COLUMNS));
        Context::getInstance()->set('footerMenuThreeColumns', new \TimberMenu(Menu::MENU_LOCATION_FOOTER_THREE_COLUMNS));
        Context::getInstance()->set('footerMenuFourColumns', new \TimberMenu(Menu::MENU_LOCATION_FOOTER_FOUR_COLUMNS));
        Context::getInstance()->set('footerAdditionalMenuOneLine', new \TimberMenu(Menu::MENU_LOCATION_FOOTER_ADDITIONAL_ONE_LINE));
        Context::getInstance()->set('themeUri', get_template_directory_uri() . SF_DS);
        Context::getInstance()->set('sfBuildUri', get_template_directory_uri() . SF_DS . SF_RESOURCES_URI);
        Context::getInstance()->set('baseUrl', get_site_url());
        $siteUrlParts = parse_url(get_site_url());
        Context::getInstance()->set('baseUri', empty($siteUrlParts['path']) ? '/' : $siteUrlParts['path']);
        Context::getInstance()->set('menuEditPageUriPattern', admin_url('nav-menus.php?action=edit&menu=%s'));
        Context::getInstance()->set('edit_mode', (bool) (! empty($_REQUEST['sf_edit_mode']) && current_user_can('edit_theme_options')));
        Context::getInstance()->set('wp_mode', true);
        Context::getInstance()->set('debug_mode', SF_DEBUG_MODE);
        Context::getInstance()->set('_REQUEST', $_REQUEST);
    }

    /**
     * Clear Timber cache
     *
     * @return void
     */
    static public function clearCache()
    {
        $origCacheState = self::cache();
        self::cache(true);
        if (is_writable(SF_TPL_CACHE_PATH)) {
            $loader = new \TimberLoader(\Timber::get_calling_script_dir());
            $loader->clear_cache_twig();
        }
        wp_cache_flush();
        Db::query('
            DELETE FROM `' . Db::getWpDb()->options . '`
            WHERE
                `option_name` LIKE "_transient_timberloader_%"
                OR
                `option_name` LIKE "_transient_timeout_timberloader_%"
        ');
        self::cache($origCacheState);
    }

    /**
     * Timber cache mngmt
     *
     * @param mixed $mode true - switch on the cache, false - switch off the cache, null - get cache mode.
     * @return bool
     */
    static public function cache($mode = null)
    {
        if (is_null($mode)) {
            return \Timber::$cache;
        } elseif ($mode) {
            return \Timber::$cache = true;
        } elseif (!$mode) {
            return \Timber::$cache = false;
        }
    }
}