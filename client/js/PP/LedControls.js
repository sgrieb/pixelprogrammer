(function() {
    PP.LedControls = {
    };

    PP.LedControls.init = function(){
        
        PP.LedControls.Save.init();
        $('#startLedBtn').click(toggleLed);

        function toggleLed() {
            var $btn = $(this);
            if($btn.data('state') == 'stopped') {
                PP.API.toggleLed(1).then(function(result) {
                    if(result.err){
                        console.log('LED Toggle failed!');
                        return;
                    }

                    $btn.css('background', 'red');
                    $btn.text('Stop LEDs!');
                    $btn.data('state', 'started');
                });
            }
            else if ($btn.data('state') == 'started') {
                PP.API.toggleLed(0).then(function(result) {
                    if(result.err){
                        console.log('LED Toggle failed!');
                        return;
                    }

                    $btn.css('background', 'lime');
                    $btn.text('Start LEDs!');
                    $btn.data('state', 'stopped');
                });
            }
        }
    }
}());