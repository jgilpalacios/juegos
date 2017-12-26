var app={
  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    puntuacionMax=0;//máximo conseguido
    nivel = 0; //  dos niveles
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#f27d0c';
      game.load.image('bola', 'assets/bola.png');
      game.load.image('objetivo', 'assets/objetivo.png');
      game.load.image('obstaculo', 'assets/obstaculo.png');
      game.load.image('obstaculo2', 'assets/obstaculo2.png');
      game.load.image('obstaculo3', 'assets/obstaculo3.png');
    }

    function create() {
      nivelText = game.add.text(16, 16, 'NIVEL:'+nivel, { fontSize: '50px', fill: '#757676' });
      maxText = game.add.text(16, 66, 'MÁXIMO:'+puntuacionMax, { fontSize: '50px', fill: '#757676' });
      scoreText = game.add.text(16, 106, 'PUNTOS: '+puntuacion, { fontSize: '50px', fill: '#757676' });
      
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      obstaculo = game.add.sprite(alto+ancho, alto+ancho, 'obstaculo'); //fuera del tablero
      obstaculo2 = game.add.sprite(alto+ancho, alto+ancho, 'obstaculo2'); //fuera del tablero
      obstaculo3 = game.add.sprite(alto+ancho, alto+ancho, 'obstaculo3'); //fuera del tablero

      game.physics.arcade.enable(obstaculo3);
      game.physics.arcade.enable(obstaculo2);
      game.physics.arcade.enable(obstaculo);
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);

      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
    }

    function update(){
      var factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
      game.physics.arcade.overlap(bola, obstaculo, app.decrementaObstaculo, null, this);
      game.physics.arcade.overlap(bola, obstaculo2, app.decrementaObstaculo2, null, this);
      game.physics.arcade.overlap(bola, obstaculo3, app.decrementaObstaculo3, null, this);
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    if (puntuacion > -10){ // solo bajamos hasta -10
	puntuacion--;
    	scoreText.text = 'PUNTOS: '+ puntuacion;
    }
  },

  decrementaObstaculo: function(){
	if (puntuacion > -10){ // solo bajamos hasta -10
		puntuacion-=2;
		if(puntuacion<-10) puntuacion= -10;
    		scoreText.text = 'PUNTOS: '+ puntuacion;
	}
	obstaculo.body.x = app.inicioX();
	obstaculo.body.y = app.inicioY();
  },
  decrementaObstaculo2: function(){
	if (puntuacion > -10){ // solo bajamos hasta -10
		puntuacion-=3;
		if(puntuacion<-10) puntuacion= -10;
    		scoreText.text = 'PUNTOS: '+ puntuacion;

	}
	obstaculo2.body.x = app.inicioX();
	obstaculo2.body.y = app.inicioY();
  },
  decrementaObstaculo3: function(){
	if (puntuacion > -10){ // solo bajamos hasta -10
		puntuacion-=4;
		if(puntuacion<-10) puntuacion= -10;
    		scoreText.text = 'PUNTOS: '+ puntuacion;
	}
	obstaculo3.body.x = app.inicioX();
	obstaculo3.body.y = app.inicioY();
  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+1;
    if (puntuacion>puntuacionMax) puntuacionMax=puntuacion;
    scoreText.text = 'PUNTOS: '+ puntuacion;
    maxText.text='MÁXIMO:'+puntuacionMax;
    
    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();
    if(nivel==0){
	if(puntuacion>20){
		nivel=1;//pasamos de nivel
                nivelText.text = 'NIVEL:'+nivel; 
		obstaculo.body.x = app.inicioX(); //hacemos visible el obstaculo
		obstaculo.body.y = app.inicioY();
	}
    }
    if(nivel==1){
	if(puntuacion>40){
		nivel=2;//pasamos de nivel
                nivelText.text = 'NIVEL:'+nivel; 
		obstaculo2.body.x = app.inicioX(); //hacemos visible el obstaculo
		obstaculo2.body.y = app.inicioY();
	}
    }
    if(nivel==2){
	if(puntuacion>60){
		nivel=3;//pasamos de nivel
                nivelText.text = 'NIVEL:'+nivel; 
		obstaculo3.body.x = app.inicioX(); //hacemos visible el obstaculo
		obstaculo3.body.y = app.inicioY();
	}
    }

    //if (puntuacion > 0){
      //dificultad = dificultad + 1;
      dificultad=puntuacion-nivel*20;// si perdemos puntos lo suavizamos
      if (dificultad<0) dificultad=0; // no permitimos dificultades negativas
    //}
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - 1.1*DIAMETRO_BOLA );//no comenzamos tocando los límites 1.1
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - 1.1*DIAMETRO_BOLA );//no comenzamos tocando los límites 1.1
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = Math.abs(datosAceleracion.x) > 10;//puede ser negativa y lo tenemos en cuenta (abs)
    var agitacionY = Math.abs(datosAceleracion.y) > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}
