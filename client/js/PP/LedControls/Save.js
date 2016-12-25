(function() {
    PP.LedControls.Save = {
    };

    PP.LedControls.Save.init = function(){
        $('#saveAnimationBtn').click(saveClicked);

        $('#save-button').click(saveBtnClick);

        function saveBtnClick() {
            var a = 1;

            var pxon = JSON.parse(localStorage.make8bitartPxon);

            var x = _.uniqBy(pxon, ['x']);
            var y = _.uniqBy(pxon, ['y']);

            // remove the base x,y and divide by pixel size
            var rooted = _.map(pxon, function(item){
                function transform(n) {
                    return n/15;
                }

                return {
                    x:transform(item.x -240) ,
                    y:transform(item.y -150),
                    color: item.color
                }
            });

            // remove edges
            var trimmed = _.reject(rooted, function(pixel) { 
                return pixel.x <= 0 || pixel.x >= 33 || pixel.y >= 33 || pixel.y <= 0; 
            });

            // adjust arrays for the removed edges
            var content = _.map(trimmed, function(pixel){
                return {
                    x:pixel.x-1,
                    y:pixel.y-1,
                    color:pixel.color
                }
            });

            var toSave = {
                name: 'steve',
                data:content
            };

            PP.API.postPxon(JSON.stringify(toSave));
        }

        function saveClicked() {
            var $btn = $(this);
            
            var $modalContainer = $('#save-animation');
            var $list = $('#saveList');

            if($modalContainer.hasClass('hidden')){
                
                // show the modal
                $modalContainer.removeClass(classes.hidden);
                $modalContainer.find('.ui-hider').focus();

                // get the existing animations
                PP.API.getAnimations().then(function(data){
                    // add them to the list
                    var result = ['asdf', 'quwerty', 'asdfdsa'];

                    $list.empty();
                    result.forEach(function(val){
                        $list.append('<li class="save-list-item"><button class="green-button">asdqwert X</button></li>');
                    });
                });
            }
        }
    }
}());