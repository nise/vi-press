

// call from admin panel

jQuery(document).ready(function() {

	var popcorn_url = 'http://127.0.0.1/daily/wp-content/plugins/vi-lab/js/popcorn-maker/index.html';
	$("#dialog").hide();
	$('a#clicka').click(function(e){
		var frame = $('<iframe></iframe>')	
			.attr('src', popcorn_url + '?url=' + $(this).attr('ref') + '&title=' + $(this).text())
			.attr('height', '100%')
			.attr('width', '100%'); 
					
		$("#dialog").append(frame).dialog({height: '650', width: '1000', modal:true, position:['100','40'], zIndex:200000 ,title: $(this).text()});	
		
	});

});


