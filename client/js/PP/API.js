(function() {
    PP.API = {
    };

    PP.API.getAnimations = function(state){
        return $.get( "/animations", function( data ) {
            console.log( "Led state toggled!" );
        });
    }

    PP.API.toggleLed = function(state){
        return $.get( "/led/toggle/" + state, function( data ) {
            console.log( "Led state toggled!" );
        });
    }

    PP.API.postPxon = function(body){
        return $.ajax({
            type: 'POST',
            url: '/animations',
            contentType: 'application/json',
            data: body,
            done: function(data){
                console.log("asdf");
            }
        });
    }
}());