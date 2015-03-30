<?php



function ssm_post_subscribers_meta($post){
    // $post is already set, and contains an object: the WordPress post
    global $post;




    $ssm_select_form_template = get_post_meta($post->ID,'ssm_select_form_template',true);

    
    wp_nonce_field( 'my_meta_box_nonce', 'meta_box_nonce' );
    // Download link
    ?>

    <a href="<?php echo plugins_url('/subscriber-list-download.php',__FILE__); ?>">DOWNLOAD LIST</a>

    <?php



}

?>