<?php
use Designmodo\WpTheme\Utility\Post;
/*
 * This file is part of the Designmodo WordPress Theme.
 *
 * (c) Designmodo Inc. <info@designmodo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
get_header(); ?>
    <div id="primary" class="content-area post-list">
        <div id="content" class="site-content" role="main">
        <?php if ( have_posts() ) : ?>
            <?php while ( have_posts() ) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <div class="post-list-container">
                        <header class="entry-header">
                            <?php the_post_thumbnail(); ?>
                            <h1 class="entry-title"><a href="<?php echo get_permalink();?>"><?php the_title(); ?></a></h1>
                        </header>
                        <div class="entry-content">
                            <?php
                            if ($post->post_content !== get_the_content()) {
                                the_content('...');
                            } else {
                                $content = get_the_content();
                                $content = apply_filters('the_content', $content);
                                $content = preg_replace('@<script[^>]*?>.*?</script>@si', '', $content);
                                $content = preg_replace('@<style[^>]*?>.*?</style>@si', '', $content);
                                $content = strip_tags($content);
                                if (strlen($content) > SF_POST_TEASER_LIMIT) {
                                    $content = substr($content, 0, strrpos(substr($content, 0, SF_POST_TEASER_LIMIT), ' '));
                                    echo $content . '...';
                                } else {
                                    echo $content;
                                }
                            }
                            ?>
                        </div>
                    </div>
                </article>
            <?php endwhile; ?>
        <?php else : ?>
            <?php if ( is_home() && current_user_can( 'publish_posts' ) ) : ?>
            <p>Ready to publish your first post? <a href="<?php echo admin_url( 'post-new.php' ); ?>">Get started here</a>.</p>
            <?php elseif ( is_search() ) : ?>
            <p><?php _e( 'Sorry, but nothing matched your search terms. Please try again with different keywords.' ); ?></p>
            <?php get_search_form(); ?>
            <?php else : ?>
            <p><?php _e( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.' ); ?></p>
            <?php get_search_form(); ?>
            <?php endif; ?>
        <?php endif; ?>
        </div>
    </div>
<?php get_footer(); ?>