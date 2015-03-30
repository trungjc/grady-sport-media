<style type="text/css">


	#sm_wrapper{
		background: #fff;
		border: 1px solid #d0d0d0;
		width:85%;
		min-width: 230px;
		border-radius: 5px;
		padding: 5px;
		margin: 0 auto;
		border-radius: 9.1px;
	}
	#sm_top{
		background: #ECEEAD;
		padding: 1px 0 1px 0;
	}
	#sm_top li{
		margin-left: 5.1%;
		font-family: helvetica,sans-serif;
		font-size: 23px;
		font-weight: bold;
		padding:10px 0 10px 0;
	}
	#sm_content{
		
		display: inline-block;
	
	}
	#sm_content img{
		width: 25.2%;
		height: 90px;
		float: left;
		margin:40px 0 0 5%;
	}
	#smtext {
		float: right;
		width: 60%;

		font-size: 16px;
		font-family: helvetica,sans-serif;
		padding: 15px 5px 10px 5%;
		line-height: 1.6;

	}
	#sm_form_wrapper{
		background: #e3e3e3;
		padding: 1% 0 1% 0;
		border-top: 1px solid #d0d0d0;
	}

	
	.sm_field{
		margin: 0 auto !important;
		padding: 0 !important;
		width: 60%;
		height: 35px;
		margin-left: 6%;
		margin-bottom: 1%;
		font-size: 16px;
	}
	.sm_submit:hover{
		background: #4b8bcc;
	}
	.sm_submit{
		margin: 0 auto !important;
		padding: 0 !important;
		height: 35px !important;
		width: 30% !important;
		border: none !important;
		color: #fff !important;
		font-size: 17.2px !important;
		margin-left: -2% !important;
		background-color: #7abcff !important; 

		background: rgb(122,188,255) !important; /* Old browsers */
		background: -moz-linear-gradient(top,  rgba(122,188,255,1) 0%, rgba(96,171,248,1) 44%, rgba(64,150,238,1) 100%); /* FF3.6+ */
		background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(122,188,255,1)), color-stop(44%,rgba(96,171,248,1)), color-stop(100%,rgba(64,150,238,1))); /* Chrome,Safari4+ */
		background: -webkit-linear-gradient(top,  rgba(122,188,255,1) 0%,rgba(96,171,248,1) 44%,rgba(64,150,238,1) 100%); /* Chrome10+,Safari5.1+ */
		background: -o-linear-gradient(top,  rgba(122,188,255,1) 0%,rgba(96,171,248,1) 44%,rgba(64,150,238,1) 100%); /* Opera 11.10+ */
		background: -ms-linear-gradient(top,  rgba(122,188,255,1) 0%,rgba(96,171,248,1) 44%,rgba(64,150,238,1) 100%); /* IE10+ */
		background: linear-gradient(to bottom,  rgba(122,188,255,1) 0%,rgba(96,171,248,1) 44%,rgba(64,150,238,1) 100%); /* W3C */
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#7abcff', endColorstr='#4096ee',GradientType=0 ); /* IE6-9 */

	}
	#sm_form{
		margin:2% 0 1% 5%;  
	}

	#sm_form > input[type="submit"], 
	#sm_form > input[type="button"]{
		margin: 0 auto !important;
		padding: 0 !important;
		height: 35px !important;
		width: 30% !important;
		border: none !important;
		color: #fff !important;
		font-size: 17px !important;
		margin-left: -2.2% !important;

		background-color: #7abcff !important;
		
	}
	#sm_form > input[type="text"],#sm_form >input[type="email"]{
		margin: 0 auto !important;
		padding: 0 !important;
		width: 60% !important;
		height: 35px !important;
		margin-left: 7% !important;
		margin-bottom: 1% !important;
		font-size: 16px !important; 
	}
	
	#sm_footer{
		background: #fff;
		padding: 1.1px 0 1.1px 15px;
		font-family: helvetica,sans-serif;

	}
	#response{
		font-family: helvetica,sans-serif;
		font-style: italic !important;
		color: #E86850;
	}


	
</style>

<div id='sm_wrapper'>
	<div id='sm_content'>
		<img style='display:none;'  src='<?php echo plugins_url("mail.png",__FILE__); ?>'>
	<div id='smtext'> 
		<p style='font-size:22px;'><?php echo get_post_meta($post->ID,'sm_form_header',true); ?></p>
		<p><?php echo get_post_meta($post->ID,'sm_form_content',true); ?></p>
	</div>
	</div>
	<div id='sm_form_wrapper'>
		<?php echo get_post_meta($post->ID,'ssm_select_data_save_method',true); ?>
			<p>
			<input style='display:none;' type='email' id='sm_name' class='sm_field' name='sm_name' placeholder='Email' required >
			 <input type="submit"  name="submit" value="Subscribe" class="sm_submit" id='sm_submit' />
				 
			</p>
		</form>
	</div>
</div>