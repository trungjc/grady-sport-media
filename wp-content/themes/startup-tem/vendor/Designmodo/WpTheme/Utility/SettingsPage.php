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
 * SettingsPage implements WP admin's settings page handler.
 */
class SettingsPage
{

    /**
     * Init SettingsPage
     *
     * @return void
     */
    public static function init()
    {
        add_action(
            'admin_menu',
            function () {
                add_theme_page(
                    __('Startup settings'),
                    __('Startup Settings'),
                    'edit_theme_options',
                    'sf_settings',
                    array(
                        'Designmodo\WpTheme\Utility\SettingsPage',
                        'show'
                    )
                );
            }
        );

        add_action(
            'admin_init',
            function() {
                register_setting(
                    'sf_settings',
                    'sf_settings',
                    function($input) {
                        /* if (!isset($input['SF_TPL_CACHE']) || empty($input['SF_TPL_CACHE'])) {
                            $input['SF_TPL_CACHE'] = false;
                        } else {
                            $input['SF_TPL_CACHE'] = true;
                        } */
                        return $input;
                    }
                );

                add_settings_section(
                    'sf_settings_main',
                    'Main Settings',
                    function () {
                        echo '<p>Main settings.</p>';
                    },
                    'sf_settings'
                );

                add_settings_field(
                    'SF_BLOG_URI',
                    __( 'Blog URI' ),
                    function () {
                        $sfSettings = get_option('sf_settings');
                        ?><input type="text" id="SF_BLOG_URI" name="sf_settings[SF_BLOG_URI]" required="required" value="<?php echo esc_attr($sfSettings['SF_BLOG_URI']); ?>" /><?php
                    },
                    'sf_settings',
                    'sf_settings_main'
                );

                add_settings_field(
                    'SF_BLOG_TITLE',
                    __( 'Blog title' ),
                    function () {
                        $sfSettings = get_option('sf_settings');
                        ?><input type="text" id="SF_BLOG_TITLE" name="sf_settings[SF_BLOG_TITLE]" required="required" value="<?php echo esc_attr($sfSettings['SF_BLOG_TITLE']); ?>" /><?php
                    },
                    'sf_settings',
                    'sf_settings_main'
                );

                add_settings_field(
                    'SF_BLOG_FOOTER_TEXT',
                    __( 'Blog footer text' ),
                    function () {
                        $sfSettings = get_option('sf_settings');
                        /*?><input type="text" id="SF_BLOG_FOOTER_TEXT" name="sf_settings[SF_BLOG_FOOTER_TEXT]" required="required" value="<?php echo esc_attr($sfSettings['SF_BLOG_FOOTER_TEXT']); ?>" /><?php
                        */?><div id="SF_BLOG_FOOTER_TEXT_edit" style="height: 200px; width: 100%;"></div><textarea id="SF_BLOG_FOOTER_TEXT" name="sf_settings[SF_BLOG_FOOTER_TEXT]" style="display:none;"><?php echo $sfSettings['SF_BLOG_FOOTER_TEXT']; ?></textarea><?php
                    },
                    'sf_settings',
                    'sf_settings_main'
                );

                add_settings_field(
                    'SF_GLOBAL_CSS',
                    __( 'Global CSS' ),
                    function () {
                        $sfSettings = get_option('sf_settings');
                        ?><div id="SF_GLOBAL_CSS_edit" style="height: 200px; width: 100%;"></div><textarea id="SF_GLOBAL_CSS" name="sf_settings[SF_GLOBAL_CSS]" style="display:none;"><?php echo $sfSettings['SF_GLOBAL_CSS']; ?></textarea><?php
                    },
                    'sf_settings',
                    'sf_settings_main'
                );

            }
        );
    }

    public static function show()
    {
        ?>
<div class="wrap">
<script src="https://cdn.jsdelivr.net/ace/1.1.6/min/ace.js" type="text/javascript" charset="utf-8"></script>
<script>
jQuery(document).ready(function() {
    var editors = [{id:'SF_BLOG_FOOTER_TEXT', mode:'html'}, {id:'SF_GLOBAL_CSS', mode:'css'}];
    for (var index in editors) {
        var editor = ace.edit(editors[index].id + "_edit");
        //editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/" + editors[index].mode);
        ace.edit(editors[index].id + "_edit").setValue(jQuery("#" + editors[index].id).val());
//         document.getElementById(editors[index].id + '_edit').style.fontSize='1.2em';
    };

    jQuery(document).on('submit', '#sf_settings_form', function() {
        jQuery("#SF_GLOBAL_CSS").val(ace.edit("SF_GLOBAL_CSS_edit").getValue());
        jQuery("#SF_BLOG_FOOTER_TEXT").val(ace.edit("SF_BLOG_FOOTER_TEXT_edit").getValue());
    })
});
</script>

    <h2><?php echo __('Startup settings'); ?></h2>
    <form method="post" action="options.php" id="sf_settings_form">
        <?php settings_fields('sf_settings'); ?>
        <?php do_settings_sections('sf_settings'); ?>
        <p class="submit">
            <input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />
        </p>
    </form>
</div>
        <?php
    }
}