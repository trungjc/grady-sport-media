<?php 



//////////// CUSTOM POST TYPE STARTS HERE!!!!! //////////////

function ss_m_custom_post_type(){
  $labels = array(
    'name' => _x('Subscribe Me Forms','post type general name'),
    'singular_name' => _x('Subscribe Me','post type singular name'),
    'add_new' => _x('Add New','SM Forms'),
    'add_new_item' => __('Add new SM Forms'),
    'edit_item' => __('Edit SM Forms'),
    'new_item' => __('New SM Forms'),
    'all_items' => __('All SM Forms'),
    'view_itme' => __('View SM Forms'),
    'search_items' => __('Search SM Forms'),
    'not_found' => __('No SM Forms found'),
    'not_found_in_trash' => __('No SM Forms found in trash'),
    'parent_item_colon' => "",
    'menu_name' => 'SM Forms',
    );
  $args = array(
    'labels' => $labels,
    'description' => 'Create SM Forms',
    'menu_postition' => 10,
    'public' => true,
    'supports' => array('title','custom_fields'),
    'has_archive' => true,
    'capability_type' => 'page',
    'query_var' => 'ssm_forms',
    'menu_icon' => 'dashicons-welcome-add-page',
    'show_in_menu' => true,
    );


  register_post_type('subscribe_me_forms',$args);
}

add_action('init','ss_m_custom_post_type');

//////////// CUSTOM POST TYPE ENDS HERE!!!!! ////////////// /
                                                        // //   / 
                                                            //  //  /
                                                            //  //  //
                // WONDERFULL ART HERE                      //  //  //////////////////////////////
                                                            //  //  ///        //////////////////
                                                            //  //  ////////////////////////////
                                                            //  //  ///
                                                            //  //
                                                            //  //
                                                            //  /
                                                            //

/////////////////////////// Removing post name from perma link ///////////////////////////


add_action("load-post-new.php","ssmf_count_user_posts_by_type");

    function ssmf_count_user_posts_by_type( $userid, $post_type = 'subscribe_me_forms' ) {
    global $wpdb;

    $userid = get_current_user_id();

    $where = get_posts_by_author_sql( $post_type, true, $userid );

    $count = $wpdb->get_var( "SELECT COUNT(*) FROM $wpdb->posts $where" );

    $screen = get_current_screen();

    if (current_user_can( 'edit_posts') and $screen->post_type === 'subscribe_me_forms') { 
        //Is  admin and all users - so impose the limit
        if($count>=2)
            header("Location: /wp-content/plugins/mailchimp-subscribe-sm/phuf.php");
            

        }
    }




?>