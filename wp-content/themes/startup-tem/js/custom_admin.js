/* 
 * This one customize wp admin page
 */
jQuery(document).ready(function(e) {
    var visualEditorButton = jQuery('#sf_meta_visual_editor .button.visual_editor');
    var savePostButton = jQuery('#save-post');
    var updateButton = jQuery('#publishing-action [name = "save"]');

    var handleVisualEditorPress = function() {
        visualEditorButton.bind('click', function(e){
            e.preventDefault();
            // Save draft
            jQuery(this).after('<input name="visualEditorHref" type="hidden" id="visual_editor_redirect" value="'+visualEditorButton.attr('href')+'">');
            savePostButton.click();
            // Update
            updateButton.click();
        });
    }

    handleVisualEditorPress();
});
