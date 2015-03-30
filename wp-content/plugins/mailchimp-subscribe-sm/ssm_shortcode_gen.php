<?php



function ssm_shortcode_meta($post){
    // $post is already set, and contains an object: the WordPress post
    global $post;
 //////////////////////////////////////////////////////////////////////////
                                                                        //  
                               //START                                 //
                                                                      //  
                                                                     //
    ///////  MAIN SETTINGS var assign BOX Starts HERE!!! /////////////

    $lpp_fe_template_select = get_post_meta($post->ID,'lpp_fe_template_select',true);

    $postid = $post->ID;

    wp_nonce_field( 'my_meta_box_nonce', 'meta_box_nonce' );

    ?>
    <style type="text/css">
    #ssm_shortcode_meta{
      border-top: 5px solid #A7D476;
    }

    </style>
    <p> Use following Shortcode in your posts or text widget to show form.</p>
    <p style='font-weight:bold; font-size:20px;'> [ssm_form id='<?php echo $postid; ?>']</p>
    

    <?php


 }


add_shortcode( 'ssm_form', 'ssm_form_shortcode' );
function ssm_form_shortcode($atts, $content){
   ob_start();
  
	  extract( shortcode_atts( array(

			'id' => null,

		), $atts ) );

	$post = get_post($id);

   include (get_post_meta( $id,'ssm_select_form_template',true));


   return ob_get_clean();

	

}






?>