<?php 





//////////// META BOXES TYPE STARTS HERE!!!!! //////////////////
                                                        ///////
                                                        //////
                                                        /////
//////////// META BOXES TYPE STARTS HERE!!!!! //////////////



add_action('add_meta_boxes','ssm_add_meta_boxes');

  function ssm_add_meta_boxes(){
   

    add_meta_box('ssm_shortcode_meta' ,'Form Shortcode','ssm_shortcode_meta', 'subscribe_me_forms','side','high');

    add_meta_box('ssm_premium_ver' ,'Get More Awesome Features','ssm_premium_ver', 'subscribe_me_forms','side','high');
    //add_meta_box('ssm_reating_meta' ,'Get Premium Version Free','ssm_reating_meta', 'subscribe_me_forms','side','low');

    add_meta_box('ssm_select_form_meta' ,'Select Form Template','ssm_select_form_meta', 'subscribe_me_forms','normal','high');

    add_meta_box('ssm_form_edit_meta' ,'Edit Form','ssm_form_edit_meta', 'subscribe_me_forms','normal','low');


   // add_meta_box('ssm_color_settings_meta' ,'Form Color Settings','ssm_color_settings_meta', 'subscribe_me_forms','normal','low');



  }
 


add_action('save_post','ssm_save_metabox_data');

  function ssm_save_metabox_data($post_id){


  	if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
     
    // if our nonce isn't there, or we can't verify it, bail
    if( !isset( $_POST['meta_box_nonce'] ) || !wp_verify_nonce( $_POST['meta_box_nonce'], 'my_meta_box_nonce' ) ) return;
     
    // if our current user can't edit this post, bail
    if( !current_user_can( 'edit_post' ) ) return;
     
    // now we can actually save the data
    $allowed = array( 
        'a' => array( // on allow a tags
            'href' => array() // and those anchors can only have href attribute
        )
    );
     
    // Make sure your data is set before trying to save it


    if( isset( $_POST['smf_example'] ) )
        update_post_meta( $post_id, 'smf_example', wp_kses( $_POST['smf_example'], $allowed ) );

      if( isset( $_POST['ssm_select_data_save_method'] ) )
        update_post_meta( $post_id, 'ssm_select_data_save_method',$_POST['ssm_select_data_save_method'] );


     if( isset( $_POST['ssm_select_form_template'] ) )
        update_post_meta( $post_id, 'ssm_select_form_template',$_POST['ssm_select_form_template'] );

      if( isset( $_POST['sm_form_header'] ) )
        update_post_meta( $post_id, 'sm_form_header', wp_kses( $_POST['sm_form_header'], $allowed ) );

      if( isset( $_POST['sm_form_content'] ) )
        update_post_meta( $post_id, 'sm_form_content', wp_kses( $_POST['sm_form_content'], $allowed ) );

      if( isset( $_POST['sm_form_cta_text'] ) )
        update_post_meta( $post_id, 'sm_form_cta_text', wp_kses( $_POST['sm_form_cta_text'], $allowed ) );

      if( isset( $_POST['sm_form_footer_msg'] ) )
        update_post_meta( $post_id, 'sm_form_footer_msg', wp_kses( $_POST['sm_form_footer_msg'], $allowed ) );

      if( isset( $_POST['smf_form_bg'] ) )
        update_post_meta( $post_id, 'smf_form_bg',$_POST['smf_form_bg'] );

      if( isset( $_POST['smf_cta_bg'] ) )
        update_post_meta( $post_id, 'smf_cta_bg',$_POST['smf_cta_bg'] );

      if( isset( $_POST['smf_content_c'] ) )
        update_post_meta( $post_id, 'smf_content_c',$_POST['smf_content_c'] );

      if( isset( $_POST['smf_cta_c'] ) )
        update_post_meta( $post_id, 'smf_cta_c',$_POST['smf_cta_c'] );

  }

  


include 'ssm_shortcode_gen.php';

include 'ssm_edit_form.php';

include 'ssm_select_form_temp.php';

include 'mail_chimp_meta.php';

include 'subscribers_list.php';

include 'sm_color_settings.php';

include 'ssm_premium_ver.php';
include 'ssm_reating_meta.php';




  ?>