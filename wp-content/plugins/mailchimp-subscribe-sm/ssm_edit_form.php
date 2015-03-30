<?php



function ssm_form_edit_meta($post){
    // $post is already set, and contains an object: the WordPress post
    global $post;


 //////////////////////////////////////////////////////////////////////////
                                                                        //  
                               //START                                 //
                                                                      //  
                                                                     //
    ///////  MAIN SETTINGS var assign BOX Starts HERE!!! /////////////

    //$example = get_post_meta($post->ID,'example',true);
    $ssm_select_data_save_method = get_post_meta($post->ID,'ssm_select_data_save_method',true);
    ///// Form - 1 Settings  //////////////
    $sm_form_header = get_post_meta($post->ID,'sm_form_header',true);
    $sm_form_content = get_post_meta($post->ID,'sm_form_content',true);
    $sm_form_cta_text = get_post_meta($post->ID,'sm_form_cta_text',true);
    $sm_form_footer_msg = get_post_meta($post->ID,'sm_form_footer_msg',true);
    ///// Form - 1 Ends  ////////////////






    wp_nonce_field( 'my_meta_box_nonce', 'meta_box_nonce' );

    //////////////  Place Holders /////////

    $smfprimary = 'Form Headline Goes Here!';

    $smfcontent = 'Form Content Line Goes Here!';

    $smffooter = 'Put your Security Line Here!';

    $smfcta = 'CTA Text';

    $ssm_editable = 'edit_';

    $sm_action_url = plugins_url('data.php?savedata=1',__FILE__);

    $smf_mailchimp_method = '<form id= "sm_form" action= "#" method= "get" >';
    $smf_database_method  = '<form id="sm_form" action='.$sm_action_url.' method="post" >';


      $ssm_select_form_template_check_empty = get_post_meta( $post->ID,'ssm_select_form_template',true);
      if (!empty($ssm_select_form_template_check_empty)) {
          include ($ssm_editable.get_post_meta( $post->ID,'ssm_select_form_template',true)); 
      }
    ?>
    <br>
    <br>
<p> Where to save Subscribers :
    <select name='ssm_select_data_save_method' required>
      <option value='' >Choose...</option>
      <option disabled value='<?php echo $smf_mailchimp_method ?>' <?php selected($smf_mailchimp_method, $ssm_select_data_save_method); ?> >Mail Chimp</option>
      <option value='<?php echo $smf_database_method ?>' <?php selected($smf_database_method , $ssm_select_data_save_method); ?> >Database</option>
    </select>
  </p>
  <br>
 <a href="http://web-settler.com/mailchimp-subscribe-form/" target='_blank' style='font-size:24px;'id='pr_msg_link'><i>To Unlock MailChimp Click Here</i></a>
  <div style='width:100%;text-align:center; background:#e3e3e3;height:60px;border-left:5px solid #a7d142;'>
   
 <?php submit_button('Update');?>


</div>



    
    <?php







}









?>