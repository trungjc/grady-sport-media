<style type="text/css">


	#sm_wrapper{
		background: #fff;
		width:90%;
		min-width: 230px;
		border-radius: 5px;
		padding: 5px;
		margin: 0 auto;
		border-radius: 10px;
	}
	#sm_top{
		background: #ECEEAD;
		padding: 1px 0 1px 0;
	}
	#sm_top li{
		list-style: url(email-icon.png);
		margin-left: 5%;
		font-family: helvetica,sans-serif;
		font-size: 25px;
		font-weight: bold;
		padding:10px 0 10px 0;
	}
	#sm_content{
		
		margin:-16px 0 0 0;
		
		display: inline-block;
	
	}
	#sm_content img{
		width: 24%;
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

	}
	#sm_form{
		background: #e3e3e3;
		padding: 1% 0 01% 0;
		margin-top: 2%;
		border-top: 1px solid #d0d0d0;
	}
	
	.sm_field{
		width: 60%;
		height: 35px;
		margin-left: 7%;
		margin-bottom: 1%;
		font-size: 16px;
	}
	.sm_submit:hover{
		background: #4b8bcc;
	}
	.sm_submit{
		height: 35px;
		width: 30%;
		border: none;
		color: #fff;
		font-size: 17px;
		margin-left: -2%;



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

<div id='sm_wrapper'>
	<div id='sm_content'>
		<img src="mail.png">
	<div id='smtext'> 
		
			<input type='text' name='sm_form_header' value='<?php echo $sm_form_header; ?>' placeholder='Form Headline Goes Here!' class='sm_input_field' style='width:90%; height:35px;margin:5px 0 20px 0;' >
	
		
			<textarea name='sm_form_content' placeholder='Form Content  Goes Here!' class='sm_input_field' style='width:130%; height:45px; ' ><?php echo $sm_form_content; ?> </textarea>
	
	</div>
	</div>
	<div id='sm_form'>
		<form>
			<p>
				<input type='email' id='sm_input' class='sm_field' name='smf_email' placeholder='Enter Your Email Address...' disabled >
					<input type='text' name='sm_form_cta_text' value='<?php echo $sm_form_cta_text; ?>' placeholder='CTA Text' class='sm_input_field' style='width:20%; height:35px;' >

			</p>
		</form>
	</div>
</div>