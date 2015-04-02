/**
 * Ditty News Ticker
 * Date: 10/06/2014
 *
 * @author Metaphor Creations
 * @version 1.4.12
 *
 **/

( function($) {

	var methods = {

		init : function( options ) {

			return this.each( function(){

				// Create default options
				var settings = {
					id										: '',
					type									: 'scroll',
					scroll_direction			: 'left',
					scroll_speed					: 10,
					scroll_pause					: 0,
					scroll_spacing				: 40,
					scroll_units					: 10,
					scroll_init						: 0,
					rotate_type						: 'fade',
					auto_rotate						: 0,
					rotate_delay					: 10,
					rotate_pause					: 0,
					rotate_speed					: 10,
					rotate_ease						: 'easeOutExpo',
					nav_reverse						: 0,
					offset								: 20,
					before_change					: function(){},
					after_change					: function(){},
					after_load						: function(){}
				};

				// Useful variables. Play carefully.
        var vars = {
        	id							: settings.id,
	        tick_count			: 0,
	        previous_tick		: 0,
	        current_tick		: 0,
	        next_tick				: 0,
	        reverse					: 0,
	        running					: 0
        };

				// Add any set options
				if (options) {
					$.extend(settings, options);
				}

				// Create variables
				var $container = $(this),
						$ticker = $container.find('.mtphr-dnt-tick-contents'),
						$nav_prev = $container.find('.mtphr-dnt-nav-prev'),
						$nav_next = $container.find('.mtphr-dnt-nav-next'),
						$nav_controls = $container.find('.mtphr-dnt-control-links'),
						ticker_width = $ticker.width(),
						ticker_height = 0,
						ticks = [],
						ticker_scroll,
						ticker_scroll_resize = true,
						ticker_delay,
						rotate_adjustment = settings.rotate_type,
						after_change_timeout,
						ticker_pause = false,
						offset = 20,
						touch_down_x,
						touch_down_y,
						touch_link = '',
						touch_target = '';

				// Add the vars
				$ticker.data('ditty:vars', vars);

				// Save the tick count & total
				vars.tick_count = $ticker.find('.mtphr-dnt-tick').length;



		    /**
		     * Initialize the ticker
		     *
		     * @since 1.0.0
		     */
		    function mtphr_dnt_init() {
		    
			    // Start the first tick
					if( vars.tick_count > 0 ) {
	
						// Setup a ticker scroll
						if( settings.type == 'scroll' ) {
							mtphr_dnt_scroll_setup();
	
						// Setup a ticker rotator
						} else if( settings.type == 'rotate' ) {
							mtphr_dnt_rotator_setup();
						}
			    }
			    
			    // Trigger the afterLoad callback
	        settings.after_load.call($container, $ticker);
	        $container.trigger('mtphr_dnt_after_load_single', [vars, ticks]);
	        $('body').trigger('mtphr_dnt_after_load', [$container, vars, ticks]);
		    }



		    /**
		     * Setup the ticker scroll
		     *
		     * @since 1.1.0
		     */
		    function mtphr_dnt_scroll_setup() {

		    	var $first = $ticker.find('.mtphr-dnt-tick:first');
		    	if( $first.attr('style') ) {
			    	var style = $first.attr('style');
			    	var style_array = style.split('width:');
			    	ticker_scroll_resize = (style_array.length > 1) ? false : true;
		    	}

		    	// Loop through the tick items
					$ticker.find('.mtphr-dnt-tick').each( function(index) {

						// Find the greatest tick height
						if( $(this).height() > ticker_height ) {
							ticker_height = $(this).height();
						}

						if( settings.scroll_direction == 'up' || settings.scroll_direction == 'down' ) {
							$(this).css('height', 'auto');
						}
					});

					// Set the ticker height
					$ticker.css('height',ticker_height+'px');

		    	// Loop through the tick items
					$ticker.find('.mtphr-dnt-tick').each( function(index) {

						// Make sure the ticker is visible
						$(this).show();

						// Add the tick data
						var tick = [{'headline':$(this)}];

						// Add the tick to the array
						ticks.push(tick);
					});

					// Set the initial position of the ticks
					mtphr_dnt_scroll_reset_ticks();

					// Start the scroll loop
					mtphr_dnt_scroll_loop();

					// Clear the loop on mouse hover
					$ticker.hover(
					  function () {
					  	if( settings.scroll_pause ) {
					    	clearInterval( ticker_scroll );
					    }
					  },
					  function () {
					  	if( settings.scroll_pause ) {
					    	mtphr_dnt_scroll_loop();
					    }
					  }
					);
		    }

		    /**
		     * Create the ticker scroll loop
		     *
		     * @since 1.0.8
		     */
		    function mtphr_dnt_scroll_loop() {

			    // Start the ticker timer
			    clearInterval( ticker_scroll );
					ticker_scroll = setInterval( function() {

						for( var i=0; i<vars.tick_count; i++ ) {

							if( ticks[i][0].visible == true ) {

								var pos = 'reset';

								if( settings.scroll_direction == 'left' || settings.scroll_direction == 'right' ) {

									pos = (settings.scroll_direction == 'left') ? mtphr_dnt_scroll_left(i) : mtphr_dnt_scroll_right(i);
									if( pos == 'reset' ) {
										pos = ticks[i][0].reset;
										ticks[i][0].headline.stop(true,true).css('left',pos+'px');
									} else {
										ticks[i][0].headline.stop(true,true).animate( {
											left: pos+'px'
										}, 100, 'linear' );
									}
								} else {

									pos = (settings.scroll_direction == 'up') ? mtphr_dnt_scroll_up(i) : mtphr_dnt_scroll_down(i);
									if( pos == 'reset' ) {
										pos = ticks[i][0].reset;
										ticks[i][0].headline.stop(true,true).css('top',pos+'px');
									} else {
										ticks[i][0].headline.stop(true,true).animate( {
											top: pos+'px'
										}, 100, 'linear' );
									}
								}

								ticks[i][0].position = pos;
							}
						}
			    }, 100);
		    }

		    /**
		     * Scroll the ticker left
		     *
		     * @since 1.0.0
		     */
		    function mtphr_dnt_scroll_left( i ) {

			    // Find the new position
					var pos = parseFloat(ticks[i][0].position - settings.scroll_speed);

					// Reset the tick if off the screen
					if( pos < -(ticks[i][0].width+settings.offset) ) {
						pos = mtphr_dnt_scroll_check_current(i);
					} else if( pos < parseFloat(ticker_width-ticks[i][0].width-settings.scroll_spacing) ) {
						mtphr_dnt_scroll_check_next(i);
					}

					return pos;
		    }

		    /**
		     * Scroll the ticker right
		     *
		     * @since 1.0.0
		     */
		    function mtphr_dnt_scroll_right( i ) {

			    // Find the new position
					var pos = ticks[i][0].position + settings.scroll_speed;

					// Reset the tick if off the screen
					if( pos > ticker_width+settings.offset ) {
						pos = mtphr_dnt_scroll_check_current(i);
					} else if( pos > settings.scroll_spacing ) {
						mtphr_dnt_scroll_check_next(i);
					}

					return pos;
		    }

		    /**
		     * Scroll the ticker up
		     *
		     * @since 1.0.0
		     */
		    function mtphr_dnt_scroll_up( i ) {

			    // Find the new position
					var pos = ticks[i][0].position - settings.scroll_speed;

					// Reset the tick if off the screen
					if( pos < -(ticks[i][0].height+settings.offset) ) {
						pos = mtphr_dnt_scroll_check_current(i);
					} else if( pos < ticker_height-ticks[i][0].height-settings.scroll_spacing ) {
						mtphr_dnt_scroll_check_next(i);
					}

					return pos;
		    }

		    /**
		     * Scroll the ticker down
		     *
		     * @since 1.0.0
		     */
		    function mtphr_dnt_scroll_down( i ) {

			    // Find the new position
					var pos = ticks[i][0].position + settings.scroll_speed;

					// Reset the tick if off the screen
					if( pos > ticker_height+settings.offset ) {
						pos = mtphr_dnt_scroll_check_current(i);
					} else if( pos > settings.scroll_spacing ) {
						mtphr_dnt_scroll_check_next(i);
					}

					return pos;
		    }

		    /**
		     * Check the current tick position
		     *
		     * @since 1.0.0
		     */
		    function mtphr_dnt_scroll_check_current( i ) {

					if( vars.tick_count > 1 ) {
						ticks[i][0].visible = false;
					}

					return 'reset';
		    }

		    /**
		     * Check the next tick visibility
		     *
		     * @since 1.0.0
		     */
		    function mtphr_dnt_scroll_check_next( i ) {

					if( i==(vars.tick_count-1) ) {
						ticks[0][0].visible = true;
					} else {
						ticks[(i+1)][0].visible = true;
					}
		    }

		    /**
		     * Resize the scroll ticks
		     *
		     * @since 1.1.0
		     */
		    function mtphr_dnt_scroll_resize_ticks() {

			    for( var i=0; i<vars.tick_count; i++ ) {

				    // Set the tick position
						var position;

						var $tick = ticks[i][0].headline;

						switch( settings.scroll_direction ) {
							case 'left':
								position = ticker_width+settings.offset;
								if( ticks[i][0].visible == false ) {
									$tick.css('left',position+'px');
								}
								break;

							case 'right':
								position = parseInt('-'+($tick.width()+settings.offset));
								if( ticks[i][0].visible == false ) {
									$tick.css('left',position+'px');
								}
								break;

							case 'up':
								if( ticker_scroll_resize ) {
									$tick.css('width',ticker_width);
								}
								position = parseInt(ticker_height+settings.offset);
								if( ticks[i][0].visible == false ) {
									$tick.css('top',position+'px');
								}
								break;

							case 'down':
								if( ticker_scroll_resize ) {
									$tick.css('width',ticker_width);
								}
								position = parseInt('-'+($tick.height()+settings.offset));
								if( ticks[i][0].visible == false ) {
									$tick.css('top',position+'px');
								}
								break;
						}

						// Adjust the tick data
						ticks[i][0].width = $tick.width();
						ticks[i][0].height = $tick.height();
						if( ticks[i][0].visible == false ) {
							ticks[i][0].position = position;
						}
						ticks[i][0].reset = position;
			    }
		    }

		    /**
		     * Reset the scroller for vertical scrolls
		     *
		     * @since 1.1.0
		     */
		    function mtphr_dnt_scroll_reset_ticks() {

		    	for( var i=0; i<vars.tick_count; i++ ) {

		    		var $tick = ticks[i][0].headline;

						switch( settings.scroll_direction ) {
							case 'left':
								position = ticker_width+settings.offset;
								$tick.stop(true,true).css('left',position+'px');
								break;

							case 'right':
								position = parseInt('-'+($tick.width()+settings.offset));
								$tick.stop(true,true).css('left',position+'px');
								break;

							case 'up':
								if( ticker_scroll_resize ) {
									$tick.css('width',ticker_width);
								}
								position = parseInt(ticker_height+settings.offset);
								$tick.stop(true,true).css('top',position+'px');
								break;

							case 'down':
								if( ticker_scroll_resize ) {
									$tick.css('width',ticker_width);
								}
								position = parseInt('-'+($tick.height()+settings.offset));
								$tick.stop(true,true).css('top',position+'px');
								break;
						}

						ticks[i][0].width = $tick.width();
						ticks[i][0].height = $tick.height();
						ticks[i][0].position = position;
						ticks[i][0].reset = position;
						ticks[i][0].visible = false;
			    }

					// Reset the current tick
					vars.current_tick = 0;

					// Set the first tick visibility
					ticks[vars.current_tick][0].visible = true;

					// Set the ticks to display on init
					if( settings.scroll_init ) {

						var position = 0;
						if( settings.scroll_direction == 'left' ) {
							position = ticker_width*.1;
						} else if( settings.scroll_direction == 'right' ) {
							position = ticker_width*.9;
						} else if( settings.scroll_direction == 'up' ) {
							position = ticker_height*.1;
						} else if( settings.scroll_direction == 'down' ) {
							position = ticker_height*.9;
						}

						for( var i=0; i<vars.tick_count; i++ ) {

			    		var $tick = ticks[i][0].headline;

							switch( settings.scroll_direction ) {
								case 'left':
									if( position < ticker_width ) {
										$tick.stop(true,true).css('left',position+'px');
										ticks[i][0].position = position;
										ticks[i][0].visible = true;
										position = position + ticks[i][0].width + settings.scroll_spacing;
									}
									break;

								case 'right':
									if( position > 0 ) {
										position = position - ticks[i][0].width;
										$tick.stop(true,true).css('left',position+'px');
										ticks[i][0].position = position;
										ticks[i][0].visible = true;
										position = position - settings.scroll_spacing;
									}
									break;

								case 'up':
									if( position < ticker_height ) {
										$tick.stop(true,true).css('top',position+'px');
										ticks[i][0].position = position;
										ticks[i][0].visible = true;
										position = position + ticks[i][0].height + settings.scroll_spacing;
									}
									break;

								case 'down':
									if( position > 0 ) {
										position = position - ticks[i][0].height;
										$tick.stop(true,true).css('top',position+'px');
										ticks[i][0].position = position;
										ticks[i][0].visible = true;
										position = position - settings.scroll_spacing;
									}
									break;
							}
						}
			    }
		    }




		    /**
		     * Setup the ticker rotator
		     *
		     * @since 1.0.8
		     */
		    function mtphr_dnt_rotator_setup() {

		    	// Loop through the tick items
					$ticker.find('.mtphr-dnt-tick').each( function(index) {

						// Add the tick to the array
						ticks.push($(this));

					});

					// Resize the ticks
					mtphr_dnt_rotator_resize_ticks();

					// Find the rotation type and create the dynamic rotation init function
					var rotate_init_name = 'mtphr_dnt_rotator_'+settings.rotate_type+'_init';
					var mtphr_dnt_rotator_type_init = eval('('+rotate_init_name+')');
					mtphr_dnt_rotator_type_init( $ticker, ticks, parseInt(settings.rotate_speed*100), settings.rotate_ease );
					mtphr_dnt_rotator_update_links( 0 );

					// Start the rotator rotate
					if( settings.auto_rotate ) {
						mtphr_dnt_rotator_delay();
					}

					// Clear the loop on mouse hover
					$ticker.hover(
					  function (e) {
					  	if( settings.auto_rotate && settings.rotate_pause && !vars.running ) {
					    	clearInterval( ticker_delay );
					    }
					  },
					  function () {
					  	if( settings.auto_rotate && settings.rotate_pause  && !vars.running ) {
					    	mtphr_dnt_rotator_delay();
					    }
					  }
					);
		    }

		    /**
		     * Create the ticker rotator loop
		     *
		     * @since 1.0.0
		     */
		    function mtphr_dnt_rotator_delay() {

			    // Start the ticker timer
			    clearInterval( ticker_delay );
					ticker_delay = setInterval( function() {

						// Find the new tick
			    	var new_tick = parseInt(vars.current_tick + 1);
						if( new_tick == vars.tick_count ) {
							new_tick = 0;
						}

						mtphr_dnt_rotator_update( new_tick );

			    }, parseInt(settings.rotate_delay*1000));
		    }

		    /**
		     * Create the rotator update call
		     *
		     * @since 1.1.7
		     */
		    function mtphr_dnt_rotator_update( new_tick ) {

		    	if( vars.current_tick != new_tick ) {

			    	// Clear the interval
			    	if( settings.auto_rotate ) {
				    	clearInterval( ticker_delay );
				    }
				    
				    // Set the next variable
						vars.next_tick = new_tick;

			    	// Trigger the before change callback
	          settings.before_change.call( $container, $ticker );
	          $container.trigger('mtphr_dnt_before_change_single', [vars, ticks]);
	          $('body').trigger('mtphr_dnt_before_change', [$container, vars, ticks]);

	          // Set the running variable
	          vars.running = 1;

				    // Rotate the current tick out
						mtphr_dnt_rotator_out( new_tick );

						// Rotate the new tick in
						mtphr_dnt_rotator_in( new_tick );

						// Set the previous & current tick
						vars.previous_tick = vars.current_tick;
						vars.current_tick = new_tick;

						// Trigger the after change callback
						after_change_timeout = setTimeout( function() {

							settings.after_change.call( $container, $ticker );
							$container.trigger('mtphr_dnt_after_change_single', [vars, ticks]);
							$('body').trigger('mtphr_dnt_after_change', [$container, vars, ticks]);

							// Reset the rotator type & variables
							rotate_adjustment = settings.rotate_type;
							vars.reverse = 0;
							vars.running = 0;

							// Restart the interval
							if( settings.auto_rotate ) {
					    	mtphr_dnt_rotator_delay();
					    }

						}, parseInt(settings.rotate_speed*100) );
					}
		    }

		    /**
		     * Update the control links
		     *
		     * @since 1.0.0
		     */
		    function mtphr_dnt_rotator_update_links( new_tick ) {

			    if( $nav_controls ) {
          	$nav_controls.children('a').removeClass('active');
          	$nav_controls.children('a[href="'+new_tick+'"]').addClass('active');
          }
		    }

		    /**
		     * Create the rotator in function calls
		     *
		     * @since 1.0.0
		     */
		    function mtphr_dnt_rotator_in( new_tick ) {

		    	// Update the links
		    	mtphr_dnt_rotator_update_links( new_tick );

			    // Find the rotation type and create the dynamic rotation in function
					var rotate_in_name = 'mtphr_dnt_rotator_'+rotate_adjustment+'_in';
					var mtphr_dnt_rotator_type_in = eval('('+rotate_in_name+')');
					mtphr_dnt_rotator_type_in( $ticker, $(ticks[new_tick]), $(ticks[vars.current_tick]), parseInt(settings.rotate_speed*100), settings.rotate_ease );
		    }

		    /**
		     * Create the rotator out function calls
		     *
		     * @since 1.0.0
		     */
		    function mtphr_dnt_rotator_out( new_tick ) {

			    // Find the rotation type and create the dynamic rotation out function
					var rotate_out_name = 'mtphr_dnt_rotator_'+rotate_adjustment+'_out';
					var mtphr_dnt_rotator_type_out = eval('('+rotate_out_name+')');
					mtphr_dnt_rotator_type_out( $ticker, $(ticks[vars.current_tick]), $(ticks[new_tick]), parseInt(settings.rotate_speed*100), settings.rotate_ease );
		    }

		    /**
		     * Resize the rotator ticks
		     *
		     * @since 1.0.8
		     */
		    function mtphr_dnt_rotator_resize_ticks() {

			    for( var i=0; i<vars.tick_count; i++ ) {

				    // Set the width of the tick
				    $(ticks[i]).width( ticker_width+'px' );
			    }

			    // Resize the ticker
			    var h = $(ticks[vars.current_tick]).height();
					$ticker.stop().css( 'height', h+'px' );
		    }




		    /**
		     * Rotator fade scripts
		     *
		     * @since 1.0.0
		     */
				function mtphr_dnt_rotator_fade_init( $ticker, ticks, rotate_speed, ease ) {

					// Get the first tick
					$tick = ticks[0];

					// Find the width of the tick
					var w = $tick.parents('.mtphr-dnt-rotate').width();
					var h = $tick.height();

					// Set the height of the ticker
					$ticker.css( 'height', h+'px' );

					// Set the initial position of the width & make sure it's visible
					$tick.show();
			  }

				// Show the new tick
				function mtphr_dnt_rotator_fade_in( $ticker, $tick, $prev, rotate_speed, ease ) {
			    $tick.fadeIn( rotate_speed );

			    var h = $tick.height();

					// Resize the ticker
					$ticker.stop().animate( {
						height: h+'px'
					}, rotate_speed, ease, function() {
					});
			  }

			  // Hide the old tick
			  function mtphr_dnt_rotator_fade_out( $ticker, $tick, $next, rotate_speed, ease ) {
			    $tick.fadeOut( rotate_speed );
			  }




			  /**
		     * Rotator slide left scripts
		     *
		     * @since 1.0.0
		     */
				function mtphr_dnt_rotator_slide_left_init( $ticker, ticks, rotate_speed, ease ) {

					// Get the first tick
					$tick = ticks[0];

					// Find the dimensions of the tick
					var w = $tick.parents('.mtphr-dnt-rotate').width();
					var h = $tick.height();

					// Set the height of the ticker
					$ticker.css( 'height', h+'px' );

					// Set the initial position of the width & make sure it's visible
					$tick.css( 'left', 0 );
					$tick.show();

					// If there are any images, reset height after loading
					if( $tick.find('img').length > 0 ) {

						$tick.find('img').each( function(index) {

							jQuery(this).load( function() {

								// Find the height of the tick
								var h = $tick.height();

								// Set the height of the ticker
								$ticker.css( 'height', h+'px' );
							});
						});
					}
			  }

				// Show the new tick
				function mtphr_dnt_rotator_slide_left_in( $ticker, $tick, $prev, rotate_speed, ease ) {

					// Find the dimensions of the tick
					var w = $tick.parents('.mtphr-dnt-rotate').width();
					var h = $tick.height();

					// Set the initial position of the width & make sure it's visible
					$tick.css( 'left', parseFloat(w+settings.offset)+'px' );
					$tick.show();

					// Resize the ticker
					$ticker.stop().animate( {
						height: h+'px'
					}, rotate_speed, ease, function() {
					});

					// Slide the tick in
					$tick.stop().animate( {
						left: '0'
					}, rotate_speed, ease, function() {
					});
			  }

			  // Hide the old tick
			  function mtphr_dnt_rotator_slide_left_out( $ticker, $tick, $next, rotate_speed, ease ) {

			    // Find the dimensions of the tick
					var w = $tick.parents('.mtphr-dnt-rotate').width();
					var h = $tick.height();

					// Slide the tick in
					$tick.stop().animate( {
						left: '-'+parseFloat(w+settings.offset)+'px'
					}, rotate_speed, ease, function() {
						// Hide the tick
						$tick.hide();
					});
			  }




			  /**
			   * Rotator slide right scripts
			   *
			   * @since 1.0.0
			   */
				function mtphr_dnt_rotator_slide_right_init( $ticker, ticks, rotate_speed, ease ) {

					// Get the first tick
					$tick = ticks[0];

					// Find the dimensions of the tick
					var w = $tick.parents('.mtphr-dnt-rotate').width();
					var h = $tick.height();

					// Set the height of the ticker
					$ticker.css( 'height', h+'px' );

					// Set the initial position of the width & make sure it's visible
					$tick.css( 'left', 0 );
					$tick.show();

					// If there are any images, reset height after loading
					if( $tick.find('img').length > 0 ) {

						$tick.find('img').each( function(index) {

							jQuery(this).load( function() {

								// Find the height of the tick
								var h = $tick.height();

								// Set the height of the ticker
								$ticker.css( 'height', h+'px' );
							});
						});
					}
			  }

				// Show the new tick
				function mtphr_dnt_rotator_slide_right_in( $ticker, $tick, $prev, rotate_speed, ease ) {

					// Find the dimensions of the tick
					var w = $tick.parents('.mtphr-dnt-rotate').width();
					var h = $tick.height();

					// Set the initial position of the width & make sure it's visible
					$tick.css( 'left', '-'+parseFloat(w+settings.offset)+'px' );
					$tick.show();

					// Resize the ticker
					$ticker.stop().animate( {
						height: h+'px'
					}, rotate_speed, ease, function() {
					});

					// Slide the tick in
					$tick.stop().animate( {
						left: '0'
					}, rotate_speed, ease, function() {
					});
			  }

			  // Hide the old tick
			  function mtphr_dnt_rotator_slide_right_out( $ticker, $tick, $next, rotate_speed, ease ) {

			    // Find the dimensions of the tick
					var w = $tick.parents('.mtphr-dnt-rotate').width();
					var h = $tick.height();

					// Slide the tick in
					$tick.stop().animate( {
						left: parseFloat(w+settings.offset)+'px'
					}, rotate_speed, ease, function() {
						// Hide the tick
						$tick.hide();
					});
			  }




			  /**
			   * Rotator slide down scripts
			   *
			   * @since 1.0.0
			   */
				function mtphr_dnt_rotator_slide_down_init( $ticker, ticks, rotate_speed, ease ) {

					// Get the first tick
					$tick = ticks[0];

					// Find the height of the tick
					var h = $tick.height();

					// Set the height of the ticker
					$ticker.css( 'height', h+'px' );

					// Set the initial position of the width & make sure it's visible
					$tick.css( 'top', 0 );
					$tick.show();

					// If there are any images, reset height after loading
					if( $tick.find('img').length > 0 ) {

						$tick.find('img').each( function(index) {

							jQuery(this).load( function() {

								// Find the height of the tick
								var h = $tick.height();

								// Set the height of the ticker
								$ticker.css( 'height', h+'px' );
							});
						});
					}
			  }

				// Show the new tick
				function mtphr_dnt_rotator_slide_down_in( $ticker, $tick, $prev, rotate_speed, ease ) {

					// Find the height of the tick
					var h = $tick.height();

					// Set the initial position of the width & make sure it's visible
					$tick.css( 'top', '-'+parseFloat(h+settings.offset)+'px' );
					$tick.show();

					// Resize the ticker
					$ticker.stop().animate( {
						height: h+'px'
					}, rotate_speed, ease, function() {
					});

					// Slide the tick in
					$tick.stop().animate( {
						top: '0'
					}, rotate_speed, ease, function() {
					});
			  }

			  // Hide the old tick
			  function mtphr_dnt_rotator_slide_down_out( $ticker, $tick, $next, rotate_speed, ease ) {

			    // Find the height of the next tick
					var h = $next.height();

					// Slide the tick in
					$tick.stop().animate( {
						top: parseFloat(h+settings.offset)+'px'
					}, rotate_speed, ease, function() {
						// Hide the tick
						$tick.hide();
					});
			  }




			  /**
			   * Rotator slide up scripts
			   *
			   * @since 1.0.0
			   */
				function mtphr_dnt_rotator_slide_up_init( $ticker, ticks, rotate_speed, ease ) {

					// Get the first tick
					$tick = ticks[0];

					// Find the height of the tick
					var h = $tick.height();

					// Set the height of the ticker
					$ticker.css( 'height', h+'px' );

					// Set the initial position of the width & make sure it's visible
					$tick.css( 'top', 0 );
					$tick.show();

					// If there are any images, reset height after loading
					if( $tick.find('img').length > 0 ) {

						$tick.find('img').each( function(index) {

							jQuery(this).load( function() {

								// Find the height of the tick
								var h = $tick.height();

								// Set the height of the ticker
								$ticker.css( 'height', h+'px' );
							});
						});
					}
			  }

				// Show the new tick
				function mtphr_dnt_rotator_slide_up_in( $ticker, $tick, $prev, rotate_speed, ease ) {

					// Find the height of the tick
					var h = $tick.height();

					// Set the initial position of the width & make sure it's visible
					$tick.css( 'top', parseFloat($prev.height()+settings.offset)+'px' );
					$tick.show();

					// Resize the ticker
					$ticker.stop().animate( {
						height: h+'px'
					}, rotate_speed, ease, function() {
					});

					// Slide the tick in
					$tick.stop().animate( {
						top: '0'
					}, rotate_speed, ease, function() {
					});
			  }

			  // Hide the old tick
			  function mtphr_dnt_rotator_slide_up_out( $ticker, $tick, $next, rotate_speed, ease ) {

			    // Find the height of the next tick
					var h = $tick.height();

					// Slide the tick in
					$tick.stop().animate( {
						top: '-'+parseFloat(h+settings.offset)+'px'
					}, rotate_speed, ease, function() {
						// Hide the tick
						$tick.hide();
					});
			  }
			  
			  
			  
			  
			  /* --------------------------------------------------------- */
			  /* !Set the next item */
			  /* --------------------------------------------------------- */
			  
			  function mtphr_dnt_next() {
				  
				  if(vars.running) return false;

		    	// Find the new tick
		    	var new_tick = parseInt(vars.current_tick + 1);
					if( new_tick == vars.tick_count ) {
						new_tick = 0;
					}
					mtphr_dnt_rotator_update( new_tick );
			  }
			  
			  /* --------------------------------------------------------- */
			  /* !Set the previous item */
			  /* --------------------------------------------------------- */
			  
			  function mtphr_dnt_prev() {
				  
				  if(vars.running) return false;

		    	// Find the new tick
		    	var new_tick = parseInt(vars.current_tick-1);
					if( new_tick < 0 ) {
						new_tick = vars.tick_count-1;
					}
					if( settings.nav_reverse ) {
						if( settings.rotate_type == 'slide_left' ) {
							rotate_adjustment = 'slide_right';
						} else if( settings.rotate_type == 'slide_right' ) {
							rotate_adjustment = 'slide_left';
						} else if( settings.rotate_type == 'slide_down' ) {
							rotate_adjustment = 'slide_up';
						} else if( settings.rotate_type == 'slide_up' ) {
							rotate_adjustment = 'slide_down';
						}
						vars.reverse = 1;
					}
					mtphr_dnt_rotator_update( new_tick );
			  }


		    /**
		     * Navigation clicks
		     *
		     * @since 1.0.0
		     */
		    if( $nav_prev && settings.type == 'rotate' ) {

		    	$nav_prev.bind('click', function( e ) {
		    		e.preventDefault();
						mtphr_dnt_prev();
		    	});

		    	$nav_next.bind('click', function(e) {
		    		e.preventDefault();
						mtphr_dnt_next();
		    	});
		    }




		    /**
		     * Nav controls
		     *
		     * @since 1.0.2
		     */
		    if( $nav_controls && settings.type == 'rotate' ) {

			    $nav_controls.children('a').bind('click', function( e ) {
		    		e.preventDefault();

		    		// Find the new tick
			    	var new_tick = parseInt( $(this).attr('href') );

		    		if(vars.running) return false;
		    		if(new_tick == vars.current_tick) return false;

			    	var reverse = ( new_tick < vars.current_tick ) ? 1 : 0;

		    		if( settings.nav_reverse && reverse ) {
							if( settings.rotate_type == 'slide_left' ) {
								rotate_adjustment = 'slide_right';
							} else if( settings.rotate_type == 'slide_right' ) {
								rotate_adjustment = 'slide_left';
							} else if( settings.rotate_type == 'slide_down' ) {
								rotate_adjustment = 'slide_up';
							} else if( settings.rotate_type == 'slide_up' ) {
								rotate_adjustment = 'slide_down';
							}
							vars.reverse = 1;
						}
						mtphr_dnt_rotator_update( new_tick );
		    	});
		    }




		    /* --------------------------------------------------------- */
		    /* !Mobile swipe - 1.1.9 */
		    /* --------------------------------------------------------- */
		    
				if( settings.type == 'rotate' ) {

					$ticker.swipe( {
						triggerOnTouchEnd : true,
						allowPageScroll: 'vertical',
						swipeStatus : function(event, phase, direction, distance, duration, fingers) {
							if ( phase =="end" ) {
								if (direction == "right") {

									if(vars.running) return false;

						    	// Find the new tick
						    	var new_tick = parseInt(vars.current_tick-1);
									if( new_tick < 0 ) {
										new_tick = vars.tick_count-1;
									}
									if( settings.rotate_type == 'slide_left' || settings.rotate_type == 'slide_right' ) {
										rotate_adjustment = 'slide_right';
									}
									if( settings.nav_reverse ) {
										if( settings.rotate_type == 'slide_down' ) {
											rotate_adjustment = 'slide_up';
										} else if( settings.rotate_type == 'slide_up' ) {
											rotate_adjustment = 'slide_down';
										}
										vars.reverse = 1;
									}
									mtphr_dnt_rotator_update( new_tick );

								} else if (direction == "left") {

									if(vars.running) return false;

						    	// Find the new tick
						    	var new_tick = parseInt(vars.current_tick + 1);
									if( new_tick == vars.tick_count ) {
										new_tick = 0;
									}
									if( settings.rotate_type == 'slide_left' || settings.rotate_type == 'slide_right' ) {
										rotate_adjustment = 'slide_left';
									}
									mtphr_dnt_rotator_update( new_tick );
								}
							}
						}
					});
				}
				
				
				
				/* --------------------------------------------------------- */
		    /* !Listen for external events - 1.4.1 */
		    /* --------------------------------------------------------- */

		    $container.on('mtphr_dnt_next', function( e ) {
		    	mtphr_dnt_next();
				});
				
				$container.on('mtphr_dnt_prev', function( e ) {
		    	mtphr_dnt_prev();
				});
				
				$container.on('mtphr_dnt_goto', function( e, pos ) {
		    	mtphr_dnt_rotator_update( parseInt(pos) );
				});



		    /**
		     * Resize listener
		     * Reset the ticker width
		     *
		     * @since 1.4.1
		     */
		    $(window).resize( function() {

			    // Resize the tickers if the width is different
			    if( $ticker.width() != ticker_width ) {

				    ticker_width = $ticker.width();

				    if( settings.type == 'scroll' ) {
				    	if( settings.scroll_direction=='up' || settings.scroll_direction=='down' ) {
				    		if( ticker_scroll_resize ) {
				    			mtphr_dnt_scroll_reset_ticks();
				    		} else {
					    		mtphr_dnt_scroll_resize_ticks();
				    		}
				    	} else {
					    	mtphr_dnt_scroll_resize_ticks();
				    	}
				    } else if( settings.type == 'rotate' ) {
					    mtphr_dnt_rotator_resize_ticks();
				    }
			    }
		    });
		    
		    
		    /* --------------------------------------------------------- */
		    /* !Listen for resize event from other plugins - 1.4.1 */
		    /* --------------------------------------------------------- */
				
				$container.on('mtphr_dnt_resize_single', function( e ) {
					if( settings.type == 'scroll' ) {
						mtphr_dnt_scroll_resize_ticks();
					} else if( settings.type == 'rotate' ) {
				    mtphr_dnt_rotator_resize_ticks();
			    }
				});
		    $('body').on('mtphr_dnt_resize', function( e, id ) {
		    	if( id && (id.indexOf(settings.id) >= 0) ) {
						if( settings.type == 'scroll' ) {
							mtphr_dnt_scroll_resize_ticks();
						} else if( settings.type == 'rotate' ) {
					    mtphr_dnt_rotator_resize_ticks();
				    } 
			    }
				});
				
				if( $container.width() == 0 ) {
			    
			    var mtphr_dnt_init_timer = setInterval( function() {

			    	if( $container.width() > 10 ) {
				    	clearInterval(mtphr_dnt_init_timer);
				    	ticker_width = $ticker.width();
				    	mtphr_dnt_init();
			    	}
			    	
			    }, 100 );
			    
		    } else {
			    mtphr_dnt_init();
		    }

			});
		}
	};





	/**
	 * Setup the class
	 *
	 * @since 1.0.0
	 */
	$.fn.ditty_news_ticker = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1) );
		} else if ( typeof method === 'object' || !method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist in ditty_news_ticker' );
		}
	};

})( jQuery );