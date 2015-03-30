<style type="text/css">

	
	
	#response{
		color: #E86850;
	}






	
</style>

<div id='sm_wrapper'>
	<div id='sm_top'>
	 <div><?php echo get_post_meta($post->ID,'sm_form_header',true); ?></div>		
	</div>
	<div id='sm_content'>
		<p><?php echo get_post_meta($post->ID,'sm_form_content',true); ?></p>
		<?php echo get_post_meta($post->ID,'ssm_select_data_save_method',true); ?>

			 
			  
			
		 <div class="frm-group">
                            <label class="fui-mail" for="input-newsletter">&nbsp;</label>
			 <input type='email'  class='sm_field' name="sm_email" id="sm_email" placeholder='ENTER YOUR EMAIL ADDRESS' required >
                         
                        </div>
                        <div class="form-group pull-left" >
                           <input type="submit"  name="submit" value="SUBSCRIBE" class="sm_submit" id='sm_submit' />
                        </div>	  
		</form>      
	</div>
	<div id='sm_footer'>
		<span id="response">
			<?php require_once('inc/store-address.php'); if($_GET['submit']){ echo storeAddress(); } ?>
    	</span>
		<p><?php echo get_post_meta($post->ID,'sm_form_footer_msg',true); ?></p>
	</div>
</div>
</html>