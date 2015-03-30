<style type="text/css">


	#top_border{
		width:91%;
		margin: 0 auto;
		height: 5px;
		background: -webkit-linear-gradient(left, #27ae60 0%, #27ae60 20%, #8e44ad 20%, #8e44ad 40%, #3498db 40%, #3498db 60%, #e74c3c 60%, #e74c3c 80%, #f1c40f 80%, #f1c40f 100%);
		background: -moz-linear-gradient(left, #27ae60 0%, #27ae60 20%, #8e44ad 20%, #8e44ad 40%, #3498db 40%, #3498db 60%, #e74c3c 60%, #e74c3c 80%, #f1c40f 80%, #f1c40f 100%);
		background: linear-gradient(left, #27ae60 0%, #27ae60 20%, #8e44ad 20%, #8e44ad 40%, #3498db 40%, #3498db 60%, #e74c3c 60%, #e74c3c 80%, #f1c40f 80%, #f1c40f 100%);
	}
	#sm_wrapper{
		background: #fff;
		width:90%;
		min-width: 230px;
		padding: 5px;
		margin: 0 auto;
		text-align: center;
		box-shadow:15px 15px 0px rgba(0,0,0,.1);
		
	}

	#sm_content{
		
		margin:-16px 0 0 0;
		display: inline-block;
	
	}

	#smtext {
		width: 100%;
		font-family: helvetica,sans-serif;
		padding: 20px 0 35px 0;
		line-height: 1.3;
		text-align: center;

	}
	#sm_form{
		padding: 1% 0 1% 0;
	}
	
	.sm_field{
		width: 65%;
		height: 35px;
		margin-bottom: 2%;
		font-size: 16px;
		background:#f5f5f5;
		border:0;
		padding:20px;
		border:1px solid #eee;
	}
	.sm_submit:hover{
		box-shadow: none;
	}
	.sm_submit{
		height: 55px;
		width: 300px;
		border: none;
		color: #fff;
		font-size: 17px;
		margin-top: 2%;
		margin-left: 30%;
		background:#f26964;
		box-shadow:0px 3px 0px #c1524e;

	}
	#sm_footer{
		background: #fff;
		padding: 1px 0 1px 15px;
		font-family: helvetica,sans-serif;

	}

	.sm_input_field:hover,.sm_input_field:focus{
		border: 2px dashed #727272;
	}





	
</style>
<div id='sm_wrapper'>
	<div id='sm_content'>
	<div id='smtext'> 
		<p style='font-size:22px;margin-bottom:-10px;'><input type='text' name='sm_form_header' value='<?php echo $sm_form_header; ?>' placeholder='Form Headline Goes Here!' class='sm_input_field' style='width:110%; height:40px;font-size:19px;' ></p>
	</div>
	</div>
	<div id='sm_form'>
		<form>
			<p>
				<input disabled type='text' id='sm_input' class='sm_field' name='sm_name' placeholder='Enter Your Name...'  >
				<input disabled type='email' id='sm_input' class='sm_field' name='sm_email' placeholder='Enter Your Email Address...' required >
				<br>
				<div disabled type='submit' id='sm_submit' class='sm_submit'>
					<input type='text' name='sm_form_cta_text' value='<?php echo $sm_form_cta_text; ?>' placeholder='CTA Text' class='sm_input_field' style='width:80%; height:35px;' >
				</div> 

			</p>
		</form>
	</div>
</div>