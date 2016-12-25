(function() {
    PP.Tools.Drag = {
    };

    PP.Tools.Drag.init = function(){
        var $header = $('header');
        var $whatbox = $('#what');
        var $toolbox = $('#toolbox');
        var $filebox = $('#filebox');
        var $colorbox = $('#colorbox');

        /*** OUTSIDE LIBRARY STUFF - DRAGGYDIVS ***/
        var onMinimizeToolsListClick = function(e) {
            var $this = $(this);
            var $elem = $this.data('draggy');
            $elem.draggyBits('restore');
            $this.parent().remove();
        };

        var onMinimize = function($elem) {
            var $a = $('<button role="button" tabindex="0" data-section="#' + $elem.attr('data-title') + '">').html($elem.attr('title')).on('click', onMinimizeToolsListClick).data('draggy', $elem);
            $('<li></li>').append($a).appendTo(DOM.$minimizedToolsList);
        };

        DOM.$draggydivs.draggyBits({onMinimize:onMinimize});

        // if mouse up is on toolboxes, don't keep drawing
        DOM.$draggydivs.mouseup(function() {
            DOM.$canvas.off('mousemove');
        });

        /*** DRAGGY POSITIONS ***/
        $header.css({
            left: '1%',
            top : '1%'
        });
        
        // $whatbox.css({
        //     left : '560px',
        //     top : '120px'
        // });
        
        $toolbox.css({
            left : '2%',
            top : '35%'
        });
        
        $colorbox.css({
            left:'auto',
            right : '2%',
            top : '2%'
        });
        
        $filebox.css({
            top : '255px',
            left : '234px'
        });

        // init hide toolboxes
        //$whatbox.draggyBits('minimize');
        $filebox.draggyBits('minimize');

    }
}());