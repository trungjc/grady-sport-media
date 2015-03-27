<?php get_header(); ?>
	<div id="primary" class="content-area single-post">
		<div id="content" class="site-content" role="main">
			<?php while ( have_posts() ) : the_post(); ?>
				<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                        <div class="top">
                            <div class="post-container">

                                <div class="header-text">
                                    <header class="entry-header">

                                        <?php if ( has_post_thumbnail() && ! post_password_required() ) : ?>
                                        <div class="entry-thumbnail img" style="background-image: url('<?php echo wp_get_attachment_url(get_post_thumbnail_id());?>');">

                                        </div>
                                        <?php endif; ?>
                                        <?php if (!has_post_thumbnail()) : ?>
                                            <div class="author"><span>by </span><?php the_author(); ?></div>
                                            <div class="date"><?php the_date(); ?></div>
                                            <h1 class="entry-title"><?php the_title(); ?></h1>
                                            <span class="prev_post_link"><?php previous_post_link('%link', '&lt;'); ?></span>
                                            <span class="next_post_link"><?php next_post_link('%link', '&gt;'); ?></span>
                                        <?php else: ?>
                                            <div class="date"><?php the_date(); ?></div>
                                            <h1 class="entry-title"><?php the_title(); ?></h1>
                                            <div class="author"><span>by </span><?php the_author(); ?></div>
                                                <span class="prev_post_link"><?php previous_post_link('%link', '&lt;'); ?></span>
                                                <span class="next_post_link"><?php next_post_link('%link', '&gt;'); ?></span>
                                        <?php endif; ?>
                                    </header>
                                </div>

                            </div>
                        </div>
                    <div class="entry-content">
                        <?php the_content(); ?>
                    </div>
                    <div class="comments-container">
                        <div class="post-list-container">
                        <?php comments_template(); ?>
                        </div>
                    </div>
				</article>
			<?php endwhile; ?>
		</div>
	</div>
<?php get_footer(); ?>