$(function(){
	window.scrollTo(0,1);
	truncateParagraph(80);
	
	$('.rmv-dft-val').click(
		function() {
			if (this.value == this.defaultValue) {
				this.value = '';
			}
		}
	);
	$('.rmv-dft-val').blur(
		function() {
			if (this.value == '') {
				this.value = this.defaultValue;
			}
	}
	);

	$("#invite-email").bind('keyup', function() {
		if(validateEmail($(this).val())){
			$('#invite-submit').removeAttr('disabled');
		}else{
			$('#invite-submit').attr('disabled', 'disabled');		
		}
	});

	$('#invite-form').bind('submit', function(e){
    $('.after_submit').hide();
		var params = $(this).serialize();
		var $email = $("#invite-email").val();
		if(validateEmail($email)){
			mpmetrics.register( { email_input : $email} );
			$.ajax({
		    type: "POST",
		    url: $('#invite-form').attr('action'),
		    data: params,
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: function(r){
        },
		    success: function(r) {
		    	r['pass_or_fail'] = 'success';
					inviteSubmit(r);
					console.log('pass', r);
		    },
		    error: function(r){
		    	r['pass_or_fail'] = 'fail';
					inviteSubmit(r);
					console.log('fail', r);
		    }
		  });
		}

	  e.preventDefault();
		return false;
	});
	
	if($('.slide-controller')){
		$.each($('.slide-controller'), function(i, $s){
			var $li = $($s).find('.slidenav li');
			$($li).bind('click', function(e){
				$($s).find('.slidenav li').removeClass('active');
				$(this).addClass('active');
				var n = $($li).index($(this));
				
				var $slides = $($s).find('.slides');
				$slides.find('li').removeClass('active');
				$slides.find('li:eq('+n+')').addClass('active');
				//e.preventDefault();
				//return false;
			});
		});	
	}	
	
	function inviteSubmit(r){
  	$('#invite-form').hide();
  	if(typeof r.reflink != 'undefined' && r.reflink != null){
	    //display message back to user here
	    $('#ref_share .fblike').html('<fb:like href="'+r.reflink+'" send="true" layout="button_count" width="90" show_faces="false" action="recommend"></fb:like>');
	    
	
	    var tweet_text = encodeURIComponent("Want to see the future of video entertainment? Join me for the #nowboxapp launch.");
	    $('#ref_share .tweet').html('<iframe allowtransparency="true" frameborder="0" scrolling="no" src="http://platform.twitter.com/widgets/tweet_button.html?url='+r.reflink+'&via=nowbox&related=fahdoo:Nowbox UX Engineer&text='+tweet_text+'" style="width:130px; height:20px;"></iframe>');
	
	  
	   	$('#ref_share .plusone').html('<g:plusone href="'+r.reflink+'" size="medium"></g:plusone>');
	   	
	   	FB.XFBML.parse(document.getElementById('ref_share'));
	   	gapi.plusone.go(document.getElementById('ref_share'));
	   		
	   	$('#referral_link').val(r.reflink);
	   			      		       
			$('#post_success').show();  	
  	}else{
			$('#post_fail').show();  	
  	}

		
  	if(r.newuser)
      mpmetrics.track('Signed Up', r);	
	}
	
	function validateEmail($email) {
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if( !emailReg.test( $email ) ) {
			return false;
		} else {
			return true;
		}
	}
	
	function truncateParagraph(len){
		var elems = $('.truncateme');
		if (elems) {
			$.each(elems, function(i, p){
				var trunc = p.innerHTML;
			  if (trunc.length > len) {
			
			    /* Truncate the content of the P, then go back to the end of the
			       previous word to ensure that we don't truncate in the middle of
			       a word */
			    trunc = trunc.substring(0, len);
			    trunc = trunc.replace(/\w+$/, '');
			
			    /* Add an ellipses to the end and make it a link that expands
			       the paragraph back to its original size */
			    trunc += '... <a href="#" ' +
			      'onclick="this.parentNode.innerHTML=' +
			      'unescape(\''+escape(p.innerHTML)+'\');return false;">' +
			      '(expand)<\/a>';
			    p.innerHTML = trunc;
			  }
			});
		}	
	}
	
});