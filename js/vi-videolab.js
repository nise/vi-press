/*

to do:
- commentar: antwort
- ass: punkte zählen/ stats => via stats?
- ass: zu nahe fragen funktionieren nicht
- ass: editieren der Zeit via 'edit'
- ass: MC-Fragen
- vereinheitlichung der widget in vi-two settings

- toc edit / delete / verschieben
- add Hyperlink


- convertierung von popcorn auf IWRM-ähnliche seite 
--- automatische Verlinkung via tags

- Definition eines WP-templates statt der umständlichen theme-Anpassungen


NiceToHave
- editieren der toc?
- popcorn plugin für assessment.
- screencast, tagesschau-beispiel...
- aquire widget-names from vi2.main
- popcorn-plugin en-/disable via Widget Editor (??? Wie soll das gehen)
- add links > IWRM

-- placholder @ videoplayer in css einbinden


Admin:
- Metadaten in popcorn einpflegen >> IWRM
- define selector for flexible theme adoption
- video upload via firefogg? 



*/

var $ = jQuery;

/** class Vi-LabAdmin **/
var ViLabAdmin = $.inherit({

  	__constructor : function(wp_url) { 
  		var _this = this;
  		var popcorn_url = wp_url + '/wp-content/plugins/vi-lab/js/popcorn-maker/index.html';
			$("#dialog").hide(); 
			
			// create new popcorn annotations
			$('a#create-annotation').click(function(e){ 
				var frame = $('<iframe></iframe>')	
					.attr('src', popcorn_url + '?video_url=' + $(this).attr('ref') + '&title=' + $(this).attr('title'))
					.attr('height', '600')
					.attr('width', '100%');
					
	
				$("#dialog").html(frame).dialog({
					height: '650', 
					width: '1000', 
					modal:true, 
					draggable: false,
					closeOnEscape: true,
					resizable: false,
					title: $(this).attr('title'),
					position:['100',0], 
					colseText:'x',
					zIndex:200000
				});	
			});
			
			// edit existing annotations
			$('a#edit-annotation').click(function(e){  
				var frame = $('<iframe></iframe>')	
					.attr('src', popcorn_url + '?post_id=' + String($(this).attr('class')).replace('post-',''))
					.attr('height', '100%')
					.attr('width', '100%'); 
	
				$("#dialog").html(frame).dialog({
			height: '650', 
					width: '1000', 
					modal:true, 
					draggable: false,
					closeOnEscape: true,
					resizable: false,
					title: $(this).attr('title'),
					position:['100',0], 
					zIndex:200000
				});	
			});
			
			this.buildWidgetEditor();
	},
	
	// static hack, information should be aquired from vi2.main
	widgets : {
		status: 'ok', 
		widgets: [
			{name: 'toc'},
			{name: 'tags'}, 
			{name: 'xlink'},
			{name: 'comments'},
			{name: 'slides'}, 
			{name: 'assessment'}
		],
		i:0,
		instructions : [
			{title: 'willkommen', content: 'blas', sel:0},
			{title: 'ommen', content: 'corlortes', sel:1},
			{title: 'Öffnung', content: 'corlortes', sel:1},
			{title: 'Öffnung', content: 'corlortes', sel:1}
		]
	},

		
	/*  .. */
	buildWidgetEditor : function(widgets){		
		var _this = this;
		// build table
		$('.widget-form-table').setTemplate($('#widget-editor-tpl').val()).processTemplate(this.widgets);
		$('.script-form-table').setTemplate($('#script-editor-tpl').html()).processTemplate(this.widgets);
		
		
		// set table values via ajax call
		var data = { action: 'get_widget_options' };
		// call
		$.post(ajaxurl, data, function(res) {
			res = JSON.parse(res.split('!!!!')[1]);
			
			$.each(_this.widgets.widgets, function(i, widget){ 
				$('input#widget-'+widget.name).attr('checked', res[widget.name+'_enabled'] ? 'checked' : false);
				$('input#widget-'+widget.name+'-app-panel1').attr('checked', res[widget.name+'_app_panel1'] ? 'checked' : false);
				$('input#widget-'+widget.name+'-app-panel2').attr('checked', res[widget.name+'_app_panel2'] ? 'checked' : false);
			 	$('input#widget-'+widget.name+'-app-accordion').attr('checked', res[widget.name+'_app_accordion'] ? 'checked' : false);
				$('input#widget-'+widget.name+'-app-timeline').attr('checked', res[widget.name+'_app_timeline'] ? 'checked' : false);
				$('input#widget-'+widget.name+'-ann-popcorn').attr('checked', res[widget.name+'_ann_popcorn'] ? 'checked' : false);
				$('input#widget-'+widget.name+'-ann-player').attr('checked', res[widget.name+'_ann_player'] ? 'checked' : false);
			});	//$('.widget-form-table').find('#'+widget.name+'-row').addClass('inactive');
			
			var ii = 1;
			$.each(res, function(i, ins){ 
				if(i.substr(0,18) == 'instruction_title_'){   
					$('#instruction'+ii).val(res['instruction_'+ii]);
					$('#instructiontitle'+ii).attr('value',res['instruction_title_'+ii]); 
					if(res['current_phase'] == ii){ 
						$('#instructioncurrent'+(ii-1)).attr('checked',true); // strange hack
					}else{
						//$('#instructioncurrent'+ii).attr('checked',false);
					}
					ii++;
				}
			});
				
		});	
	},
		
	

});// end class













/** class Vi-Lab **/ 
var ViLab = $.inherit({

  __constructor : function(wp_url, post_id, player_selector, wp_user, site_name) { 
  		this.wp_url = wp_url; 
  		this.site_name = site_name;
  		this.post_id = post_id;
  		this.player_selector = player_selector;
  		this.wp_user = wp_user;
  		this.ajaxurl = wp_url+'wp-admin/admin-ajax.php'; 
  		
  		var _this = this;
  		this.viLog = new Log({path: this.wp_url+this.plugin_dir, prefix:'[wp_site:'+site_name+', wp_post:'+this.post_id+', user:'+this.wp_user+']'}); 
  		$(this).bind('log', function(e, msg){ _this.viLog.add(msg); });
  		this.init();
  	
  },
  	

  json : '',
  viLog : '',
  wp_user : '',
 	author : '',
 	title : '',
  source_selector : '#vi2',
  player_selector : '#pages',
  video_source : '',
  site_name : 'null',
  post_id : 0, // http://127.0.0.1/daily/wp-content/plugins/video-lab/vi-two_template.html
  wp_url : '',
  wp_user : '',
  plugin_dir : 'wp-content/plugins/vi-lab/',
  // static hack, information should be aquired from vi2.main // xxx
	widgets : {
		test:'bam', 
		widgets: [
			{name:'tags'}, 
			{name:'toc'},
			{name: 'xlink'},
			{name: 'comments'},
			{name: 'slides'},
			{name: 'assessment'}
		]
	},
	ajaxurl : '',
	

  	/**/
  	init : function(){
  		
  	
	  	var _this = this; 
	  	// add vi-two template
	  	$.ajax({
  			url: _this.wp_url + _this.plugin_dir +'vi-two_template.html',
 				success: function(el){ 
		  		$(_this.player_selector).replaceWith(el);
		  		
		  		// get custom field data (popcorn json) 
  				//http://127.0.0.1/daily/api/get_post/?id=3914&custom_fields=popcorn
					$.get(_this.wp_url + '', {json:'get_post', id:_this.post_id, custom_fields: 'popcorn'}, function(res){  
		
						if(res.status == "ok"){ 
							
							_this.author = res.post.author.firstname || res.post.author.firstname ? res.post.author.firstname + ' ' +res.post.author.lastname : '';
						//	alert(res.post.custom_fields.popcorn)
							if(res.post.custom_fields.popcorn == undefined){
								return;
							}
							$('#primary').hide();//$('#comments').hide();
  						$('footer').hide();
  						$('#searchform').remove();
  						$('#site-description').html(this.wp_user);
  						$('p.yd_linkware').remove();
  						$('nav').html('');//#access > .menu
							_this.title = res.post.title;
							_this.json = res.post.custom_fields.popcorn;  
							_this.parsePopcorn(_this.json);
							
						}else{ 
							main.log('[error:vi-videolab.js/, fn:init]'); //alert('not OK');
						}
					});

		  	},
		  	error: function(){ 
		  		main.log('[error:vi-videolab.js/, fn:init, post_id:'+_this.post_id+']'); //alert(this.url+'_err: '+_this.post_id); 
		  	},
 			 	dataType: 'text'
			});
					  
  	},
  	
 
  	
		/* -- */
		// converts popcorn json into HTML DOM, that can be understood by vi2
		parsePopcorn : function(json){  
			var _this = this;
			// clean up DOM
			$(this.source_selector).find('div').each(function(i, val){ 
  			if($(val).attr('type') != 'video' ){ 
  				//$(val).remove(); 
  			}	
  		}); 
			var has_parallel_media = false;
			try {
				json = JSON.parse(json); 
			} catch(err) { 	
				main.log('[error:vi-videolab.js/, fn:parsePopcorn, type:json-convert]');
			} 
			this.video_source = json.project.media[0].url;  
			var element = $('<div></div>')
				.text(this.video_source)
				.attr('id', 'my video')
				.attr('type', 'video')
				.attr('starttime', 0)
				.attr('duration', 100);	
			$(_this.source_selector).html(element); 
			
			

			//
			$.each(json.project.media, function(i, media){ 
				$.each(media.tracks, function(j, tracks){    
    			$.each(tracks.trackEvents, function(k, el){    
    				switch(el.type){
    					case 'pop' :  // links
    						var element = $('<div></div>')
    							.attr('id', decodeURIComponent(el.popcornOptions.text)) 
    							.attr('type','xlink')
    							.attr('starttime', el.popcornOptions.start)
    							.attr('duration', el.popcornOptions.end)
    							.attr('posx', el.popcornOptions.left)
    							.attr('posy', el.popcornOptions.top);
  						$(_this.source_selector).append(element);
  						break;
    		
    				case 'image' : // <div id= type=seq starttime=0 duration=33.91755489336493 seek=0 duration2=0>seidel1/iwrm_seidel1-0.jpg</div>
	    				has_parallel_media = true; 
	    				var element = $('<div></div>')
    						.attr('id', decodeURIComponent(el.popcornOptions.text))
    						.attr('type','seq')
    						.attr('starttime', el.popcornOptions.start)
    						.attr('seek',0)
    						.attr('duration', el.popcornOptions.end)
    						.html(el.popcornOptions.src);
  						$(_this.source_selector).append(element);
  						break;
  					case 'toc' : //<div type="toc" author="nise" date="2013-01-03 13:01:46" starttime="16.88">tocc</div>  
								
								var element = $('<div></div>')  
    						//.attr('id', el.popcornOptions.text)
    						.attr('type','toc')
    						.attr('starttime', el.popcornOptions.start)
    						.attr('author', el.popcornOptions.author)
    						.attr('date', el.popcornOptions.date)
    						.html(decodeURIComponent(el.popcornOptions.toc));
  						$(_this.source_selector).append(element);
  						break;
  					case 'tag' : // <div type="tags" author="nise" date="2013-01-03 20:43:26" starttime="0">kex</div>
  							
  							var element = $('<div></div>')
//    						.attr('id', el.popcornOptions.start)
    						.attr('type','tags')
    						.attr('starttime', el.popcornOptions.start)
    						.attr('author', el.popcornOptions.author != undefined ? el.popcornOptions.author : "000")
    						.attr('date', el.popcornOptions.date != undefined ? el.popcornOptions.date : "000" )
    						.html(decodeURIComponent(el.popcornOptions.tag)); 
  						$(_this.source_selector).append(element);
  						break;
  					case 'comment' : // <div type="comment" author="nise" date="2013-01-03 12:46:03" starttime="15.32">hello world</div>
  					
  						var element = $('<div></div>')
    						//.attr('id', el.popcornOptions.comment)
    						.attr('type','comment')
    						.attr('starttime', el.popcornOptions.start)
    						.attr('author', el.popcornOptions.author)
    						.attr('date', el.popcornOptions.date)
    						.html(decodeURIComponent(el.popcornOptions.comment))
    						.appendTo(_this.source_selector); 
    					break;
  					case 'question' :  
  						var element = $('<div></div>')
    						//.attr('id', el.popcornOptions.comment)
    						.attr('type','question')
    						.attr('starttime', el.popcornOptions.start)
    						.attr('author', el.popcornOptions.author)
    						.attr('date', el.popcornOptions.date)
    						.html(decodeURIComponent(el.popcornOptions.question))
    						.appendTo(_this.source_selector); 
  						break;
  						
  					default :	 break; 
    			}
    		});	
    	});
   	}); 

  this.setupVideo(has_parallel_media);
  }, 
  
  
  /* -- */
  savePopcorn : function(popcorn_json){
  	var _this = this;
  	// vi-two DOM to popcorn_json
  	var popcorn_json = this.vitwo2popcorn(this.source_selector); 
  	// save to WP
  	$.get(_this.wp_url + '', {json:'get_nonce', method:'create_post', controller:'posts', id:_this.post_id}, function(res){ 
        $.post(_this.wp_url + '', {json:'create_post', nonce: res.nonce, title:_this.title, status:'publish', id: _this.post_id, 'custom_fields[]': ['popcorn', popcorn_json] }, function(res2){
          //alert(res2.post.id+'____-'+res2.post.custom_fields['popcorn']);	
        });
    });
  
  },
  
  
  /* -- 
<div id="my video" type="video" starttime="0" duration="100">http://127.0.0.1/daily/wp-content/uploads/2012/11/Standard-Projekt.webm</div>
<div id="" type="xlink" starttime="0" duration="70.08888562434417" posx="50%" posy="50%"></div>
<div id="" type="seq" starttime="132.82974291710389" seek="0" duration="197.8315320041973">http://127.0.0.1/elearning/vi2/_attachments/slides/seidel1/iwrm_seidel1-3.jpg</div>
<div type="comment" author="nise" date="2013-01-03 12:46:03" starttime="15.32">hello world</div>
<div type="toc" author="nise" date="2013-01-03 13:01:46" starttime="16.88">tocc</div>
<div type="tags" author="nise" date="2013-01-03 20:43:26" starttime="0">kex</div>
  
  */
  vitwo2popcorn : function(dom){
  	var json = '{"template":"basic","title":"'+this.title+'","guid":"AA41AB3B-D145-477E-A264-3B42701F1E85", "project": {"targets":[{"id":0,"name":"Area1"},{"id":1,"name":"pop-container"}],"media":[ {"id":"Media0","name":"Media01327337635028","url":"'+this.video_source+'","target":"main","duration":4829.205,"tracks":[';
		var track_tags_1 = '', track_tags_2 = '', track_toc_1 = '', track_toc_2 = '', track_comments_1 = '', track_comments_2 = '', track_questions_1 = '', track_questions_2 = ''; 		
		
		// fetch tags
		$(dom).find("div[type='tags']").each(function(i, val){ 
			if(i % 2 == 0 ){
				track_tags_1 += '{"id":"TrackEvent'+i+'","type":"tag","popcornOptions": {"start":'+$(this).attr('starttime')+',"end":'+(Number($(this).attr('starttime'))+10)+',"tag":"'+encodeURIComponent($(this).text())+'", "date":"'+$(this).attr('date')+'", "author":"'+$(this).attr('author')+'", "target":"Area1"}, "track":"Track_tags_1","name":"Track1327337639'+Math.ceil(Math.random()*1000)+'"},';		
			}else{
				track_tags_2 += '{"id":"TrackEvent'+i+'","type":"tag","popcornOptions": {"start":'+$(this).attr('starttime')+',"end":'+(Number($(this).attr('starttime'))+10)+',"tag":"'+encodeURIComponent($(this).text())+'", "date":"'+$(this).attr('date')+'", "author":"'+$(this).attr('author')+'", "target":"Area1"}, "track":"Track_tags_2","name":"Track1327337639'+Math.ceil(Math.random()*1000)+'"},';		
			}
		}); 

		// fetch toc
		$(dom).find("div[type='toc']").each(function(i, val){
			if(i % 2 == 0 ){
				track_toc_1 += '{"id":"TrackEvent'+i+'","type":"toc","popcornOptions": {"start":'+$(this).attr('starttime')+',"end":'+(Number($(this).attr('starttime'))+10)+',"toc":"'+encodeURIComponent($(this).text())+'", "date":"'+$(this).attr('date')+'", "author":"'+$(this).attr('author')+'", "target":"Area1"}, "track":"Track_toc_1","name":"Track1327337639'+Math.ceil(Math.random()*1000)+'"},';		
			}else{
				track_toc_2 += '{"id":"TrackEvent'+i+'","type":"toc","popcornOptions": {"start":'+$(this).attr('starttime')+',"end":'+(Number($(this).attr('starttime'))+10)+',"toc":"'+encodeURIComponent($(this).text())+'", "date":"'+$(this).attr('date')+'", "author":"'+$(this).attr('author')+'", "target":"Area1"}, "track":"Track_toc_2","name":"Track1327337639'+Math.ceil(Math.random()*1000)+'"},';		
			}
		});
		
		// fetch comments
		$(dom).find("div[type='comment']").each(function(i, val){
			if(i % 2 == 0 ){
				track_comments_1 += '{"id":"TrackEvent'+i+'","type":"comment","popcornOptions": {"start":'+$(this).attr('starttime')+',"end":'+(Number($(this).attr('starttime'))+10)+', "comment":"'+encodeURIComponent($(this).text())+'", "date":"'+$(this).attr('date')+'", "author":"'+$(this).attr('author')+'", "target":"Area1"}, "track":"Track_comments_1","name":"Track1327337639'+Math.ceil(Math.random()*1000)+'"},';		
			}else{
				track_comments_2 += '{"id":"TrackEvent'+i+'","type":"comment","popcornOptions": {"start":'+$(this).attr('starttime')+',"end":'+(Number($(this).attr('starttime'))+10)+',"comment":"'+encodeURIComponent($(this).text())+'", "date":"'+$(this).attr('date')+'", "author":"'+$(this).attr('author')+'", "target":"Area1"}, "track":"Track_comments_2","name":"Track1327337639'+Math.ceil(Math.random()*1000)+'"},';		
			}
		});
		
		// fetch question
		$(dom).find("div[type='question']").each(function(i, val){
			if(i % 2 == 0 ){
				track_questions_1 += '{"id":"TrackEvent'+i+'","type":"question","popcornOptions": {"start":'+$(this).attr('starttime')+',"end":'+(Number($(this).attr('starttime'))+10)+', "question":"'+encodeURIComponent($(this).text())+'", "date":"'+$(this).attr('date')+'", "author":"'+$(this).attr('author')+'", "target":"Area1"}, "track":"Track_comments_1","name":"Track1327337639'+Math.ceil(Math.random()*1000)+'"},';		
			}else{
				track_questions_2 += '{"id":"TrackEvent'+i+'","type":"question","popcornOptions": {"start":'+$(this).attr('starttime')+',"end":'+(Number($(this).attr('starttime'))+10)+',"question":"'+encodeURIComponent($(this).text())+'", "date":"'+$(this).attr('date')+'", "author":"'+$(this).attr('author')+'", "target":"Area1"}, "track":"Track_comments_2","name":"Track1327337639'+Math.ceil(Math.random()*1000)+'"},';		
			}
		});
		
		json += '{"name":"Track_tags_1","id":"Track0", "trackEvents":['+track_tags_1.substr(0, track_tags_1.length -1)+']},';
		json += '{"name":"Track_tags_2","id":"Track1", "trackEvents":['+track_tags_2.substr(0, track_tags_2.length -1)+']},';
		json += '{"name":"Track_toc_1","id":"Track2", "trackEvents":['+track_toc_1.substr(0, track_toc_1.length -1)+']},';
		json += '{"name":"Track_toc_2","id":"Track3", "trackEvents":['+track_toc_2.substr(0, track_toc_2.length -1)+']},';
		json += '{"name":"Track_comments_1","id":"Track4", "trackEvents":['+track_comments_1.substr(0, track_comments_1.length -1)+']},';
		json += '{"name":"Track_comments_2","id":"Track5", "trackEvents":['+track_comments_2.substr(0, track_comments_2.length -1)+']},';
		json += '{"name":"Track_questions_1","id":"Track6", "trackEvents":['+track_questions_1.substr(0, track_questions_1.length -1)+']},';
		json += '{"name":"Track_questions_2","id":"Track7", "trackEvents":['+track_questions_2.substr(0, track_questions_2.length -1)+']}'; 
		// closing
		json += ']}]}}';
		
		//json = JSON.parse(json);
		

		return json;
  },  
  
  
  /* setup video*/ // todo: simplify!
  setupVideo : function(has_parallel_media){ 
  	var _this = this;
  
		// attach widgets that are enabled
		var data = { action: 'get_widget_options' };   
		// call   
		$.post(this.ajaxurl, data, function(res) {    
			if (res == -1){
				var err = new Error('You are not logged in to Wordpress.'); 
				return;
			}
			res = JSON.parse(res.split('!!!!')[1]);

			main = new Main({
				selector :  !((res['slides_enabled'] == 1)  && has_parallel_media) ? '#seq' : '#screen',
				videoWidth: (res['slides_enabled'] == 1) && has_parallel_media ? 280 : 620,  // video größe hängt nicht von den angeschalteten widgets, sondern von den anotierten ressourcen ab
				videoHeight: (res['slides_enabled'] == 1)  && has_parallel_media ? 158 : 450, 
				markupType:'html',  	
				theme:'simpledark', 
				childtheme:'iwasbasicwhite'
			});
			main.addWidget(_this.viLog);
			metadataa = new Metadata({author:_this.author, title:_this.title});
			_this.addEdit_btn(); 
			
			$.each(_this.widgets.widgets, function(i, widget){ 
				if(res[widget.name+'_enabled']){
					widget.options = {};
					widget.options.accordion = res[widget.name+'_app_accordion'];
					widget.options.slides = ! ((res['slides_enabled'] == 1)  && has_parallel_media ); 
					// prepare annotation dialogs	
					if(res[widget.name+'_ann_player']){
						switch(widget.name){ // args: type, dialog label, short icon name
							case 'comments' : _this.prepareDialog('comment', 'Kommentar hinzufügen', '+ Kommentar');  break;
							case 'tags' : _this.prepareDialog('tags', 'Schlüsselwort hinzufügen', '+ Tag'); break;
							case 'toc' : _this.prepareDialog('toc', 'Kapitel hinzufügen', '+ Kapitel'); break;
							case 'assessment' : _this.prepareDialog('question', 'Frage hinzufügen', '+ Frage'); break;
						}
					}
					
					//
					_this.enableWidget(widget.name, widget.options);
				}	
			});
			
			main.parse(_this.source_selector,'html'); 			
			
			// set instruction menu
			var tab = $('<ul></ul>');//
			var tab_content = $('<div></div>')
				.attr('id', 'tabs')
				.prependTo('hgroup')
				.append(tab);
			
			var ii = 1;
			var current = -1;
			$.each(res, function(i, ins){ 
				if(i.substr(0,18) == 'instruction_title_'){
					tab.append('<li><a href="#instab'+ii+'">'+res['instruction_title_'+ii]+'</a></li>');  
					tab_content.append($('<div></div>').attr('id', 'instab'+ii).html(res['instruction_'+ii])); // 
					
					ii++;
				}
			});			
			tab_content.tabs();
			tab_content.tabs('select', res['current_phase']); 
			tab_content.find('ul li').each(function(i, val){
				if(i >= current){  // xxx bug
					//tab_content.tabs("disable", i)
				}			
			});
			
			// misc configurations	
  		$('#accordion').accordion({
  			autoHeight: true, 
  			collapsible: false, 
  			fillSpace: true, 
  			change: function( event, ui ) { //alert(2)
 		 			_this.enableEditing('question');
  			} 
  		});
  		
		});
		
		// get other accessible blogs of current user
		$.post(this.ajaxurl, { action: 'get_blogs_of_user' }, function(res) { //alert(res)
			//[{"blogname":"daily","siteurl":"http:\/\/127.0.0.1\/daily","posttitle":null,"posturl":null},
			//{"blogname":"bam","siteurl":"http:\/\/127.0.0.1\/daily\/bam","posttitle":"Hello world!","posturl":"http:\/\/127.0.0.1\/daily\/bam\/?p=1"}]
			var json = JSON.parse(res);
			var el = $('<div></div>')
				//.html('<strong>Andere Videos: </strong>')
				.addClass('ui-menu');
			$.each(json, function(i, val){ 
				// if post exists and its a post on a other site
				if(val.posttitle != null && val.blogname != _this.site_name){
					var link = $('<a></a>')
						.addClass('blog-list')
						.attr('href', val.posturl) // +'2013/01/15/hello-world/'
						.html(val.posttitle)
						.tooltip({delay: 0, showURL: false, bodyHandler: function() { return $('<span></span>').text('Bearbeitet durch: '+val.blogname);} });
					el.append(link)
						.appendTo($('nav'));
				}
			});
			$('#access .blog-list').tsort();
		}); 
  },
  
  
  /* ... */
  // distinguish different input methods beside textarea :: tags, question/answers
  prepareDialog : function(type, label, short_name){ 
  	var _this = this;
  	var selector = $('<div></div>').attr('id','annotation-dialog-'+type);
  	var addComment =	$('<div></div>')
  		.addClass('icon-add-'+type)
  		.addClass('annotation-add')
  		.text(short_name)
  		.button()
  		.tooltip({delay: 0, showURL: false, bodyHandler: function() { return $('<span></span>').text(label);} })
			.click(function(){ 
					selector.dialog('open');
			});	
		
		//$('.vi2-btn-box').append(addComment);
		$('#meta').append(addComment);
		
		// complex form to enter (MC-)question and answers
  	var form = type != 'question' ? $('<textarea></textarea>').attr('id', 'annotionContent') : function(){
  		var question = $('<textarea></textarea>').attr('id', 'annotionQuestion');
  		var answer_box = $('<div></div>');
  		var ii = 0;
  		var add = $('<div></div>').button().text('add answer').click(function(){
  			var rm = $('<span></span>').button().text('x').click(function(){ 
  				$(this).parent().remove();
  			})
  			var answ = $('<div></div>')
  				.attr('id', 'answ'+Math.ceil(Math.random()*100))
  				.addClass('answer')
  				.append('<input type="radio" name="quest" value="1" />')
  				.append('<input type="text" value=""/>')
  				.append(rm)
  				.append('<br/>');
  			var height = Number(selector.dialog( "option", "height")); 
  			selector.dialog( "option", "height", (height+25));
  			ii++;
  			answer_box.append(answ);
  		});
  		return $('<div></div>')
  			.addClass('questionanswers')
  			.append(question)
  			.append(answer_box)
  			.append(add);
  	};
  	selector
			.html(form)
			.appendTo('#screen')
			.dialog({
					autoOpen: false,
					height: '200', 
					width: '300', 
					modal:true, 
					draggable: false,
					open : function(){
						main.player.pause();
					},
					buttons : {
						"save" : function(){  
							_this.saveDialog(type, main.player.currentTime(), form, undefined);	// dialog, type, time, form	
							$(this).dialog("close");			
						}
					},
					closeOnEscape: true,
					resizable: false,
					title: label,// + ' to ' + $(this).attr('title'),
					//position:['100',0], 
					colseText:'x',
					zIndex:200000						
			}); 
  },
  
  
  /* -- */
  saveDialog: function(type, time, form, replaceAnnotation){
  	var _this = this;
  	var data = {};
		data.time = time; 
		//				
		if(type == 'question'){  	
			var o = {};
			o.question = $('#annotionQuestion').val();
			o.answ = []; 
			$('.questionanswers').find('div.answer').each(function(i, val){
				if($(this).find("input[name='quest']:checked").val() == 1){ 
					o.correct = $(this).attr('id');
				}
				o.answ.push({id: $(this).attr('id'), answ: $(this).find("input[type='text']").val() });
			});
			data.content = JSON.stringify(o); //alert(encodeURIComponent(data.content));
		}else{
			data.content = form.val();
		}
		// validation					
		if (data.content.length > 0){   
			// add to DOM
			var element = '';
			if(replaceAnnotation != undefined){
				$('#vi2').find('[date='+replaceAnnotation+']').text(data.content);
			}else{
				element = $('<div></div>')
    		//.attr('id', el.popcornOptions.text)
    		.attr('type', type)
    		.attr('starttime', data.time)
    		//.attr('duration', 10)
    		.attr('author', _this.wp_user)
    		.attr('date', new Date().getTime()) // time in ms
    		.html(data.content)
    		.appendTo(_this.source_selector);
    	}	
			// save to popcorn / WP
			_this.savePopcorn();					
			// update player
  		main.updateAnnotation(); // reparse DOM
			main.log('[call:add_annotation, content:'+data.content+', time:'+data.time+']');
			main.player.play(); // restart playback
		
		}else{
			main.player.play();									
		}		
		
  },
  
  	
	/* build player dialog by widget definitions */
	enableWidget : function(widget_name, options){
		var widget = '';
		var title = widget_name;
		// invoke widgets
		switch(widget_name){
			case "slides" : 
				widget = new Seq({selector: widget_name, vizOnTimeline: false, controls: false, path : ''});//, placeholder: 'slides/'+stream+'/'+stream+'_00001.jpg'}); 
				break;
			case "tags" : 
				widget = new TemporalTagging({vizOnTimeline: true, max:20}, {}); // sort:'freq'
				title = 'Schlüsselworte (tags)';    
				break;
			case "toc" : 
				widget = new TOC({vizOnTimeline: true});
				title = 'Kapitelmarken'; 
				break
			case "xlink" :		
				widget = new XLink({target_selector:'#seq', vizOnTimeline: true, minDuration:'5'});
				break;	
			case "comments" : 
				widget = new Comments();
				title = 'Kommentare';
				break;
			case "assessment" : 
				widget = new Assessment();
				title = 'Testfragen';
									
				break;	
			default : return;			
		}
		// add it
		main.addWidget(widget);
		
		// add accordion elements
		if(options.accordion){ 
			$('#accordion').append('<h3><a href="#">' + title + '</a></h3><div id="' + widget_name + '"></div>');
		}	    			// <span class="add">+</span>
	},
	
	
	/* -- */
	enableEditing : function(ttype){ //alert(2)
		var _this = this;
		// 
		if($('ul.assessmentlist').find('a.accordion-annotation-edit').length > 0 ){
			return;
		}
		$('ul.assessmentlist').find('li').each(function(i, val){ 
			 
			var btn = $('<a></a>')
				.addClass('accordion-annotation-edit')
				.text('edit')
				.button()
				.click(function(){
					var id = $(val).find('a').attr('class').replace('id-', '');
					var selector = $('#annotation-dialog-question');
					
					selector.dialog('open'); // {"question":"bim","answ":[{"id":"answ0","answ":"he"},{"id":"answ1","answ":"ho"}],"correct":"answ0"}
					//alert($('#vi2').find('[date='+id+']').text());
					
					var t = function(json){ 
						//add question
  					var question = $('<textarea></textarea>').attr('id', 'annotionQuestion').val(json.question);
  					var answer_box = $('<div></div>');
  					var ii = 0;
  					var add = $('<div></div>').button().text('add answer').click(function(){
  						var rm = $('<span></span>').button().text('x').click(function(){ 
  							$(this).parent().remove();
  						});
  						var answ = $('<div></div>')
  							.attr('id', 'answ'+Math.ceil(Math.random()*100))
  							.addClass('answer')
  							.append('<input type="radio" name="quest" value="1" />')
  							.append('<input type="text" value=""/>')
  							.append(rm)
  							.append('<br/>');
  						var height = Number(selector.dialog( "option", "height")); 
  						selector.dialog( "option", "height", (height+25));
  						ii++;
  						answer_box.append(answ);
  					});
  					// add existing answers
  					$.each(json.answ, function(i, val){
  						var rm = $('<span></span>').button().text('x').click(function(){ $(this).parent().remove(); });
  						var radio = $('<input type="radio" name="quest" value="1" />').attr('checked', json.correct == val.id ? true : false);
  						var answ = $('<div></div>')
  							.attr('id', val.id)
  							.addClass('answer')
  							.append(radio)
  							.append($('<input type="text" />').val(val.answ))
  							.append(rm)
  							.append('<br/>')
  							.appendTo(answer_box);
  						var height = Number(selector.dialog( "option", "height")); 
  						selector.dialog( "option", "height", (height+25));
  						
  					});
  					return $('<div></div>')
  					.addClass('questionanswers')
  					.append(question)
  					.append(answer_box)
  					.append(add);
					};
					// 
					selector
						.html(t(JSON.parse($('#vi2').find('[date='+id+']').text())))
						.dialog({
							autoOpen: false,
							height: '200', 
							width: '300', 
							modal:true, 
							draggable: false,
							open : function(){
								//main.player.pause();
							},
							buttons : {
								"save" : function(){  
									_this.saveDialog('question', $('#vi2').find('[date='+id+']').attr('starttime'), null, id);	// dialog, type, time, form, replace		
									$(this).dialog("close");	
									_this.enableEditing('question');	
								},
								"delete" : function(){
									$('#vi2').find('[date='+id+']').remove();
									_this.savePopcorn();					
									// update player
  								main.updateAnnotation();
  								$(this).dialog("close");
  								_this.enableEditing('question');
								}
						},
						closeOnEscape: true,
						resizable: false,
						title: 'xxx',// + ' to ' + $(this).attr('title'),
						//position:['100',0], 
						colseText:'x',
						zIndex:200000						
					}); 
				});
			$(val).append(' ').append(btn);			
		});
	},
	
	
		
 
  /* edit button to call popcorn-maker */
  addEdit_btn : function(){
  	var _this = this;
    var popcorn_url = this.wp_url + this.plugin_dir + 'js/popcorn-maker/index.html';
		var title = $('.entry-title').text();
		var dialog = $("#dialog");
		
    // call popcorn
    $('<a></a>')
			.text('edit')
			.addClass('edit-videolab')
			.button()
			.click(function(e){ 
				main.log('[call:open_popcorn]');
				$("#dialog").empty();
				var frame = $('<iframe></iframe>')	
					.attr('src', popcorn_url + '?post_id=' + _this.post_id + '&title=' + title)
					.attr('height', '100%')
					.attr('width', '100%'); 
				dialog.append(frame).dialog({height: '650', width: '1000', modal:true, position:['100','40'], zIndex:200000 ,title: title});	
			})
		.appendTo('.meta-desc');
	},
	
	/* ... */
	getWidgets : function(){
		
		return true;
	}
	

});// end class VideoLab









