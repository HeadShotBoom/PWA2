/*
	Online Store
	Author: PUT YOUR NAME HERE
*/

$(function(){

    $('#scart').jfollow('#cartfollow', 20);

    var win = $(window);

    $('.productitem').draggable({
        cursotAt:{
            top:10,
            left:10
        },
        helper: function(){
            var title = $(this).find('h4').text();
            var price = $(this).find('.price').text();

            return $(''+
            '<div class="phelper">'+
                '<img src="images/tshirticon.png"/>'+
                '<h5>'+ title + '</h5>'+
                '<p>' + price + '</p>'+
                '</div>'

            )
        }
    });

    $('.cartdropbox').droppable({
        tolerance: 'touch',
        hoverClass: 'cartdropboxh',

        drop: function(e, ui){
            $('.emptycart').slideUp();

            var title = ui.draggable.find('h4').text();
            var price = ui.draggable.find('.price').text();
            var pid = ui.draggable.find('.productid').text();

            var cartitem = $('.cartitem[rel="' + pid + '"]');
            var isMade = cartitem.length;

            if(isMade){
                var quantity = cartitem.find('input.amount').val();
                quantity++;

                cartitem.find('input.amount').val(quantity);
            }else{
                $(''+
                    '<div class="cartitem" rel="' + pid + '">' +
                    '<span class="ui-state-default trashitem"><span class="ui-icon ui-icon-trash"></span></span>' +
                    '<span class="title">' + title + '</span>' +
                    '<input type="text" class="amount" value="1"/>'+
                    '<span class="price">' + price + '</span><div class="clear"></div>'+
                    '</div>'
                ).appendTo('.cartitems').hide().fadeIn();
            }
        }
    });

        var checkcart = function(){
            var howmany = $('.cartitem').not('.emptycart').length;

            if(howmany === 0){
                $('.emptycart').fadeIn();
            };
        };

        var emptyDialog = $('<div<p>Want to delete your cart?</p></div>').dialog({

            title: 'Empty Cart',
            autoOpen: false,
            modal: true,
            resizeable: false,
            buttons: {
                'Empty': function(){
                    $('.cartitem').not('.emptycart').fadeOut(function(){
                        $(this).remove();
                        checkcart();
                    });
                    emptyDialog.dialog('close');
                },
                'Cancel': function(){
                    emptyDialog.dialog('close');
                }
            }
        });

        $('#clearcart a').on('click', function(e){
            emptyDialog.dialog('open');
            return false;
        });

        win.on('click', '.trashitem', function(e){
            $(this).parent().fadeOut(function(){
                $(this).remove();
                checkcart();
            })
            return false;
        });
});

