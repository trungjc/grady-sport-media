<?php

function ssm_select_form_meta($post){
    // $post is already set and contains an object: the WordPress post
    global $post;


 //////////////////////////////////////////////////////////////////////////
                                                                        //  
                               //START                                 //
                                                                      //  
                                                                     //
    ///////  MAIN SETTINGS var assign BOX Starts HERE!!! /////////////

    $ssm_select_form_template = get_post_meta($post->ID,'ssm_select_form_template',true);

    
    wp_nonce_field( 'my_meta_box_nonce', 'meta_box_nonce' );

    ?>

    <style type="text/css">
#lpp_wrapper{
    display: inline-block;
    width: 100%;
}

#lpp_left{
    width: 20%;
    display: inline-block;
    float: left;
    margin-right: 100px;

}
#lpp_right{
    width: 20%;
    display: inline-block;
    float: left;
    
}

#lpp_row_3{
    width: 20%;
    display: inline-block;
    float: left;
    margin-left: 80px;
}


.formLayout_s_l
    {

        
        padding: 10px;
        width: 450px;
        margin: 10px;
        font-size: 20px;
        font-weight:100;
        font-family: verdana;
    }
    
    .formLayout_s_l label 
    {
        display: block;
        margin-bottom: 30px;
        margin-top: 30px;
    }
    .formLayout_s_l input{
        display: block;
        float: left;
        margin-right: 15px;
        margin-left: 10px;


    }
 
    .formLayout_s_l label
    {
        text-align: left;
        display: block;
        font-size: 20px;
        font-family: sans-serif;
        font-weight: 100;
    }
 
    br
    {
        clear: left;
    }

    #submit{
    width: 200px;
    height: 40px;
    margin-top: 8px;
    margin-right: 50px;
    font-size: 19px;

  }
  .lck_span{
    font-size: 9px;
    color: red;
    font-style: italic;
  }

</style>
<div id='lpp_wrapper' class='formLayout_s_l'>
    <h2>Select a Template and click Update</h2>
    <div id='lpp_left'>
            
        Template -1
        <input type="radio" id='lpp_select_template1' name='ssm_select_form_template' value='form_1.php'
        <?php checked( "form_1.php", $ssm_select_form_template); ?>
       checked >
        <label for='lpp_select_template1'>
            <img src="<?php echo plugins_url('form_img_1.png',__FILE__); ?>" style='width:200px;height:110px;' >
        </label>

        Template -4<span class='lck_span'>(Locked)</span>
        <input disabled type="radio" id='lpp_select_template4' name='disabled_ssm_select_form_template' value='form_4.php'
        <?php checked( "form_4.php", $ssm_select_form_template); ?>
        >
        <label for='lpp_select_template4'>
            <img src="<?php echo plugins_url('form_img_4.png',__FILE__); ?>" style='width:200px;height:110px;' >
        </label>

        Template -7<span class='lck_span'>(Locked)</span>
        <input disabled type="radio" id='lpp_select_template7' name='disabled_ssm_select_form_template' value='form_7.php'
        <?php checked( "form_7.php", $ssm_select_form_template); ?>
        >
        <label for='lpp_select_template7'>
            <img src="<?php echo plugins_url('form_img_7.png',__FILE__); ?>" style='width:200px;height:110px;' >
        </label>

 
    </div>
        <div id='lpp_right'>


        Template -2<span class='lck_span'>(Locked)</span>
        <input disabled type="radio" id='lpp_select_template2' name='ssm_select_form_template' value='form_2.php'
        <?php checked( "form_2.php", $ssm_select_form_template); ?>
        >

        <label for='lpp_select_template2'>
            <img src="<?php echo plugins_url('form_img_2.png',__FILE__); ?>" style='width:200px;height:110px;' >
        </label>

        Template -5<span class='lck_span'>(Locked)</span>
        <input disabled type="radio" id='lpp_select_template5' name='disabled_ssm_select_form_template' value='form_5.php'
        <?php checked( "form_5.php", $ssm_select_form_template); ?>
        >
        <label for='lpp_select_template5'>
            <img src="<?php echo plugins_url('form_img_5.png',__FILE__); ?>" style='width:200px;height:110px;' >
        </label>

        Template -8<span class='lck_span'>(Locked)</span>
        <input disabled type="radio" id='lpp_select_template8' name='disabled_ssm_select_form_template' value='form_8.php'
        <?php checked( "form_8.php", $ssm_select_form_template); ?>
        >
        <label for='lpp_select_template8'>
            <img src="<?php echo plugins_url('form_img_8.png',__FILE__); ?>" style='width:200px;height:110px;' >
        </label>

        


</div>
<div id='lpp_row_3'>
    Template -3<span class='lck_span'>(Locked)</span>
        <input disabled type="radio" id='lpp_select_template3' name='disabled_ssm_select_form_template' value='form_3.php'
        <?php checked( "form_3.php", $ssm_select_form_template); ?>
        >

        <label for='lpp_select_template3'>
            <img src="<?php echo plugins_url('form_img_3.png',__FILE__); ?>" style='width:200px;height:110px;' >
        </label>

        Template -6<span class='lck_span'>(Locked)</span>
        <input disabled type="radio" id='lpp_select_template6' name='disabled_ssm_select_form_template' value='form_6.php'
        <?php checked( "form_6.php", $ssm_select_form_template); ?>
        >
        <label for='lpp_select_template6'>
            <img src="<?php echo plugins_url('form_img_6.png',__FILE__); ?>" style='width:200px;height:110px;' >
        </label>

       
</div>
    </div>
<a href="http://web-settler.com/mailchimp-subscribe-form/" target='_blank' style='font-size:24px;'id='pr_msg_link'><i>Unlock All Templates and get more amazing features Click Here</i></a>
<div style='width:100%;text-align:center; background:#e3e3e3;height:60px;border-left:5px solid #a7d142;'>

 <?php submit_button('Update');?>
</div>


    <?php

}

?>