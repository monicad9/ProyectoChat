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
        var container = $('#contenedor2');
        container.animate({"scrollTop": container[0].scrollHeight}, "slow");
    }

    $('#enviarNombre').click(function(){
        
        socket.emit('newUser', $('#nombre_contacto').val(), function(data){
            if(data){
                $('body').css('background-color','white')
                $('#nombres_contactos').hide();
                $('.modal-backdrop').hide();
                $('#login-error').hide();
                $('.login').hide();
                $('#whatsapp').show();
                $('.cabeceraPersonal').append("<img id='fotoPersonal' src='./imagenes/persona.png'><h3>" + $('#nombre_contacto').val()) 
            }
            else{
                $('#login-error').show();

            }


/*            var selected = '';    
            $('#formid input[type=checkbox]').each(function(){
                if (this.checked) {
                    selected += $(this).val()+', ';
                }
            }); 

            if (selected != '') 
                alert('Has seleccionado: '+selected);  
            else
                alert('Debes seleccionar al menos una opción.');

            return false;
       */

        });
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
        $('#messages').append("<div class='disconnected'><span class='e'> " + data.nombre + " ha abandonado el chat</span></div>");

    })

    socket.on('user_connected',function(data){
        $('#messages').append("<div class='connected'><span class='e'>" + data.nombre + " ha entrado en el chat</span></div>");

    })
});