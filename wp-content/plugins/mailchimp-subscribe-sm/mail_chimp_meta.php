<?php



function ssm_mailchimp_meta($post){
    // $post is already set, and contains an object: the WordPress post
    global $post;


 //////////////////////////////////////////////////////////////////////////
                                                                        //  
                               //START                                 //
                                                                      //  
                                                                     //
    ///////  MAIN SETTINGS var assign BOX Starts HERE!!! /////////////
    $ssm_mailchimp_api_key =get_option('ssm_mailchimp_api_key');
    $ssm_mailchimp_list_id =get_option('ssm_mailchimp_list_id');

    $ssm_select_form_template = get_post_meta($post->ID,'ssm_select_form_template',true);

    
    wp_nonce_field( 'my_meta_box_nonce', 'meta_box_nonce' );

    echo "<h1>MailChimp Connect</h1>";
    ?>
    <p><input type='text' name='ssm_mailchimp_api_key' value='<?php echo get_option('ssm_mailchimp_api_key'); ?> '>
    <input type='text' name='ssm_mailchimp_list_id' value='<?php echo get_option('ssm_mailchimp_list_id'); ?>'>
  </p>
  <?php

}


?>