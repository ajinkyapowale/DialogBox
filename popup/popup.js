/*
 * 
 * popup 1.0 - Lightbox Popup
 * Version 1.0
 * 
 * Date: 13th Oct 2015
 *
 */
/**
 * 
 * @description Create a popup with lightbox effect.
 * 
 * @example $('div').popup();
 * @desc Create a simple popup interface.
 *
 * @option Boolean closeOnOverlayClick (optional) Boolean flag indicating if popup
 *		   should be closed if its overlay is clicked.
 * 
 * @option String closeOnOverlayClick (optional).
 *         String "open" indicating popup should open.
 *         String "close" indicating popup should close.
 * 
 * @type jQuery
 * 
 * @name popup
 * 
 * @cat Plugins/popup
 * 
 * @author Ajinkya A. Powale
 *
 **/
(function ( $ ) {
	var popups=[]; // Records open popups 
	var popupCount=0;// Records number of open popups 
	var popupContent;// Records links, buttons, inputs in the active popup
	$.fn.popup = function ( options ) {
		'use strict';
		var settings = $.extend({
            // Default settings
			status:"open",
			closeOnOverlayClick:true
        }, options );
		
		if (settings.status=="open"){// If popup status is open
			popups.push($(this));
			popupCount++;
			$('body').css({"overflow": "hidden"});// Disables scroll
			$('body').off('mousewheel');
			$('body').on({// Disables scroll, not required actually, just handled it for extra care 
				'mousewheel': function(e) {
					if (e.target.id == 'el') return;
					e.preventDefault();
					e.stopPropagation();
				}
			});
			
			var windowHeight = $(window).height();
			var windowWidth = $(window).width();
			var popHeight = $(this).outerHeight();
			var popWidth = $(this).outerWidth();
			var lightboxTopvalue = (windowHeight - popHeight)/2;
			var lightboxLeftvalue = (windowWidth - popWidth)/2;
			$(this).css({'top':lightboxTopvalue});
			$(this).css({'left':lightboxLeftvalue});
			$(this).css({'display':'block'});
			
			$(this).css({'display':'block'});
			var msgZIdx=parseInt($(this).css('z-index'));
			if ($(this).prev('.OverlayDiv').length==0){
				$(this).before('<div class="OverlayDiv"></div>');// Puts an overlay
			}
			var overlay=$(this).prev('div');
			overlay.css({'z-index':msgZIdx,'display':'block'});
			
			if (settings.closeOnOverlayClick==true){// Handeling Option
				overlay.off();
				overlay.click(function(){	
					$(this).next('.Popup').css('display','none');
					$(this).remove();
					popupCount--;
					popups.pop();
					if (popupCount==0){
						$('body').css({"overflow": "auto"});
						$('body').off('mousewheel');
					}else if (popupCount>0){
						popupContent=(popups[popupCount-1]).find('button,input,a');
						popupContent[1].focus();
					}
					//$('html').removeClass('generatedcontent');
				});
			}
			/*Adjusting Focus*/
			popupContent=null;
			popupContent=$(this).find('button,input,a');
			if (popupContent.length>1){
				$(popupContent[1]).focus();
			}else{
				$(popupContent[0]).focus();
			}
			/* Handling Popup close button*/
			var self=$(this);
			$(this).find('.Popup_close, .Popup_close_btn').off('click');
			$(this).find('.Popup_close, .Popup_close_btn').click(function(){
				self.css({'display':'none'});
				self.prev('div').remove();
				popupCount--;
				popups.pop();
				if (popupCount==0){
					$('body').css({"overflow": "auto"});
					$('body').off('mousewheel');
				}else if (popupCount>0){
					popupContent=(popups[popupCount-1]).find('button,input,a');
					popupContent[1].focus();
				}
			});
		}
		/* Handling Popup close function of the plugin; 
		can be used as : $('div').popup({status:"close"})*/
		else if(settings.status=="close"){
			if($(this).is(popups[popups.length-1])){
				var overlay=$(this).prev('div');
				$(this).css('display','none');
				overlay.remove();
				popupCount--;
				popups.pop();
				if (popupCount==0){
					$('body').css({"overflow": "auto"});
					$('body').off('mousewheel');
				}else if (popupCount>0){
					popupContent=(popups[popupCount-1]).find('button,input,a');
					popupContent[1].focus();
				}
			}else{
				console.log("Error : Cannot close popup");// Does not allow invalid popup closure.
			}
		}
		return this;
	};
	//Handels Escape and Tab actions
	$(document).keydown(function(e) {
		// ESCAPE key pressed
		if (e.keyCode == 27 && popups.length>0) {
			var popupWin=popups.pop();
			if (popupWin!=null){
				var overlay=popupWin.prev('div');
				popupWin.css('display','none');
				overlay.remove();
				popupCount--;
				if (popupCount==0){
					$('body').css({"overflow": "auto"});
					$('body').off('mousewheel');
				}else if (popupCount>0){
					popupContent=(popups[popupCount-1]).find('button,input,a');
					popupContent[1].focus();
				}
			}
		}
		//Tab key pressed
		else if (e.keyCode == 9 && popups.length>0){
			if(popupContent.filter(':last').is((e.target))){
				e.preventDefault();
				popupContent.filter(':first').focus();
			}else if (popupContent.filter(e.target).length==0){
				e.preventDefault();
				if (popupContent.length>1){
					$(popupContent[1]).focus();
				}else{
					$(popupContent[0]).focus();
				}
			}
		}
		return this;// Callback for Jquery Chaining
	});
	// Recalculating popup position if window is resized
	$(window).resize(function(){
		$.each($('.Popup:visible'),function(){
			var windowHeight = $(window).height();
			var windowWidth = $(window).width();
			var popHeight = $(this).outerHeight();
			var popWidth = $(this).outerWidth();
			var lightboxTopvalue = (windowHeight - popHeight)/2;
			var lightboxLeftvalue = (windowWidth - popWidth)/2;
			$(this).css('top',lightboxTopvalue);
			$(this).css('left',lightboxLeftvalue);
			
		});
	}); 

}( jQuery ));



