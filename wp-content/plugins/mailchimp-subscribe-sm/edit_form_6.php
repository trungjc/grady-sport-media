<style type="text/css">

	body{
		background: #e3e3e3;
	}
	#top_border{
		width:90%;
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

	}
	#sm_form{
		padding: 1% 0 1% 0;
	}
	
	.sm_field{
		width: 65%;
		height: 35px;
		margin-bottom: 2%;
		font-size: 16px;
	}
	.sm_submit:hover{
		background: #4b8bcc;
	}
	.sm_submit{
		height: 55px;
		width: 300px;
		border: none;
		color: #fff;
		margin-left: 30%;
		font-size: 17px;
		margin-top: 2%;



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
		padding: 1px 0 1px 15px;
		font-family: helvetica,sans-serif;

	}
	.sm_input_field:hover,.sm_input_field:focus{
		border: 2px dashed #727272;
	}






	
</style>
<div id='top_border'></div>
<div id='sm_wrapper'>
	<div id='sm_content'>
	<div id='smtext'> 
		<p style='font-size:22px;margin-bottom:-10px;'><input type='text' name='sm_form_header' value='<?php echo $sm_form_header; ?>' placeholder='Form Headline Goes Here!' class='sm_input_field' style='width:150%; height:45px;text-align:center;font-size:18px;margin-left:-25%;' ></p>
	</div>
	</div>
	<div id='sm_form'>
		<form>
			<p>
				<input disabled type='text' id='' class='sm_field' name='' placeholder='Enter Your Name...'  >
				<input disabled type='email' id='' class='sm_field' name='' placeholder='Enter Your Email Address...'  >
				<br>
				<div type='submit' id='sm_submit' class='sm_submit'>
					<input type='text' name='sm_form_cta_text' value='<?php echo $sm_form_cta_text; ?>' placeholder='CTA Text' class='sm_input_field' style='width:90%; height:32px;' >
				</div> 

			</p>
		</form>
	</div>
</div>