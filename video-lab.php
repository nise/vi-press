<?php
/**
 * @package vi-two
 * @version 0.1
 */
/*
Plugin Name: Vi-Lab
Plugin URI: http://wordpress.org/#
Description: vi-lab is an editor for interactive, non-linear videos. It combines the power of Mozilla Popcorn Maker, firefogg (for video upload) and vi-two as an extendes HTML video player. vi-lab enabled temporal tagging, table of contents, hyperlinks, user comments as well as syncronizes slides in order to produces eLectures and other learning videos.
Author: Niels Seidel
Version: 0.1
Author URI: http://www.nise81.com/
*/











/******************************/
// vi-lab Overview

function videoLabOp(){
  
  // popcorn dialogue
  echo '<div id="dialog" title="Dialog Title"></div>';

	/**************/
  // get Videos  
 	global $wpdb;
	// We need to get the image's meta ID.
	$query = "SELECT ID, post_title, post_mime_type, post_type, post_excerpt, guid FROM " . $wpdb->prefix . "posts where post_mime_type = 'video/webm' OR post_mime_type = 'video/ogv'";
	$results = $wpdb->get_results($query);
	
	echo '<h2>Videos</h2>';
	echo '<table class="wp-list-table widefat fixed posts" cellspacing="0">
	<thead>
	<tr>
		<th scope="col" id="cb" class="manage-column column-cb check-column" style=""><input type="checkbox" /></th>
		<th scope="col" id="title">Title</th>
		<th scope="col" id="mime">Mime Type</th>
		<th scope="col" id="author">Author</th>
		<th scope="col" id="description">Beschreibung</th>
		<th scope="col" id="date">Date</th>	
	</tr>
	</thead>

	<tfoot>
	<tr>
		<th scope="col" id="cb" class="manage-column column-cb check-column"  style=""><input type="checkbox" /></th>
		<th scope="col" id="title">Title</th>
		<th scope="col" id="mime">Mime Type</th>
		<th scope="col" id="author">Author</th>
		<th scope="col" id="description">Beschreibung</th>
		<th scope="col" id="date">Date</th>
	</tr>
	</tfoot>

	<tbody id="the-list">';

	//	
	foreach ( $results as $row) {
		echo '<tr class="post type-post status-publish format-standard hentry category-uncategorized tag-lit tag-oer tag-recherche iedit author-self" valign="top">
						<th scope="row" class="check-column">
							<input type="checkbox" name="post[]" value="4006" /></th>
							<td class="post-title page-title column-title">
								<strong>'. $row->post_title .'</strong>
								
								<div class="row-actions">
									<span class="edit"><a id="create-annotation" ref="'. $row->guid .'" title="' . $row->post_title .'" href="#" title="Annotate this item">Annotate Video</a> | </span>
									<span class="edit2"><a href="' . trailingslashit( get_bloginfo('wpurl') ) . 'wp-admin/media.php?attachment_id=' . $row->ID . '&amp;action=edit" class="editinline" title="Edit this item inline">Edit Video</a> | </span>
									
									<span class="view"><a href="' . trailingslashit( get_bloginfo('wpurl') ) . '?attachment_id=' . $row->ID . '" title="View &#8220;Mo&#8221;" rel="permalink">View Video</a></span>
								</div>
							<div class="hidden" id="inline_4006">
								<div class="post_title">'. $row->post_title .'</div>
								<div class="post_name">mo-6</div>
								<div class="post_author">2</div>
								<div class="comment_status">open</div>
								<div class="ping_status">closed</div>
								<div class="_status">publish</div>
								<div class="jj">19</div>
								<div class="mm">11</div>
								<div class="aa">2012</div>
								<div class="hh">22</div>
								<div class="mn">37</div>
								<div class="ss">19</div>
								<div class="post_password"></div><div class="post_category" id="category_4006">1</div>
								<div class="tags_input" id="post_tag_4006">LiT, OER, Recherche</div><div class="sticky"></div>
								<div class="post_format"></div>
							</div>
						</td>
						<td>' . $row->post_mime_type . '</td>
						<td class="author column-author"><a href="edit.php?post_type=post&#038;author=2">nise</a></td>
						<td class="tags column-tags">' . $row->post_excerpt . '</td>
						<td class="date column-date"><abbr title="2012/11/19 10:37:19 PM">19 hours ago</abbr><br />Published</td>		
					</tr>
		';
}

echo '	</tbody></table>';





	/*************/
	// get annotated posts
	
	echo '<h2>Annotated Videos</h2>';
	echo '<table class="wp-list-table widefat fixed posts" cellspacing="0">
	<thead>
	<tr>
		<th scope="col" id="cb" class="column-cb check-column"><input type="checkbox" /></th>
		<th scope="col" id="title" class="column-title"  style="">Title</th>
		<th scope="col" id="mime" >Mime Type</th>
		<th scope="col" id="author">Author</th>
		<th scope="col" id="tags">Tags</th>
		<th scope="col" id="date">Date</th>
	</tr>
	</thead>

	<tfoot>
	<tr>
		<th scope="col" id="cb"><input type="checkbox" /></th>
		<th scope="col" id="title" class="manage-column column-title sortable desc"  style="">Title</th>
		<th scope="col" id="mime" >Mime Type</th>
		<th scope="col" id="author">Author</th>
		<th scope="col" id="tags">Tags</th>
		<th scope="col" id="date">Date</th>
	</tr>
	</tfoot>

	<tbody id="the-list">';

 
	$query = "SELECT meta.post_id, meta.meta_key, meta.meta_value, post.post_title, post.post_type, post.guid, post.ID FROM " . $wpdb->prefix . "postmeta AS meta JOIN " . $wpdb->prefix . "posts AS post WHERE meta.meta_key='popcorn' AND meta.post_id = post.ID AND post.post_type='post';";
	$results = $wpdb->get_results($query);

	foreach ( $results as $row) {
			echo '<tr class="post type-post status-publish format-standard hentry category-uncategorized tag-lit tag-oer tag-recherche iedit author-self" valign="top">
						<th scope="row" class="check-column">
							<input type="checkbox" name="post[]" value="4006" /></th>
							<td class="post-title page-title column-title">
								<strong>'. $row->post_title .' </strong>
								
								<div class="row-actions">
									<span class="edit"><a id="edit-annotation" class="post-' . $row->ID . '" ref="'. $row->guid .'" title="' . $row->post_title .'" href="#" title="Annotate this item">Edit Annotation</a> | </span>
									<span class="edit2"><a href="' .   trailingslashit( get_bloginfo('wpurl') ) . 'wp-admin/post.php?post=' . $row->ID . '&amp;action=edit" class="editinline" title="Edit this item inline">Edit Post</a> | </span>
									
									<span class="view"><a href="' .   trailingslashit( get_bloginfo('wpurl') ) . '?attachment_id=' . $row->ID . '" title="View &#8220;Mo&#8221;" rel="permalink">View Post</a></span>
								</div>
							<div class="hidden" id="inline_4006">
								<div class="post_title">'. $row->post_title .'</div>
								<div class="post_name">mo-6</div>
								<div class="post_author">2</div>
								<div class="comment_status">open</div>
								<div class="ping_status">closed</div>
								<div class="_status">publish</div>
								<div class="jj">19</div>
								<div class="mm">11</div>
								<div class="aa">2012</div>
								<div class="hh">22</div>
								<div class="mn">37</div>
								<div class="ss">19</div>
								<div class="post_password"></div><div class="post_category" id="category_4006">1</div>
								<div class="tags_input" id="post_tag_4006">LiT, OER, Recherche</div><div class="sticky"></div>
								<div class="post_format"></div>
							</div>
						</td>
						<td>' . $row->meta_key . '</td>
						<td class="author column-author"><a href="edit.php?post_type=post&#038;author=2">nise</a></td>
						<td class="tags column-tags"><a href="edit.php?post_type=post&#038;tag=lit">LiT</a>, <a href="edit.php?post_type=post&#038;tag=oer">OER</a>, <a href="edit.php?post_type=post&#038;tag=recherche">Recherche</a></td>
						<td class="date column-date"><abbr title="2012/11/19 10:37:19 PM">19 hours ago</abbr><br />Published</td>		
					</tr>
		';
	}
	
	echo '	</tbody></table>';

}   







/******************************/
// vi-lab Widget Editor

add_action('admin_init', 'vilab_optoptions_init' );
//add_action('admin_menu', 'vilab_optoptions_add_page');

// Init plugin options to white list our options
function vilab_optoptions_init(){
	register_setting( 'vilab_optoptions_options', 'vilab_opt', 'vilab_optoptions_validate' );
}

// Draw the menu page itself
function vilab_optoptions_do_page() {
	?>
<p style="display:none"><textarea id="widget-editor-tpl" rows="0" cols="0"><!--  -->
	<table class=" wp-list-table widefat fixed posts" cellspacing="0">
		<thead><tr>
			<th id="activa" class="check-column"></th>
			<th id="wid">Widget</th>
			<th>Appearance</th>
			<th>Annotations via Popcorn Maker</th>
			<th>Annotations via Player</th>
		</tr></thead>
		<tbody>
		{#foreach $T.widgets as widget}	
			<tr id="{$T.widget.name}-row">
				<td><input type="checkbox" class="button-primary" id="widget-{$T.widget.name}" value="1" name="vilab_opt[{$T.widget.name}_enabled]" /></td>
				<td><strong>{$T.widget.name}</strong>
					<div class="row-actionss" hidden>
						<span class="edit"><a id="edit-annotation" class="post-" ref="'. $row->guid .'" title="" href="#" title="Annotate this item">Edit Annotation</a> | </span>
					</div>
				</td>
				<td> 
						<div>panel 1: <input type="checkbox" class="button-primary" id="widget-{$T.widget.name}-app-panel1" value="1" name="vilab_opt[{$T.widget.name}_app_panel1]" /> &nbsp;&nbsp;&nbsp; 
						accordion: <input type="checkbox" class="button-primary" id="widget-{$T.widget.name}-app-accordion" value="1" name="vilab_opt[{$T.widget.name}_app_accordion]" /></div> 
						<div>panel 2: <input type="checkbox" class="button-primary" id="widget-{$T.widget.name}-app-panel2" value="1" name="vilab_opt[{$T.widget.name}_app_panel2]" /> &nbsp;&nbsp;&nbsp; 
						timeline: <input type="checkbox" class="button-primary" id="widget-{$T.widget.name}-app-timeline" value="1" name="vilab_opt[{$T.widget.name}_app_timeline]" /></div>  				
				</td>
				<td><input type="checkbox" class="button-primary" id="widget-{$T.widget.name}-ann-popcorn" value="1" name="vilab_opt[{$T.widget.name}_ann_popcorn]" /></td>
				<td><input type="checkbox" class="button-primary" id="widget-{$T.widget.name}-ann-player" value="1" name="vilab_opt[{$T.widget.name}_ann_player]" /></td>
			</tr>
		{#/for}
		</tbody>
	</table>
</textarea></p>


<div id="script-editor-tpl" style="display:none"><!--  -->
		<div>
		{#foreach $T.instructions as instruction}		
			<div>
			<h4>
				<input type="radio" class="button-primary" id="instructioncurrent{$T.i++}" value="{$T.i}" name="vilab_opt[current_phase]" /> 
				Pase {$T.i}: 
				<input id="instructiontitle{$T.i}" name="vilab_opt[instruction_title_{$T.i}]" value="{$T.instruction.title}" />
				</h4>
			<textarea class="script" id="instruction{$T.i}" name="vilab_opt[instruction_{$T.i}]" >{$T.instruction.content}</textarea>
			</div>
		{#/for}
		</div>
</div>

	

	<?php	  //
}


function vilab_optoptions_validate($input) {
	//$input['toc_enabled'] = ( $input['toc_enabled'] == 1 ? 1 : 0 );
	//$input['sometext'] =  wp_filter_nohtml_kses($input['sometext']);
	return $input;
}


add_action('wp_ajax_get_widget_options', 'get_widget_options_callback');
//
function get_widget_options_callback() {
	settings_fields('vilab_optoptions_options'); 
	$options = get_option('vilab_opt');
	echo '!!!!' . json_encode($options); // separator is needed in order to distinguish xml from json results
	//echo intval( $_POST['whatever'] ); // get POST variable from js
	die(); // this is required to return a proper result
}


add_action('wp_ajax_get_blogs_of_user', 'get_blogs_of_user_callback');
//
function get_blogs_of_user_callback(){
	$user_id = get_current_user_id();
	//$user_blogs = get_blogs_of_user( $user_id );
	global $wpdb;
  $query = "SELECT blog_id FROM " . $wpdb->base_prefix . "blogs WHERE blog_id != '1' ORDER BY path";
 	$user_blogs = $wpdb->get_results($query);

	$data = array();
	foreach ($user_blogs as $blog_w) { 
 		$blog = get_blog_details($blog_w->blog_id); //echo $blog->blogname .'  ';
		$post = get_blog_post($blog->blog_id, 1);
    $blog_data = array(
    	"blogname" => $blog->blogname,
    	"siteurl" => $blog->siteurl,
    	"posttitle" => $post->post_title,
    	"posturl" => $post->guid,
		);
		array_push($data, $blog_data);
	}
	echo json_encode($data);
	die(); // this is required to return a proper result
}

//
$player_selector = '#pages';
function videolab_widgeteditor(){
	
	vilab_optoptions_do_page();
	
	
	?>
		<div class="wrap">
		<form method="post" action="options.php">
			<?php settings_fields('vilab_optoptions_options'); ?>
			<?php $options = get_option('vilab_opt'); ?>
			<h2>Widget Editor</h2><div id="widget-editor"></div>
			<p class="widget-form-table"></p>
			<h2>Scripted Instructions</h2><div id="script-editor"></div>
			<p class="script-form-table"></p>
			<p class="submit">
			<input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />
			</p>
		</form>
	</div>
	
	<?php
	
	
}





/******************************/
// Upload Pages

//
function videolab_upload(){ return;
	$videoId = $_GET['id'];
	$add_php = 'http://' . $_SERVER['SERVER_NAME'] .  $_SERVER['PHP_SELF'];

	echo '<div id="firefogg-error"></div>';
	echo '<h2>Video Upload</h2> This service is supported by firefogg in order to guaranty proper video encoding for web delivery.';
	
	if($_SERVER['REQUEST_METHOD'] == 'POST') {
  	$title = $_POST['title'];
  	$description = $_POST['description'];
 	 if ($title) {
  	  $videoId = 'fixme';
  	  $uploadUrl = $add_php . '?videoId=' . $videoId;
  	  echo json_encode(array('result' => 1, 'uploadUrl' => $uploadUrl));
  	}
  	else {
    	//save video
   		$videoId = 'fixme';
    	$uploads = wp_upload_dir();
    	$filename = $uploads['path'] .'/'. $videoId . '.ogv';
    	echo 'aaa';
    	if($_FILES['chunk']['error'] == UPLOAD_ERR_OK) {
    		echo 'bbb';
      	$chunk = fopen($_FILES['chunk']['tmp_name'], 'r');
      	if(!file_exists($filename)) {
      	  $f = fopen($filename, 'w');
      	} else {
        	$f = fopen($filename, 'a');
      	}
      	while ($data = fread($chunk, 1024))
        	fwrite($f, $data);
      	fclose($f);
      
      	if($_POST['done'] == 1) { 
        	$resultUrl = str_replace('add.php', 'video.php', $add_php) . "?id=" . $videoId;
        	echo json_encode(array('result' => 1, 'done' => 1, 'resultUrl' => $resultUrl));
      	}
      	else {
        	echo json_encode(array('result' => 1));
      	}
    	} else {
      echo json_encode(array('result' => -1));
    }
	  }
	}

$title = 'fixme';
$description = 'fixme';

	echo "
	   <p><div id=\"progress\">
        <div id=\"progressbar\"></div>
        <div id=\"progressstatus\"></div>
      </div>
    </p>
    <p><form id=\"addVideo\">
        <input type=\"button\" value=\"Select Video...\" id=\"selectVideoButton\" onclick=\"selectVideo()\" />
        <p>Title of the video: <input type=\"text\" name=\"title\" value=\"\" /></p>
        <p>Description:<br> <textarea name=\"description\"></textarea></p>
        
        <input type=\"button\" value=\"Submit\" id=\"submit\" onclick=\"submitForm()\" />
      </form>
    </p>
	";
}








/******************************/
// general changes in WP settings

// add video mime type
function custom_upload_mimes ( $existing_mimes=array() ) {
	$existing_mimes['webm'] = 'video/webm'; 
	$existing_mimes['ogv'] = 'video/ogv';
	$existing_mimes['mp4'] = 'video/mp4';
	return $existing_mimes; 
} 
add_filter('upload_mimes', 'custom_upload_mimes');


// increase memory limit
define('WP_MEMORY_LIMIT', '300M');







/******************************/
// vi-lab specific hooks for menus, scripts and styles

// setup admin menu
function videoLab_plugin_menu() {
	$main_page = add_menu_page( 'VideoLab', 'VideoLab', 'manage_options', 'videolab', 'videoLabOp'); //, $icon_url, $position );
//	$upload_page = add_submenu_page( 'videolab', 'uploads', 'Upload Video', 'manage_options', 'videolab-upload', 'videolab_upload');
	$settings_page = add_submenu_page( 'videolab', 'widgets', 'Widget Editor', 'manage_options', 'videolab-widgeteditor', 'videolab_widgeteditor'); 
	//add_options_page('videolab', 'VideoLab', 'manage_options', 'my-unique-identifier', 'my_plugin_options');
	
	//add_action('admin_print_scripts-' . $main_page, 'addVideolabAdminScript');
}
add_action('admin_menu', 'videoLab_plugin_menu');



// add no-admin scripts
function AddVideolabScript(){
	if( !is_admin() ){
		wp_deregister_script('jquery');
		wp_register_script( 'jquery', plugins_url('/js/jquery-1.5.2.js', __FILE__));
///		wp_enqueue_script( 'jquery_fireefog' );	wp_enqueue_script('vi_lab_firefogg', plugins_url('/js/firefogg.js', __FILE__), array('jquery')); 	
		wp_enqueue_script('vi_lab', plugins_url('/js/vi-videolab.js', __FILE__), array('jquery', 'vi_lab_vi_two'));
		wp_enqueue_script('vi_lab_vi_two', plugins_url('js/vi-two.js', __FILE__), array('jquery'));
		// allready in vi-two included: //	wp_enqueue_script('vi_lab_jquery-ui', plugins_url('/js/jquery-ui-1.8.6.custom.min.js', __FILE__), array('jquery')); 	
	}
}
add_action('wp_print_scripts', 'AddVideolabScript');


// add admin scripts
function AddVideolabAdminScript(){

//wp_register_script('jquery');
wp_enqueue_script('jquery');
	wp_enqueue_script( 'jquery_fireefog' );	wp_enqueue_script('vi_lab_firefogg', plugins_url('/js/firefogg.js', __FILE__), array('jquery')); 	
	wp_enqueue_script('vi_lab', plugins_url('/js/vi-videolab.js', __FILE__), array('jquery', 'vi_lab_vi_two'));
	wp_enqueue_script('vi_lab_vi_two', plugins_url('js/vi-two.js', __FILE__), array('jquery')); 	
}
add_action( 'admin_enqueue_scripts', 'AddVideolabAdminScript' );


// add admin script
function addVideoLabAdminFootScript(){
	echo '<script type="text/javascript"> var myViLabAdmin = new ViLabAdmin("' . trailingslashit( get_bloginfo('wpurl') ) . '");  </script> ';
}
add_action('admin_footer', 'addVideoLabAdminFootScript');


// add script to theme
function AddVideoLabInlineScript(){ 
	// get_site_option('site_name') // returns network name 
	global $post;
	$user_ID = get_current_user_id();
	$user_info = get_user_by('id', $user_ID); // bug .. can not retrieve user login 
	$user = $user_info->user_login;
	echo '<script type="text/javascript">jQuery(document).ready(function() { var myVideoLab = new ViLab("' . trailingslashit( get_bloginfo('wpurl') ) . '", ' . $post->ID . ',  "header > a", "' . $user . '", "' . get_option( 'blogname' ) . '"); }); </script> ';
} 
add_action('wp_head', 'AddVideoLabInlineScript');


// add styles and add admin style
function AddVideolabStyle(){ 
		wp_register_style( 'vi-two_main', plugins_url('style/vi2.main.css', __FILE__) );
  	wp_register_style( 'vi-two_player', plugins_url('style/vi2.videoplayer.css', __FILE__) );
  	wp_register_style( 'vi-two_accordion', plugins_url('style/jquery.hrzAccordion.defaults.css', __FILE__) );
  	wp_register_style( 'vi-lab_cust', plugins_url('style/videolab.css', __FILE__) );
 		wp_register_style( 'jquery-ui', plugins_url('style/ui-lightness/jquery-ui-1.7.2.custom.css', __FILE__) );
		
   	wp_enqueue_style( 'vi-two_accordion' ); 
  	wp_enqueue_style( 'vi-two_main' );
  	wp_enqueue_style( 'vi-two_player' ); 	
  	wp_enqueue_style( 'vi-lab_cust' );	
		wp_enqueue_style('jquery-ui');
}
add_action( 'wp_enqueue_scripts', 'AddVideolabStyle' );
add_action( 'admin_head', 'AddVideolabStyle' );







/*
function addVideolabAdminScript(){
//	wp_deregister_script('jquery');
	wp_dequeue_script('jquery');
	wp_register_script( 'jquery', plugins_url('/js/jquery-1.5.2.js', __FILE__));
	wp_enqueue_script( 'jquery' );
	wp_enqueue_script('vi_lab_jquery-ui', plugins_url('/js/jquery-ui-1.8.6.custom.min.js', __FILE__), array('jquery')); 	

	wp_enqueue_script('vi_lab_firefogg', plugins_url('/js/firefogg.js', __FILE__), array('jquery')); 	
	wp_enqueue_script('vi_lab', plugins_url('/js/vi-videolab.js', __FILE__), array('jquery', 'vi_lab_vi_two'));
	wp_enqueue_script('vi_lab_vi_two', plugins_url('js/vi-two.js', __FILE__), array('jquery'));
}
*/






?>
