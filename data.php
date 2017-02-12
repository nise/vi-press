<pre>{
	"_name": "vi2 demo",
	"_taxonomy" : [
		{	"id": "climate",	
			"sub": ["climate system","climate model","climate change","regional downscaling","greenhouse effect","projection","La Nina","El Nino"]
		}
	],
	"stream":[
<?php

require( '../../../wp-load.php' );
error_reporting(E_ERROR | E_PARSE | E_WARNING);
	
/* -- */
function get_data(){
	global $wpdb;
	$user_id = get_current_user_id();
	//$user_blogs = get_blogs_of_user( $user_id );
  $query = "SELECT blog_id FROM " . $wpdb->base_prefix . "blogs WHERE blog_id != '1' ORDER BY path";
 	$user_blogs = $wpdb->get_results($query);

	$data = array();
	foreach ($user_blogs as $blog_w) { 
 		$blog = get_blog_details($blog_w->blog_id); //echo $blog->blogname .'  ';
		$post = get_blog_post($blog->blog_id, 1);
		$query = "SELECT meta_value FROM " . $wpdb->base_prefix . $blog->blog_id . "_postmeta WHERE meta_key = 'popcorn' ";
	 	$cust = $wpdb->get_results($query);
	 	foreach ($cust as $video){
	 		array_push($data, popcorn2vitwo($video->meta_value, $blog, $post));	
	 	}
		/*
    $blog_data = array(
    	"blogname" => $blog->blogname,
    	"siteurl" => $blog->siteurl,
    	"posttitle" => $post->post_title,
    	"posturl" => $post->guid,
		);
		array_push($data, $blog_data);
		*/
	}
	return json_encode($data, true);
}


/* -- */
function popcorn2vitwo($pop, $blog, $post){ 
	$pop = json_decode($pop);
	$annotations = getAnnotations($pop);
	$arr = array(
		"id" => $blog->blogname,
		"metadata" => array(	
			"selector" => "#metadata",
			"author" =>  "--",
			"institution" => "--",
			"title" => $post->post_title,
			"category" => "--",
			"abstract" => "--",
			"length" => 100,
			"date" => "2012/10/01",
			"weight" => 5,
			"titleselector" => "h2"
		),
		"video" => $pop->project->media[0]->url,
		"tags" => $annotations["tags"],
		"toc" => $annotations["tocs"],
		"assessment" => $annotations["questions"],
		"comment" => $annotations["comments"],
		"links" => array()
	);
	return $arr;
}


function getAnnotations($pop){
	$tags = array();
	$tocs = array();
	$questions = array();
	$comments = array();
	
	foreach($pop->project->media as $med){ 
		foreach($med->tracks as $track){
		foreach($track->trackEvents as $tag){
				if($tag->type == "tag"){
					array_push($tags, array("tagname" => $tag->popcornOptions->tag, "occ" => $tag->popcornOptions->start));
				}else if($tag->type == "toc"){
					array_push($tocs, array("label" => $tag->popcornOptions->toc, "start" => $tag->popcornOptions->start, "duration" => 1));
				}else if($tag->type == "question"){
					echo $tag->popcornOptions->question . "\n\n\n";
					array_push($questions, array("question" => $tag->popcornOptions->question, "start" => $tag->popcornOptions->start, "duration" => 1));
				}else if($tag->type == "comment"){
					array_push($comments, array("comments" => $tag->popcornOptions->comment, "start" => $tag->popcornOptions->start, "duration" => 1));
				}
		}}
	}
	return array("tags" => $tags, "tocs" => $tocs, "questions" => $questions, "comments" => $comments);
}


////////

//echo  
get_data();



?>
]}</pre>


