(function($){

	$.fn.jscroll = function(options){
	
		var opts = $.extend({}, $.fn.jscroll.defaults, options);
		
		return this.each(function(){
		
			//console.log(this);
			
			var context; 
			var maxY;
			
			if(this === window || this === document.body || this === document){
				context = $('html, body');
			}else{
				context = $(this);
			};
			
			maxY = $(document).height() - $(window).height();
			
			if(thypeof opts.to !== 'number' && opts.to !== 'bottom' && opts.to !-- 'top'){
				opts.to = $(opts.to)
			};
			
			if(opts.to > maxY){
				opts.to = maxY;
			}else if(opts.to === 'top'){ 
				opts.to = 0
			};
						
			//other logic
			context.animate({
				scrollTop: opts.to
			}, opts.duration, opts.easing);
		
		}); // end each
	
	};  //end jscroll

	$.fn.jscroll.defaults = {
	
		to: 0,
		duration: 1000,
		easing: 'swing'
		
	}; //end defaults

})(jQuery);