<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme and one
 * of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query,
 * e.g., it puts together the home page when no home.php file exists.
 *
 * @link http://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage Twenty_Fourteen
 * @since Twenty Fourteen 1.0
 */
get_header();
?>


<?php
$args = array( 'post_type' => 'home-section', 'posts_per_page' => -1 );
$loop = new WP_Query( $args );
?>
<?php while ($loop->have_posts() ) : $loop->the_post()?>
    <?php if (has_post_thumbnail($post->ID)) { ?>
        <?php $image = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID, 'full')); ?>
        <?php
        $image = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), "full");
        $class ='has-bg';
        $style = "background: url('" . $image[0] . "') no-repeat center center fixed; background-attachment: fixed; -webkit-background-size: cover; -moz-background-size: cover;  -o-background-size: cover;  background-size: cover; "    ?>
        <?php
    } else {
        $style = "";
    }
    ?>

    <div id="<?php echo the_slug(); ?>" class="section <?php echo $class ;?> "  style="<?php  echo $style ?>">
        <div class="<?php echo the_slug(); ?>-inner">
            <div class="content">
                <?php the_content(); ?>
            </div>
            
        </div> <!--.story-->
    </div> <!--#intro-->


    <?php 
endwhile;
?>	

<?php
get_footer();
?>
