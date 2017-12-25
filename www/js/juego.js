var app={
  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    
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
    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });
      
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      
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
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;

    objetivo.body.x = app.inicioX(); //si tocamos lo recolocamos
    objetivo.body.y = app.inicioY();
  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+1;
    scoreText.text = puntuacion;

    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();

    if (puntuacion > 0){
      //dificultad = dificultad + 1;
      dificultad=puntuacion;// si perdemos puntos lo suavizamos
    }
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
