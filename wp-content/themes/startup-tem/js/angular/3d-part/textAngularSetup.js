/*
textAngular
Author : Austin Anderson
License : 2013 MIT
Version 1.2.1

See README.md or https://github.com/fraywing/textAngular/wiki for requirements and use.
*/
textAngularSetup = angular.module('textAngularSetup', []);
	
// Here we set up the global display defaults, to set your own use a angular $provider#decorator.
textAngularSetup.value('taOptions',  {
	toolbar: [
		['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
		['bold', 'color', 'fake', 'font', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
		['justifyLeft','justifyCenter','justifyRight'],
		['html', 'insertImage', 'insertLink', 'insertVideo']
	],
	classes: {
		focussed: "focussed",
		toolbar: "btn-toolbar",
		toolbarGroup: "btn-group",
		toolbarButton: "btn btn-default",
		toolbarButtonActive: "active",
		//disabled: "disabled",
		// textEditor: 'form-control',
		// htmlEditor: 'form-control'
	},
	setup: {
		// wysiwyg mode
		textEditorSetup: function($element){ /* Do some processing here */ },
		// raw html
		htmlEditorSetup: function($element){ /* Do some processing here */ }
	},
	defaultFileDropHandler:
		/* istanbul ignore next: untestable image processing */
		function(file, insertAction){
			var reader = new FileReader();
			if(file.type.substring(0, 5) === 'image'){
				reader.onload = function() {
					if(reader.result !== '') insertAction('insertImage', reader.result, true);
				};

				reader.readAsDataURL(file);
				return true;
			}
			return false;
		}
});

// This is the element selector string that is used to catch click events within a taBind, prevents the default and $emits a 'ta-element-select' event
// these are individually used in an angular.element().find() call. What can go here depends on whether you have full jQuery loaded or just jQLite with angularjs.
// div is only used as div.ta-insert-video caught in filter.
textAngularSetup.value('taSelectableElements', ['a','img']);

// This is an array of objects with the following options:
//				selector: <string> a jqLite or jQuery selector string
//				customAttribute: <string> an attribute to search for
//				renderLogic: <function(element)>
// Both or one of selector and customAttribute must be defined.
textAngularSetup.value('taCustomRenderers', [
	{
		// Parse back out: '<div class="ta-insert-video" ta-insert-video src="' + urlLink + '" allowfullscreen="true" width="300" frameborder="0" height="250"></div>'
		// To correct video element. For now only support youtube
		selector: 'img',
		customAttribute: 'ta-insert-video',
		renderLogic: function(element){
			var iframe = angular.element('<iframe></iframe>');
			var attributes = element.prop("attributes");
			// loop through element attributes and apply them on iframe
			angular.forEach(attributes, function(attr) {
				iframe.attr(attr.name, attr.value);
			});
			iframe.attr('src', iframe.attr('ta-insert-video'));
			element.replaceWith(iframe);
		}
	}
]);

textAngularSetup.constant('taTranslations', {
	toggleHTML: "Toggle HTML",
	insertImage: "Please enter a image URL to insert",
	insertLink: "Please enter a URL to insert",
	insertVideo: "Please enter a youtube URL to embed"
});

textAngularSetup.run(['taRegisterTool', '$window', 'taTranslations', 'taSelection', 'textAngularIcons', function(taRegisterTool, $window, taTranslations, taSelection, textAngularIcons){
	taRegisterTool("html", {
		buttontext: taTranslations.toggleHTML,
		action: function(){
			this.$editor().switchView();
		},
		activeState: function(){
			return this.$editor().showHtml;
		}
	});
	// add the Header tools
	// convenience functions so that the loop works correctly
	var _retActiveStateFunction = function(q){
		return function(){ return this.$editor().queryFormatBlockState(q); };
	};
	var headerAction = function(){
		return this.$editor().wrapSelection("formatBlock", "<" + this.name.toUpperCase() +">");
	};
	angular.forEach(['h1','h2','h3','h4','h5','h6'], function(h){
		taRegisterTool(h.toLowerCase(), {
			buttontext: h.toUpperCase(),
			action: headerAction,
			activeState: _retActiveStateFunction(h.toLowerCase())
		});
	});
	taRegisterTool('p', {
		buttontext: 'P',
		action: function(){
			return this.$editor().wrapSelection("formatBlock", "<P>");
		},
		activeState: function(){ return this.$editor().queryFormatBlockState('p'); }
	});
	taRegisterTool('pre', {
		buttontext: 'pre',
		action: function(){
			return this.$editor().wrapSelection("formatBlock", "<PRE>");
		},
		activeState: function(){ return this.$editor().queryFormatBlockState('pre'); }
	});
	taRegisterTool('ul', {
		iconclass: 'fa fa-list-ul',
		action: function(){
			return this.$editor().wrapSelection("insertUnorderedList", null);
		},
		activeState: function(){ return document.queryCommandState('insertUnorderedList'); }
	});
	taRegisterTool('ol', {
		iconclass: 'fa fa-list-ol',
		action: function(){
			return this.$editor().wrapSelection("insertOrderedList", null);
		},
		activeState: function(){ return document.queryCommandState('insertOrderedList'); }
	});
	taRegisterTool('quote', {
		iconclass: 'fa fa-quote-right',
		action: function(){
			return this.$editor().wrapSelection("formatBlock", "<BLOCKQUOTE>");
		},
		activeState: function(){ return this.$editor().queryFormatBlockState('blockquote'); }
	});
	taRegisterTool('undo', {
		iconclass: 'fa fa-undo',
		action: function(){
			return this.$editor().wrapSelection("undo", null);
		}
	});
	taRegisterTool('redo', {
		iconclass: 'fa fa-repeat',
		action: function(){
			return this.$editor().wrapSelection("redo", null);
		}
	});
	taRegisterTool('bold', {
		iconclass: 'fui-textAngular-bold',
		action: function(){
			return this.$editor().wrapSelection("bold", null);
		},
		activeState: function(){
			return document.queryCommandState('bold');
		},
		commandKeyCode: 98
	});
	taRegisterTool('color', {
		iconclass: 'fui-textAngular-color',
		action: function() {
			return function() {
				
			}
		},
		activeState: function(){
			//return document.queryCommandState('color');
		},
		commandKeyCode: 98
	});
	taRegisterTool('fake', {
		iconclass: 'fui-textAngular-fake',
		action: function() {
			return this.$editor().wrapSelection("strikethrough", null);
		},
		activeState: function() {

		},
		commandKeyCode: 98
	});
	taRegisterTool('font', {
		iconclass: 'fui-textAngular-font',
		action: function() {
			var self = this;
			if ( !$('.fonts-drop-holder').is(':visible') ) {
				$('.fonts-drop-holder').show().animate({opacity: 1},200);
			}
			else {
				$('.fonts-drop-holder').hide().animate({opacity: 0},200);
			}
			window.changeFont = function(fontFamily) {
				$('.dm-text .dm-control-button').removeAttr('disabled');
				self.$editor().wrapSelection('fontname', fontFamily);
			}
		}
	});
	taRegisterTool('justifyLeft', {
		iconclass: 'fa fa-align-left',
		action: function(){
			return this.$editor().wrapSelection("justifyLeft", null);
		},
		activeState: function(commonElement){
			var result = false;
			if(commonElement) result = commonElement.css('text-align') === 'left' || commonElement.attr('align') === 'left' ||
				(commonElement.css('text-align') !== 'right' && commonElement.css('text-align') !== 'center' && !document.queryCommandState('justifyRight') && !document.queryCommandState('justifyCenter'));
			result = result || document.queryCommandState('justifyLeft');
			return result;
		}
	});
	taRegisterTool('justifyRight', {
		iconclass: 'fa fa-align-right',
		action: function(){
			return this.$editor().wrapSelection("justifyRight", null);
		},
		activeState: function(commonElement){
			var result = false;
			if(commonElement) result = commonElement.css('text-align') === 'right';
			result = result || document.queryCommandState('justifyRight');
			return result;
		}
	});
	taRegisterTool('justifyCenter', {
		iconclass: 'fa fa-align-center',
		action: function(){
			return this.$editor().wrapSelection("justifyCenter", null);
		},
		activeState: function(commonElement){
			var result = false;
			if(commonElement) result = commonElement.css('text-align') === 'center';
			result = result || document.queryCommandState('justifyCenter');
			return result;
		}
	});
	taRegisterTool('italics', {
		iconclass: 'fui-textAngular-italic',
		action: function(){
			return this.$editor().wrapSelection("italic", null);
		},
		activeState: function(){
			return document.queryCommandState('italic');
		},
		commandKeyCode: 105
	});
	taRegisterTool('underline', {
		iconclass: 'fa fa-underline',
		action: function(){
			return this.$editor().wrapSelection("underline", null);
		},
		activeState: function(){
			return document.queryCommandState('underline');
		},
		commandKeyCode: 117
	});
	taRegisterTool('clear', {
		iconclass: 'fa fa-ban',
		action: function(deferred, restoreSelection){
			this.$editor().wrapSelection("removeFormat", null);
			var possibleNodes = angular.element(taSelection.getSelectionElement());
			// remove lists
			var removeListElements = function(list){
				list = angular.element(list);
				var prevElement = list;
				angular.forEach(list.children(), function(liElem){
					var newElem = angular.element('<p></p>');
					newElem.html(angular.element(liElem).html());
					prevElement.after(newElem);
					prevElement = newElem;
				});
				list.remove();
			};
			angular.forEach(possibleNodes.find("ul"), removeListElements);
			angular.forEach(possibleNodes.find("ol"), removeListElements);
			// clear out all class attributes. These do not seem to be cleared via removeFormat
			var $editor = this.$editor();
			var recursiveRemoveClass = function(node){
				node = angular.element(node);
				if(node[0] !== $editor.displayElements.text[0]) node.removeAttr('class');
				angular.forEach(node.children(), recursiveRemoveClass);
			};
			angular.forEach(possibleNodes, recursiveRemoveClass);
			// check if in list. If not in list then use formatBlock option
			if(possibleNodes[0].tagName.toLowerCase() !== 'li' &&
				possibleNodes[0].tagName.toLowerCase() !== 'ol' &&
				possibleNodes[0].tagName.toLowerCase() !== 'ul') this.$editor().wrapSelection("formatBlock", "<p>");
			restoreSelection();
		}
	});
	
	var imgOnSelectAction = function(event, $element, editorScope){
		// setup the editor toolbar
		// Credit to the work at http://hackerwins.github.io/summernote/ for this editbar logic/display
		var finishEdit = function(){
			editorScope.updateTaBindtaTextElement();
			editorScope.hidePopover();
		};
		event.preventDefault();
		editorScope.displayElements.popover.css('width', '375px');
		var container = editorScope.displayElements.popoverContainer;
		container.empty();
		var buttonGroup = angular.element('<div class="btn-group" style="padding-right: 6px;">');
		var fullButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">100% </button>');
		fullButton.on('click', function(event){
			event.preventDefault();
			$element.css({
				'width': '100%',
				'height': ''
			});
			finishEdit();
		});
		var halfButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">50% </button>');
		halfButton.on('click', function(event){
			event.preventDefault();
			$element.css({
				'width': '50%',
				'height': ''
			});
			finishEdit();
		});
		var quartButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">25% </button>');
		quartButton.on('click', function(event){
			event.preventDefault();
			$element.css({
				'width': '25%',
				'height': ''
			});
			finishEdit();
		});
		var resetButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">Reset</button>');
		resetButton.on('click', function(event){
			event.preventDefault();
			$element.css({
				width: '',
				height: ''
			});
			finishEdit();
		});
		buttonGroup.append(fullButton);
		buttonGroup.append(halfButton);
		buttonGroup.append(quartButton);
		buttonGroup.append(resetButton);
		container.append(buttonGroup);
		
		buttonGroup = angular.element('<div class="btn-group" style="padding-right: 6px;">');
		var floatLeft = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-align-left"></i></button>');
		floatLeft.on('click', function(event){
			event.preventDefault();
			$element.css('float', 'left');
			finishEdit();
		});
		var floatRight = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-align-right"></i></button>');
		floatRight.on('click', function(event){
			event.preventDefault();
			$element.css('float', 'right');
			finishEdit();
		});
		var floatNone = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-align-justify"></i></button>');
		floatNone.on('click', function(event){
			event.preventDefault();
			$element.css('float', '');
			finishEdit();
		});
		buttonGroup.append(floatLeft);
		buttonGroup.append(floatNone);
		buttonGroup.append(floatRight);
		container.append(buttonGroup);
		
		buttonGroup = angular.element('<div class="btn-group">');
		var remove = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-trash-o"></i></button>');
		remove.on('click', function(event){
			event.preventDefault();
			$element.remove();
			finishEdit();
		});
		buttonGroup.append(remove);
		container.append(buttonGroup);
		
		editorScope.showPopover($element);
		editorScope.showResizeOverlay($element);
	};
	
	taRegisterTool('insertImage', {
		iconclass: 'fa fa-picture-o',
		action: function(){
			var imageLink;
			imageLink = $window.prompt(taTranslations.insertImage, 'http://');
			if(imageLink && imageLink !== '' && imageLink !== 'http://'){
				return this.$editor().wrapSelection('insertImage', imageLink, true);
			}
		},
		onElementSelect: {
			element: 'img',
			action: imgOnSelectAction
		}
	});
	taRegisterTool('insertVideo', {
		iconclass: 'fa fa-youtube-play',
		action: function(){
			var urlPrompt;
			urlPrompt = $window.prompt(taTranslations.insertVideo, 'http://');
			if (urlPrompt && urlPrompt !== '' && urlPrompt !== 'http://') {
				// get the video ID
				var ids = urlPrompt.match(/(\?|&)v=[^&]*/);
				/* istanbul ignore else: if it's invalid don't worry - though probably should show some kind of error message */
				if(ids.length > 0){
					// create the embed link
					var urlLink = "https://www.youtube.com/embed/" + ids[0].substring(3);
					// create the HTML
					var embed = '<img class="ta-insert-video" ta-insert-video="' + urlLink + '" contenteditable="false" src="" allowfullscreen="true" width="300" frameborder="0" height="250"/>';
					// insert
					return this.$editor().wrapSelection('insertHTML', embed, true);
				}
			}
		},
		onElementSelect: {
			element: 'img',
			onlyWithAttrs: ['ta-insert-video'],
			action: imgOnSelectAction
		}
	});	
	taRegisterTool('insertLink', {
		iconclass: 'fui-textAngular-link',
		action: function() {
			var editorScope = this.$editor(),
				el = $('[name="insertLink"]'),
				lastSelection = saveLastSelection(),
				container = editorScope.displayElements.popoverContainer,
				popover = editorScope.displayElements.popover,
				inputUrl = angular.element('<input class="dm-create-link hidden" type="text" placeholder="Enter a link" value="" />'),
				submitUrl = angular.element('<button class="dm-submit-link hidden" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="18px" height="14px" style="fill: #646566;" viewBox="11 0 18 16" enable-background="new 11 0 18 16"><path d="M27 4v3h-11.586l2.293-2.293-1.414-1.414-4.707 4.707 4.707 4.707 1.414-1.414-2.293-2.293h11.586c.709 0 1.158-.302 1.41-.556.567-.571.591-1.333.59-1.473v-2.971h-2z"/></svg></button>'),
				finishEdit = function(){
					editorScope.updateTaBindtaTextElement();
					editorScope.hidePopover();
				},
				key = '',
				stillFocus = false;

			function saveLastSelection() {
		        return window.getSelection().getRangeAt(0);
		    }
		    function restoreLastSelection(savedSel) {
		    	window.getSelection().addRange(savedSel);
		    }
		    function removeSelection() {
		    	window.getSelection().removeAllRanges();
		    }
			el.addClass('open').closest('button').siblings('button, .btn-font-holder').hide();

		    container.empty();
			container.append(inputUrl, submitUrl);
			popover.addClass('open');
			popover.trigger('urlElementOpened');
			inputUrl.val('');
			inputUrl.removeClass('hidden');
			submitUrl.removeClass('hidden');
            setTimeout(function() {
            	editorScope.clickOnPopup = true;
                inputUrl.focus();
            }, 0);
            editorScope.clickOnPopup = false;
			editorScope.reflowPopover();

			inputUrl.on('keyup', function(event) {
				if ( event.which == 13 || key == 13 ) {
					var serial = angular.element(event.target).closest('.popover').data('popover-serial');
					removeSelection();
					event.preventDefault();
					event.target.blur();
					restoreLastSelection(lastSelection);
					editorScope.wrapSelection('createLink', inputUrl[0].value, true);
					finishEdit();
					removeSelection();
					angular.element('input[name="textAngularEditor' + serial + '"]').focus();
				}
				if ( el.hasClass('open') && event.which == 27 ) {
					el.removeClass('open').removeAttr('disabled');
					$('.dm-text button, .dm-text .btn-font-holder, .popover-toolbar').not('[name="color"], [name="fake"]').show().removeClass('open');
					container.find(inputUrl).remove();
					finishEdit();
				}
				if ( inputUrl.val() != '' ) {
					submitUrl.addClass('valid');
				}
				else {
					submitUrl.removeClass('valid');
				}
			});
			submitUrl.on('click', function(event) {
				event.preventDefault();
				key = 13;
				inputUrl.trigger('keyup');
			});

			inputUrl.on('focus', function(event) {
				stillFocus = true;
			});

			inputUrl.on('blur', function(event) {
				stillFocus = false;
				setTimeout(function() {
					if(!stillFocus) {
						finishEdit();
					}
				}, 200);	
			});
		},
		activeState: function(commonElement){
			if(commonElement) return commonElement[0].tagName === 'A';
			return false;
		},
		onElementSelect: {
			element: 'a',
			action: function(event, $element, editorScope){
				// setup the editor toolbar
				// Credit to the work at http://hackerwins.github.io/summernote/ for this editbar logic
				event.preventDefault();
				var container = editorScope.displayElements.popoverContainer,
					popover = editorScope.displayElements.popover,
					inputUrl = angular.element('<input class="dm-create-link hidden" placeholder="Enter a link"  type="text" value="' + $element.attr('href') + '" />'),
					submitUrl = angular.element('<button class="dm-submit-link hidden valid" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="18px" height="14px" style="fill: #646566;" viewBox="11 0 18 16" enable-background="new 11 0 18 16"><path d="M27 4v3h-11.586l2.293-2.293-1.414-1.414-4.707 4.707 4.707 4.707 1.414-1.414-2.293-2.293h11.586c.709 0 1.158-.302 1.41-.556.567-.571.591-1.333.59-1.473v-2.971h-2z"/></svg></button>'),
					finishEdit = function(){
						editorScope.updateTaBindtaTextElement();
						editorScope.hidePopover();
					},
					stillFocus = false;

				container.append(inputUrl, submitUrl);
				popover.addClass('openAlways');
				editorScope.reflowPopover();
				editorScope.showPopover();

				inputUrl.on('keyup', function(event){
					if(event.which == 13 && inputUrl[0].value){
						var serial = angular.element(event.target).closest('.popover').data('popover-serial');
						$element.attr('href', inputUrl[0].value);
						finishEdit();
						angular.element('#taTextElement' + serial).focus();
						angular.element('input[name="textAngularEditor' + serial + '"]').focus();
					}
				});

				inputUrl.on('blur', function(event) {
					stillFocus = false;
					setTimeout(function() {
						if(!stillFocus) {
							finishEdit();
						}
					}, 200);
				});
				inputUrl.on('focus', function(event) {
					stillFocus = true;
				});

				var unLinkButton = '<button type="button" class="dm-control-button dm-unlink" tabindex="-1" unselectable="on">' +
										'<i class="dm-widget-icon">' +
											textAngularIcons.getIcon('fui-textAngular-unlink') +
										'</i>' +
									'</button>';

				var unLinkButton = angular.element(unLinkButton);
				// directly before ths click event is fired a digest is fired off whereby the reference to $element is orphaned off
				var el = '';
				unLinkButton.on('click', function(event){
					el = $('.dm-unlink');
					event.preventDefault();
					inputUrl.removeClass('hidden');
					submitUrl.removeClass('hidden');
					el.addClass('open').attr('disabled', '').parent().siblings('.popover-toolbar').hide();
					container.append(inputUrl);
				});
				$('body').on('keyup', function(e) {
					if ( inputUrl.val() == '' && e.which == 13 ) {
						$element.replaceWith($element.contents());
						finishEdit();
					}
					if ( e.which == 27 ) {
						el.removeClass('open').removeAttr('disabled');
						$('.dm-text button, .dm-text .btn-font-holder, .popover-toolbar').not('[name="color"], [name="fake"]').show().removeClass('open');
						container.find(inputUrl, submitUrl).remove();
						finishEdit();
					}
					if ( inputUrl.val() == '' ) {
						submitUrl.removeClass('valid');
					}
					else {
						submitUrl.addClass('valid');
					}
				});
				submitUrl.on('click', function() {
					$(inputUrl).trigger('keyup');
				});
				popover.addClass('transparentInsertLink');
				container.prepend(unLinkButton);
			}
		}
	});
}]);