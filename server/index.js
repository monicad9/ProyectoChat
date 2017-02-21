var express = require("express"),
	app = express(),
	http = require('http').Server(app),
	path = require('path'),
	io = require('socket.io')(http),
	dl = require('delivery'),
	fs = require('fs'),
	nombres_usuarios = {};

var port = process.env.PORT || '3000';

app.use(express.static('public'));


app.get('/',function(peticion,respuesta){
		respuesta.sendFile(path.normalize(__dirname + "/../public/index.html"));
});

io.sockets.on('connection' ,function(socket){
	socket.on('sendMessage' , function(data){
		io.sockets.emit('newMessage', data);
	});

	socket.on("newUser", function(data, callback){

		if (data in nombres_usuarios){
			callback(false);
		}
		else{
			callback(true);
			socket.nombre_usuario = data;
			nombres_usuarios[socket.nombre_usuario] = 1;
			actualizar_usuarios();
		}
	})

	socket.on('disconnect', function(data){
		if (socket.nombre_usuario){
			delete nombres_usuarios[socket.nombre_usuario];
			actualizar_usuarios();
		}
	});

	function actualizar_usuarios(){
		io.sockets.emit('Usuarios', nombres_usuarios);
	}
});



























//COPIA DE SEGURIDAD
/*io.on('connection' , function(socket){
	console.log('New user connected');

	socket.on('disconnect', function(){
    	console.log('The user has gone'); 
    });

    socket.on('chat message', function(msg){
    	console.log('message: ' + msg);
    	io.emit('chat message', msg); 
    });

	

	var delivery = dl.listen(socket);
		delivery.on('receive.success',function(file){
	    	var params = file.params;
	    	fs.writeFile(path.normalize(__dirname + "/../public/" + file.name),file.buffer, function(err){
		      	if(err){
		        	console.log('File could not be saved.');
		      	}

		      	else{
		        	console.log('File saved.');
		      	};
	    	});
	  	});
*/
/*
	delivery.on('delivery.connect',function(delivery){
	 
	    delivery.send({
	      name: 'sample-image.jpg',
	      path : './sample-image.jpg',
	      params: {foo: 'bar'}
	    });
	 
	    delivery.on('send.success',function(file){
	      console.log('File successfully sent to client!');
	    });
	 
	});

	fs.writeFile(file.name, file.buffer, function(err){
	    if(err){
	        console.log('File could not be saved: ' + err);
	    }
	    else{
	        console.log('File ' + file.name + " saved");
	    };
	});


});
*/

http.listen(port,function(){
	console.log("OK. Aplicacion escuchando en puerto 3000");
});

