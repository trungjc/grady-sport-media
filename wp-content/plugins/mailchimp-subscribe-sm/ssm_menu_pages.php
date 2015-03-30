<?php

add_action('wp_head','ssm_form_options_set_to_head');
function ssm_form_options_set_to_head(){
 // $option = get_option('some option');

  //SLider 
  $ssm_mailchimp_api_key = get_option('ssm_mailchimp_api_key');
  $ssm_mailchimp_list_id = get_option('ssm_mailchimp_list_id');

}


register_activation_hook(__FILE__,'ssm_subscribe_me_add_options');
function ssm_subscribe_me_add_options() {

	add_option('ssm_mailchimp_api_key','');
	add_option('ssm_mailchimp_list_id','');

}





add_action('admin_init','ssm_forms_register_options');
function ssm_forms_register_options(){
  // register_setting('mpsp_options_group','option');
	register_setting('ssm_form_options_group','ssm_mailchimp_api_key');
	register_setting('ssm_form_options_group','ssm_mailchimp_list_id');

}







add_action('admin_menu','ssm_sub_menus_to_subscribe_me');

function ssm_sub_menus_to_subscribe_me(){

	add_submenu_page( 'edit.php?post_type=subscribe_me_forms', 'MailChimp', 'MailChimp', 'manage_options', 'ssm_mailchimp_menu', 'add_ssm_sub_menu_mailchimp' );
	add_submenu_page( 'edit.php?post_type=subscribe_me_forms', 'Subscribers List', 'DB Subscribers List', 'manage_options', 'ssm_subscribers_list_menu', 'add_ssm_subscribers_list_menu' );
}


function add_ssm_sub_menu_mailchimp(){
	?>
	<h3>Mail Chimp</h3>
	<form method="post" action="options.php">
	      <?php settings_fields( 'ssm_form_options_group' );?>
	      <?php do_settings_sections( 'ssm_form_options_group' );?>
	      Enter MailChimp API Key :
		<p><input type='text' placeholder='Your Mailchimp API Key' name='ssm_mailchimp_api_key' value='<?php echo get_option('ssm_mailchimp_api_key'); ?> ' style='width:400px; height:50px;font-size:19px;' required>
			<br>
			<br>
			Enter MailChimp List ID :
			<br>
			<br>
			<input type='text' name='ssm_mailchimp_list_id' placeholder='Your Mailchimp List ID ' value='<?php echo get_option('ssm_mailchimp_list_id'); ?>' style='width:400px; height:50px;font-size:19px;' required>
		</p>
		<?php submit_button();?>
	</form>
	<?php
}


function add_ssm_subscribers_list_menu(){

/***

	* Page to display and download subscribers list.

***/
	?>
	<div style='padding:50px; margin:0 auto; margin-top:50px; background:#6C7A89;color:#fff;font-family:sans-serif,arial;font-size:17px; width:60%;'>
	<?php

	$lpp_file = include 'sm_subcribers-list.csv'; 

	echo $lpp_file;


	 ?>
</div>
	<a href="<?php echo plugins_url('/subscriber-list-download.php',__FILE__); ?>">DOWNLOAD LIST</a>
	<br>

	<?php
}











 ?>