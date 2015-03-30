<?php
/*
 * This file is part of the Designmodo WordPress Theme.
 *
 * (c) Designmodo Inc. <info@designmodo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
use Designmodo\WpTheme\Utility\Context;
use Designmodo\WpTheme\Page\Layout\Layout;
use Designmodo\WpTheme\Http\Http;
$post = new TimberPost();
if ($post->get_post_type()->name == SF_POST_TYPE) {
    Context::getInstance()->set('post', $post);
    $pageLayout = get_post_meta($post->ID, '_sf_page_layout', true);
    Context::getInstance()->set('current_layout_id', $pageLayout);
    Context::getInstance()->set('current_post_id', $post->ID);

    $layout = new Layout(Context::getInstance()->get('current_layout_id'));
    Context::getInstance()->set('current_component_ids', $layout->getComponents());
    if (Context::getInstance()->get('edit_mode')) {
        Context::getInstance()->set('wp_title', $post->title());
    }
    Context::getInstance()->set('wp_blog_name', get_bloginfo('name'));
    echo $layout->render(Http::CONTENT_TYPE_HTML);
} else {
    get_template_part('stockpage');
}