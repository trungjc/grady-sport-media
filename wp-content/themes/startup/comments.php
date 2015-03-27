<?php
/*
 * This file is part of the Designmodo WordPress Theme.
 *
 * (c) Designmodo Inc. <info@designmodo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

if ( post_password_required() ) {
    return;
}
?>
<div id="comments" class="comments-area">
    <?php if ( have_comments() ) : ?>
        <h2 class="comments-title">
            <?php
                printf(
                    _n( '%1$s Comment', '%1$s Comments', get_comments_number() ),
                    number_format_i18n( get_comments_number() ),
                    get_the_title()
                );
            ?>
        </h2>
        <?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : ?>
            <nav id="comment-nav-above" class="navigation comment-navigation" role="navigation">
                <h1 class="screen-reader-text"><?php _e( 'Comment navigation' ); ?></h1>
                <div class="nav-previous"><?php previous_comments_link( __( '&larr; Older Comments' ) ); ?></div>
                <div class="nav-next"><?php next_comments_link( __( 'Newer Comments &rarr;' ) ); ?></div>
            </nav><!-- #comment-nav-above -->
        <?php endif; // Check for comment navigation. ?>
        <ol class="comment-list">
            <?php
                wp_list_comments(
                    array(
                        'style'      => 'ol',
                        'short_ping' => true,
                        'avatar_size'=> 34,
                        'callback' => function($comment, $args, $depth) {
                            $GLOBALS['comment'] = $comment;
                            extract($args, EXTR_SKIP);

                            if ( 'div' == $args['style'] ) {
                                $tag = 'div';
                                $add_below = 'comment';
                            } else {
                                $tag = 'li';
                                $add_below = 'div-comment';
                            }
                            ?>
                        	<<?php echo $tag ?> <?php comment_class( empty( $args['has_children'] ) ? '' : 'parent' ) ?> id="comment-<?php comment_ID() ?>">
                        	<?php if ( 'div' != $args['style'] ) : ?>
                        	<div id="div-comment-<?php comment_ID() ?>" class="comment-body">
                        	<?php endif; ?>
                        	<div class="comment-author vcard">
                        	<?php if ( $args['avatar_size'] != 0 ) echo get_avatar( $comment, $args['avatar_size'] ); ?>
                        	<?php printf( __( '<cite class="fn">%s</cite> on ' ), get_comment_author_link() ); ?>
                        	</div>
                        	<?php if ( $comment->comment_approved == '0' ) : ?>
                        		<em class="comment-awaiting-moderation"><?php _e( 'Your comment is awaiting moderation.' ); ?></em>
                        		<br />
                        	<?php endif; ?>

                        	<div class="comment-meta commentmetadata"><a href="<?php echo htmlspecialchars( get_comment_link( $comment->comment_ID ) ); ?>">
                        		<?php
                        			/* translators: 1: date, 2: time */
                        			printf( __('%1$s at %2$s'), get_comment_date(),  get_comment_time() ); ?></a> <span class="says">said:</span>
                        	</div>

                        	<?php comment_text(); ?>
                        	<div class="reply">
                        	<?php comment_reply_link( array_merge( $args, array( 'add_below' => $add_below, 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ); ?>
                        	</div>
                        	<?php if ( 'div' != $args['style'] ) : ?>
                        	</div>
                        	<?php endif; ?>
                        <?php
                        }
                    )
                );
            ?>
        </ol><!-- .comment-list -->
        <?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : ?>
            <nav id="comment-nav-below" class="navigation comment-navigation" role="navigation">
                <h1 class="screen-reader-text"><?php _e( 'Comment navigation' ); ?></h1>
                <div class="nav-previous"><?php previous_comments_link( __( '&larr; Older Comments' ) ); ?></div>
                <div class="nav-next"><?php next_comments_link( __( 'Newer Comments &rarr;' ) ); ?></div>
            </nav><!-- #comment-nav-below -->
        <?php endif; // Check for comment navigation. ?>
        <?php if ( ! comments_open() ) : ?>
        <p class="no-comments"><?php _e( 'Comments are closed.' ); ?></p>
        <?php endif; ?>
    <?php endif; // have_comments() ?>
    <?php
    comment_form(
        array(
            'label_submit' => 'Send Comment',
            'comment_notes_after' => '',
            'comment_notes_before' => '',
            'logged_in_as' => '<p class="logged-in-as">' .
                sprintf(
                    __( 'Logged in as <a href="%1$s">%2$s</a>. <a href="%3$s" class="logout">(Logout)</a>' ),
                    admin_url( 'profile.php' ),
                    $user_identity,
                    wp_logout_url( apply_filters( 'the_permalink', get_permalink( ) ) )
                ) . '</p>',
            'fields' => apply_filters(
                'comment_form_default_fields',
                array(
                    'author' =>
                        '<p class="comment-form-author">' .
                        '<label for="author">' . __( 'Name', 'domainreference' ) . '</label> ' .
                        ( $req ? '<span class="required"></span>' : '' ) .
                        '<input id="author" name="author" placeholder="Username" type="text" value="' . esc_attr( $commenter['comment_author'] ) .
                        '" size="30"' . $aria_req . ' /></p>',

                    'email' =>
                        '<p class="comment-form-email"><label for="email">' . __( 'Email', 'domainreference' ) . '</label> ' .
                        ( $req ? '<span class="required"></span>' : '' ) .
                        '<input id="email" name="email"  placeholder="Email" type="text" value="' . esc_attr(  $commenter['comment_author_email'] ) .
                        '" size="30"' . $aria_req . ' /></p>',

                    'url' =>
                        '<p class="comment-form-url"><label for="url">' .
                        __( 'Website', 'domainreference' ) . '</label>' .
                        '<input id="url" name="url" type="text"  placeholder="URL" value="' . esc_attr( $commenter['comment_author_url'] ) .
                        '" size="30" /></p>',
                )
            ),
            'comment_field' => '<p class="comment-form-comment"><label for="comment">' . _x( 'Comment', 'noun' ) . '</label>      <textarea id="comment" name="comment" placeholder="Comment" cols="45" rows="8" aria-required="true"></textarea></p>',
        )
    ); ?>
</div>