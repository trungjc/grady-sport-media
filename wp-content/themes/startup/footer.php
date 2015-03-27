            </div>
        </div>
        <footer class="blog-footer">
            <?php wp_nav_menu( array( 'theme_location' => Designmodo\WpTheme\Utility\Menu::MENU_LOCATION_FOOTER_ONE_LINE, 'menu_class' => 'nav-menu' ) ); ?>
            <div class="footer-text">
                <?php $_designmodo_theme_options = get_option('sf_settings'); echo $_designmodo_theme_options['SF_BLOG_FOOTER_TEXT'] ?>
            </div>
        </footer>
        </div>
    <?php wp_footer(); ?>
    <script src="<?php echo get_template_directory_uri() . SF_DS . SF_RESOURCES_URI; ?>common-files/js/jquery-1.10.2.min.js"></script>
    <script src="<?php echo get_template_directory_uri() . SF_DS . SF_RESOURCES_URI; ?>flat-ui/js/bootstrap.min.js"></script>
    <script src="<?php echo get_template_directory_uri() . SF_DS . SF_RESOURCES_URI; ?>common-files/js/startup-kit.js"></script>
    </body>
</html>