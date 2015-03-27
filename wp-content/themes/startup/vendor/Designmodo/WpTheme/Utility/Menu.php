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
 * Menu implements menu handler for WordPress.
 */
class Menu
{


    const MENU_LOCATION_HEADER = 'header-menu';
    const MENU_LOCATION_FOOTER_ONE_LINE = 'footer-menu-one-line';
    const MENU_LOCATION_FOOTER_TWO_COLUMNS = 'footer-menu-two-columns';
    const MENU_LOCATION_FOOTER_THREE_COLUMNS = 'footer-menu-three-columns';
    const MENU_LOCATION_FOOTER_FOUR_COLUMNS = 'footer-menu-four-columns';
    const MENU_LOCATION_FOOTER_ADDITIONAL_ONE_LINE = 'footer-additional-menu-one-line';

    /**
     * Init menus
     *
     * @return void
     */
    static public function init()
    {
        // Register locations for menus
        register_nav_menu(self::MENU_LOCATION_HEADER, __('Header: 1 line'));
        register_nav_menu(self::MENU_LOCATION_FOOTER_ONE_LINE, __('Footer: 1 line'));
        register_nav_menu(self::MENU_LOCATION_FOOTER_TWO_COLUMNS, __('Footer: 2 columns'));
        register_nav_menu(self::MENU_LOCATION_FOOTER_THREE_COLUMNS, __('Footer: 3 columns'));
        register_nav_menu(self::MENU_LOCATION_FOOTER_FOUR_COLUMNS, __('Footer: 4 columns'));
        register_nav_menu(self::MENU_LOCATION_FOOTER_ADDITIONAL_ONE_LINE, __('Footer additional'));

        // Create menus if needed
        self::initMenus();

        // Edit mode switcher
        add_action(
            'wp_before_admin_bar_render',
            function () {
                global $wp_admin_bar;
                $post = new \TimberPost();
                if (is_object($post->get_post_type()) && $post->get_post_type()->name == SF_POST_TYPE && !Context::getInstance()->get('edit_mode') && !is_admin()) {
                    $wp_admin_bar->add_menu(
                        array(
                            'parent' => false,
                            'id' => 'sf_edit_mode',
                            'title' => __('Visual editor'),
                            'href' => add_query_arg(array('sf_edit_mode' => 'true'), get_permalink($post->ID)),
                        )
                    );
                }
            }
        );

        // Register custom fields for sp_page editor
        add_action(
            'add_meta_boxes',
            function () {
                add_meta_box(
                    'sf_meta_visual_editor',
                    'Visual editor',
                    function ($post) {
                        echo '<a href="' . add_query_arg( array('sf_edit_mode' => 'true'), get_permalink($post) ) . '" class="button button-primary button-large visual_editor">Visual editor</a>';
                    },
                    SF_POST_TYPE,
                    'normal',
                    'high'
                );
            }
        );

        // Add custom actions to the post grid
        add_filter(
            'post_row_actions',
            function ($actions) {
                if (get_post_type(get_the_ID()) == SF_POST_TYPE && isset($actions['edit'])){
                    $actions['visual_editor'] = '<a href="' . add_query_arg( array('sf_edit_mode' => 'true'), get_permalink() ) . '" class="button button-primary button-large" style="vertical-align: middle;">Visual editor</a>';
                }
                return $actions;
            }
        );
    }

    /**
     * Create dummy menus
     *
     * @return void
     */
    static public function initMenus()
    {
        $menuItemsOneLineHeader = array(
            array('menu-item-title' =>  __('Home')),
            array('menu-item-title' =>  __('Company')),
            array('menu-item-title' =>  __('Portfolio')),
            array('menu-item-title' =>  __('Blog')),
            array('menu-item-title' =>  __('Contact'))
        );
        $menuItemsOneLineFooter = array(
            array('menu-item-title' =>  __('Home')),
            array('menu-item-title' =>  __('Company')),
            array('menu-item-title' =>  __('Portfolio')),
            array('menu-item-title' =>  __('Blog')),
            array('menu-item-title' =>  __('Career')),
            array('menu-item-title' =>  __('Contact'))
        );
        $menuItemsOneLineFooterAdditional = array(
            array('menu-item-title' =>  __('Terms of Service')),
            array('menu-item-title' =>  __('Special Terms')),
            array('menu-item-title' =>  __('Privacy Policy')),
        );
        $menuItemsTwoColumns = array(
            array(
                'menu-item-title' =>  __('Categories'),
                'children' => array(
                    array('menu-item-title' =>  __('About Us')),
                    array('menu-item-title' =>  __('Blog')),
                    array('menu-item-title' =>  __('Teams')),
                    array('menu-item-title' =>  __('Career')),
                    array('menu-item-title' =>  __('Contact'))
                )
            ),
            array(
                'menu-item-title' =>  __('Follow Us'),
                'children' => array(
                    array('menu-item-title' =>  __('Facebook')),
                    array('menu-item-title' =>  __('Twitter')),
                    array('menu-item-title' =>  __('Instagram'))
                )
            )
        );
        $menuItemsThreeColumns = array(
            array(
                'menu-item-title' =>  __('Categories'),
                'children' => array(
                    array('menu-item-title' =>  __('About Us')),
                    array('menu-item-title' =>  __('Blog')),
                    array('menu-item-title' =>  __('Teams')),
                    array('menu-item-title' =>  __('Career')),
                    array('menu-item-title' =>  __('Contact'))
                )
            ),
            array(
                'menu-item-title' =>  __('Work'),
                'children' => array(
                    array('menu-item-title' =>  __('Our Portfolio')),
                    array('menu-item-title' =>  __('Latest Work')),
                    array('menu-item-title' =>  __('Brands'))
                )
            ),
            array(
                'menu-item-title' =>  __('Stuff'),
                'children' => array(
                    array('menu-item-title' =>  __('Privacy')),
                    array('menu-item-title' =>  __('Terms')),
                    array('menu-item-title' =>  __('Advertise'))
                )
            )
        );
        $menuItemsFourColumns = array(
            array(
                'menu-item-title' =>  __('Company'),
                'children' => array(
                    array('menu-item-title' =>  __('About Us')),
                    array('menu-item-title' =>  __('Blog')),
                    array('menu-item-title' =>  __('Teams')),
                    array('menu-item-title' =>  __('Career')),
                    array('menu-item-title' =>  __('Contact'))
                )
            ),
            array(
                'menu-item-title' =>  __('Our Products'),
                'children' => array(
                    array('menu-item-title' =>  __('What we are doing?')),
                    array('menu-item-title' =>  __('Portfolio')),
                    array('menu-item-title' =>  __('Clients')),
                    array('menu-item-title' =>  __('Success Story'))
                )
            ),
            array(
                'menu-item-title' =>  __('Blog'),
                'children' => array(
                    array('menu-item-title' =>  __('Tutorials')),
                    array('menu-item-title' =>  __('Some thoughts'))
                )
            ),
            array(
                'menu-item-title' =>  __('Newsletter'),
                'children' => array(
                    array('menu-item-title' =>  __('News')),
                    array('menu-item-title' =>  __('Design')),
                    array('menu-item-title' =>  __('Development')),
                    array('menu-item-title' =>  __('Drawing')),
                    array('menu-item-title' =>  __('Tutorials'))
                )
            )
        );
        $menus = array(
            array(
                'name' => __('Header menu 1 Line'),
                'location' => self::MENU_LOCATION_HEADER,
                'items' => $menuItemsOneLineHeader
            ),
            array(
                'name' => __('Footer menu 1 Line'),
                'location' => self::MENU_LOCATION_FOOTER_ONE_LINE,
                'items' => $menuItemsOneLineFooter
            ),
            array(
                'name' => __('Footer menu 2 columns'),
                'location' => self::MENU_LOCATION_FOOTER_TWO_COLUMNS,
                'items' => $menuItemsTwoColumns
            ),
            array(
                'name' => __('Footer menu 3 columns'),
                'location' => self::MENU_LOCATION_FOOTER_THREE_COLUMNS,
                'items' => $menuItemsThreeColumns
            ),
            array(
                'name' => __('Footer menu 4 columns'),
                'location' => self::MENU_LOCATION_FOOTER_FOUR_COLUMNS,
                'items' => $menuItemsFourColumns
            ),
            array(
                'name' => __('Footer menu additional'),
                'location' => self::MENU_LOCATION_FOOTER_ADDITIONAL_ONE_LINE,
                'items' => $menuItemsOneLineFooterAdditional
            ),
        );

        $setupMenuItems = function($menuId, $items, $parentItemId = null) use ( &$setupMenuItems ) {
            foreach ($items as $item) {
                $item['menu-item-url'] = isset($item['menu-item-url']) ? $item['menu-item-url'] : '#';
                $item['menu-item-status'] = isset($item['menu-item-status']) ? $item['menu-item-status'] : 'publish';
                if ($parentItemId) {
                    $item['menu-item-parent-id'] = $parentItemId;
                }
                $menuItemId = wp_update_nav_menu_item($menuId, 0, $item);
                if ($item['children']) {
                    $setupMenuItems($menuId, $item['children'], $menuItemId);
                }
            }
        };

        foreach ($menus as $menu) {
            $locations = get_theme_mod('nav_menu_locations');
            if (!get_term_by('name', $menu['name'], 'nav_menu') && empty($locations[$menu['location']])) {
                $menuId = wp_create_nav_menu($menu['name']);
                $setupMenuItems($menuId, $menu['items']);
                $locations = get_theme_mod('nav_menu_locations');
                $locations[$menu['location']] = $menuId;
                set_theme_mod( 'nav_menu_locations', $locations );
            } else if (empty($locations[$menu['location']])) {
                $menuObj = get_term_by('name', $menu['name'], 'nav_menu');
                $locations = get_theme_mod('nav_menu_locations');
                $locations[$menu['location']] = $menuObj->term_id;
                set_theme_mod( 'nav_menu_locations', $locations );
            }
        }
    }
}