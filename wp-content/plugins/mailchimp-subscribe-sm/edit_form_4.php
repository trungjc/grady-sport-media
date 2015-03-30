<style type="text/css">

	body{
		background: #e3e3e3;
	}
	#sm_wrapper{
		background: #fff;
		width:90%;
		min-width: 230px;
		padding: 5px;
		margin: 0 auto;
		border-radius: 10px;
	}

	#sm_content{
		
		margin:-16.2px 0 0 0;
		border-bottom: 1px solid #d0d0d0;
		display: inline-block;
	
	}

	#smtext {
		width: 100%;
		font-family: helvetica,sans-serif;
		padding: 10px 0 25px 5%;
		line-height: 1.3;

	}
	#sm_form{
		background: #e3e3e3;
		padding: 1.1% 0 1% 0;
	}
	
	.sm_field{
		width: 65%;
		height: 35px;
		margin-left: 5.4%;
		margin-bottom: 1%;
		font-size: 16px;
	}
	.sm_submit:hover{
		background: #4b8bcc;
	}
	.sm_submit{
		margin-left: 5%;
		height: 35px;
		width: 20%;
		border: none;
		margin-left: -5%;
		color: #fff;
		font-size: 17px;



		background: rgb(122,188,255); /* Old browsers */
		background: -moz-linear-gradient(top,  rgba(122,188,255,1) 0%, rgba(96,171,248,1) 44%, rgba(64,150,238,1) 100%); /* FF3.6+ */
		background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(122,188,255,1)), color-stop(44%,rgba(96,171,248,1)), color-stop(100%,rgba(64,150,238,1))); /* Chrome,Safari4+ */
		background: -webkit-linear-gradient(top,  rgba(122,188,255,1) 0%,rgba(96,171,248,1) 44%,rgba(64,150,238,1) 100%); /* Chrome10+,Safari5.1+ */
		background: -o-linear-gradient(top,  rgba(122,188,255,1) 0%,rgba(96,171,248,1) 44%,rgba(64,150,238,1) 100%); /* Opera 11.10+ */
		background: -ms-linear-gradient(top,  rgba(122,188,255,1) 0%,rgba(96,171,248,1) 44%,rgba(64,150,238,1) 100%); /* IE10+ */
		background: linear-gradient(to bottom,  rgba(122,188,255,1) 0%,rgba(96,171,248,1) 44%,rgba(64,150,238,1) 100%); /* W3C */
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#7abcff', endColorstr='#4096ee',GradientType=0 ); /* IE6-9 */

	}
	#sm_footer{
		background: #fff;
		padding: 1px 0 1px 14px;
		font-family: helvetica,sans-serif;

	}






	
</style>

<div id='sm_wrapper'>
	<div id='sm_content'>
	<div id='smtext'> 
		<p style='font-size:22px;margin-bottom:-10px;'>
			<textarea name='sm_form_content' placeholder='Form Content  Goes Here!' class='sm_input_field' style='width:250%; height:45px; ' ><?php echo $sm_form_content; ?> </textarea>
		</p>
	</div>
	</div>
	<div id='sm_form'>
		<form>
			<p>
				<input disabled type='email' id='sm_input' class='sm_field' name='sm_email' placeholder='Enter Your Email Address...' required >
					<input type='text' name='sm_form_cta_text' value='<?php echo $sm_form_cta_text; ?>' placeholder='CTA Text' class='sm_input_field' style='width:20%; height:35px;' >

			</p>
		</form>
	</div>
</div>