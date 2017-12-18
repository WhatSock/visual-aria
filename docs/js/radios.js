$(function(){
	var index = 0, radios = $('a[role="radio"]');
	radios.bind(
					{
					keydown: function(ev){
						var k = ev.which || ev.keyCode;

						if (k >= 37 && k <= 40){
							if (k == 37 || k == 38){
								if (index > 0)
									index--;

								else
									index = radios.length - 1;
							}

							else if (k == 39 || k == 40){
								if (index < (radios.length - 1))
									index++;

								else
									index = 0;
							}
							$(radios.get(index)).click();
							ev.preventDefault();
						}
					},
					click: function(ev){
						index = $.inArray(this, radios.get());
						setFocus();
						ev.preventDefault();
					}
					});
	var setFocus = function(){
		radios.attr(
						{
						tabindex: '-1',
						'aria-checked': 'false'
						});

		$(radios.get(index)).attr(
						{
						tabindex: '0',
						'aria-checked': 'true'
						}).focus();
	};
});