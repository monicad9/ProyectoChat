var socket = io.connect();
var cont = "";
var intervalo = "";

$(function(){

    $('#m').keydown(function(){
        
        if (!intervalo){
            socket.emit('writing');
        }

        else{
            clearTimeout(intervalo);

        }
        
        intervalo = setTimeout(acabaEscribir, 1000);
        
    })

    function acabaEscribir(){
        socket.emit('stopWriting');
        intervalo = null;
    }


    socket.on('typing', function(data) {
        $(".typing").html(data.nombre + " está escribiendo...");
            
    });

    socket.on('noTyping', function(data){
        $(".typing").html("");
    })

    function animateScroll(){
        var container = $('#cont_messages');
        container.animate({"scrollTop": container[0].scrollHeight}, "slow");
    }

    $('#enviarNombre').click(function(){
      
        if ($('#nombre_contacto').val()!= ""){
            if ($('input:radio[name="av_select"]').is(':checked')){
                socket.emit('newUser', $('#nombre_contacto').val(), function(data){
                    if(data){
                        $('body').css('background-color','white')
                        $('#nombres_contactos').hide();
                        $('.modal-backdrop').hide();
                        $('#login-error').hide();
                        $('.login').hide();
                        $('#whatsapp').show();
                        var estado = $('#estado').val()

                        var img= $('input:radio[name=av_select]:checked').val();
                        if (estado == ""){
                            estado = 'Online'
                        }
                        $('.cabeceraPersonal').append("<img id='fotoPersonal' src='" + img + "'>" + $('#nombre_contacto').val() + "<div class='estado'>'" + estado + "'</div>") 
                    }
                    else{
                        $('#login-error').show();

                    }                             
                });
            }

            else{
              $('#login-error2').show();  
            }
        }
        
        else{
            $('#login-error3').show();

        }

    });

    $('.messageTextarea').keydown(function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        if ($('#m').val().trim()!=''){
            socket.emit('sendMessage' , $('#m').val());
            $('#m').val('');
            return false;
        }
        
        
     }
    });

    $('form').submit(function(e){
        e.preventDefault();
        if ($('#m').val().trim()!=''){
            socket.emit('sendMessage' , $('#m').val());
            $('#m').val('');
            return false;
        }
    });

    socket.on('newMessage' , function(data){
        
        $('.arrow_box').append('<div class="texto"><div class="nick">' + data.nombre + "</div><div class='msg'><p>" +  data.msg + "</p></div></div>");
        animateScroll();
    })

    socket.on('Usuarios', function(data){
        $('.usuarios_conectados').html("");
        /*cont += 1;*/
        for (var a in data){
            $('.usuarios_conectados').append("<div class='cont_connected'><img id='fotoPersonal' src='./imagenes/persona.png'>" +  a + "</div>");


        }

    })

    socket.on('user_disconnect',function(data){
        $('.arrow_box').append("<div class='disconnected'><span class='e'> " + data.nombre + " ha abandonado el chat</span></div>");

    })

    socket.on('user_connected',function(data){
        $('.arrow_box').append("<div class='connected'><span class='e'>" + data.nombre + " ha entrado en el chat</span></div>");

    })


    $('#imagefile').on('change', function(e){
        var file = e.originalEvent.target.files[0],
            reader = new FileReader();

        reader.onload = function(evt){

            socket.emit('user_image', evt.target.result);
        };

        reader.readAsDataURL(file);  
    });

    socket.on('user_image', image);

    function image (data) {

        $('.arrow_box').append('<div class="texto"><div class="nick">' + data.nombre + "</div><div class='msg'><a target='_blank' href='" +  data.msg + "'><img id='imgsend' src='"  + data.msg + "'></a></div></div>");
    }

});












