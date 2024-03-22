// (id=1
//     opcionA: lleve a id=2
//     opcionB: lleve a id=3
// )
// (id=2
//     opcionA: lleve a id=3
// )
// (id=3
//     opcionA: lleve a id=4
//     opcionB: lleve a id=6
// )
// (id=4
//     opcionA: lleve a id=5
//     opcionB: lleve a id=5
// )
// (id=5
//     opcionA: lleve a id=6
//     opcionB: lleve a texto que ponga FINAL 2
// )
// (id=6
//     opcionA: lleve a id=7
//     opcionB: lleve a id=11
// )
// (id=7
//     opcionA: lleve a id=8
//     opcionB: lleve a texto que ponga FINAL 2
// )
// (id=8
//     opcionA: lleve a id=9
//     opcionB: lleve a texto que ponga FINAL 2
// )
// (id=9
//     opcionA: lleve a id=10
// )
// (id=10
//     opcionA: lleve a texto que ponga FINAL 1
//     opcionB: lleve a texto que ponga FINAL 3
// )
// (id=11
//     opcionA: lleve a id=9
//     opcionB: lleve a texto que ponga FINAL 2
// )


// window.onload = () => {
//     // Crear la escena de la pantalla de inicio
//     class PantallaInicio extends Phaser.Scene {
//         letructor() {
//             super({ key: 'PantallaInicio' });
//         }

//         preload() {
//             // Cargar el archivo JSON
//             this.load.json('decisiones', '../assets/data/data.json');
//         }

//         create() {
//             // Agregar el botón de Nueva partida
//             let nuevaPartidaBtn = this.add.text(640, 360, 'Nueva partida', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
//             nuevaPartidaBtn.setInteractive();

//             // Configurar evento de clic para el botón de Nueva partida
//             nuevaPartidaBtn.on('pointerdown', () => {
//                 // Ocultar el botón de Nueva partida
//                 nuevaPartidaBtn.setVisible(false);

//                 // Ocultar el formulario HTML y el botón de continuar
//                 let form = document.querySelector('.form');
//                 let continuarBtn = document.getElementById('continuar');
//                 form.style.display = 'block';
//                 continuarBtn.style.display = 'block';
//             });

//             // Obtener el botón de continuar
//             let continuarBtn = document.getElementById('continuar');

//             // Configurar evento de clic para el botón de continuar
//             continuarBtn.addEventListener('click', () => {
//                 // Obtener el valor del nombre del jugador
//                 let nombreJugador = document.getElementById('nombre').value;

//                 if (nombreJugador) {
//                     // Ocultar el formulario HTML y el botón de continuar
//                     let form = document.querySelector('.form');
//                     let continuarBtn = document.getElementById('continuar');
//                     form.style.display = 'none';
//                     continuarBtn.style.display = 'none';

//                     // Cambiar a la escena de diálogo
//                     this.scene.start('EscenaDialogo', { nombreJugador, id: 1 }); // Iniciar en el ID 1
//                 } else {
//                     alert('Por favor, introduce tu nombre.');
//                 }
//             });
//         }
//     }

//     // Crear la escena de diálogo
//     class EscenaDialogo extends Phaser.Scene {
//         letructor() {
//             super({ key: 'EscenaDialogo' });
//         }

//         create(data) {
//             // Obtener el nombre del jugador y el ID de la escena
//             let nombreJugador = data.nombreJugador;
//             let idEscena = data.id;

//             // Obtener el archivo JSON cargado
//             let decisiones = this.cache.json.get('decisiones');

//             // Obtener el diálogo correspondiente al ID de la escena
//             let dialogo = decisiones.find(dialogo => dialogo.id === idEscena);

//             // Reemplazar (nombreJugador) con el nombre del jugador en la opción A
//             let opcionA = dialogo.opcionA.replace('(nombreJugador)', nombreJugador);

//             // Mostrar el diálogo y las opciones en la pantalla
//             this.add.text(640, 200, dialogo.Lila, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
//             this.add.text(400, 300, opcionA, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
//                 // Cambiar a la escena de diálogo correspondiente a la opción A
//                 this.cambiarEscena(dialogo.opcionB === undefined ? idEscena + 1 : dialogo.id + 1);
//             });
//             this.add.text(400, 350, dialogo.opcionB, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
//                 // Cambiar a la escena de diálogo correspondiente a la opción B
//                 this.cambiarEscena(dialogo.id + 2);
//             });
//         }

//         cambiarEscena(idEscena) {
//             // Cambiar a la escena de diálogo correspondiente al ID proporcionado
//             this.scene.start('EscenaDialogo', { nombreJugador: data.nombreJugador, id: idEscena });
//         }
//     }

//     // Configurar el juego con las escenas creadas
//     let config = {
//         type: Phaser.AUTO,
//         scale: {
//             mode: Phaser.Scale.FIT,
//             autoCenter: Phaser.Scale.CENTER_BOTH,
//             width: 1920,
//             height: 1080
//         }, 
//         scene: [PantallaInicio, EscenaDialogo]       
//     };

//     // Crear una instancia del juego con la configuración proporcionada
//     let game = new Phaser.Game(config);
// };



// window.onload = () => {
//     // Crear la escena de la pantalla de inicio
//     class PantallaInicio extends Phaser.Scene {
//         letructor() {
//             super({ key: 'PantallaInicio' });
//         }

//         preload() {
//             // Cargar el archivo JSON
//             this.load.json('decisiones', '../assets/data/data.json');
//         }

//         create() {
//             // Agregar el botón de Nueva partida
//             let nuevaPartidaBtn = this.add.text(640, 360, 'Nueva partida', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
//             nuevaPartidaBtn.setInteractive();

//             // Configurar evento de clic para el botón de Nueva partida
//             nuevaPartidaBtn.on('pointerdown', () => {
//                 // Ocultar el botón de Nueva partida
//                 nuevaPartidaBtn.setVisible(false);

//                 // Ocultar el formulario HTML y el botón de continuar
//                 let form = document.querySelector('.form');
//                 let continuarBtn = document.getElementById('continuar');
//                 form.style.display = 'block';
//                 continuarBtn.style.display = 'block';
//             });

//             // Obtener el botón de continuar
//             let continuarBtn = document.getElementById('continuar');

//             // Configurar evento de clic para el botón de continuar
//             continuarBtn.addEventListener('click', () => {
//                 // Obtener el valor del nombre del jugador
//                 let nombreJugador = document.getElementById('nombre').value;

//                 if (nombreJugador) {
//                     // Ocultar el formulario HTML y el botón de continuar
//                     let form = document.querySelector('.form');
//                     let continuarBtn = document.getElementById('continuar');
//                     form.style.display = 'none';
//                     continuarBtn.style.display = 'none';

//                     // Cambiar a la escena de diálogo
//                     this.scene.start('EscenaDialogo', { nombreJugador, id: 1 }); // Iniciar en el ID 1
//                 } else {
//                     alert('Por favor, introduce tu nombre.');
//                 }
//             });
//         }
//     }

//     // Crear la escena de diálogo
//     class EscenaDialogo extends Phaser.Scene {
//         letructor() {
//             super({ key: 'EscenaDialogo' });
//         }

//         create(data) {
//             // Obtener el nombre del jugador y el ID de la escena
//             let nombreJugador = data.nombreJugador;
//             let idEscena = data.id;

//             // Obtener el archivo JSON cargado
//             let decisiones = this.cache.json.get('decisiones');

//             // Obtener el diálogo correspondiente al ID de la escena
//             let dialogo = decisiones.find(dialogo => dialogo.id === idEscena);

//             // Reemplazar (nombreJugador) con el nombre del jugador en la opción A
//             let opcionA = dialogo.opcionA.replace('(nombreJugador)', nombreJugador);

//             // Mostrar el diálogo y las opciones en la pantalla
//             this.add.text(640, 200, dialogo.Lila, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
//             this.add.text(400, 300, opcionA, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
//                 // Cambiar a la escena de diálogo correspondiente a la opción A
//                 this.cambiarEscena(dialogo.opcionB === undefined ? idEscena + 1 : dialogo.id + 1);
//             });
//             this.add.text(400, 350, dialogo.opcionB, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
//                 // Cambiar a la escena de diálogo correspondiente a la opción B
//                 this.cambiarEscena(dialogo.id + 2);
//             });
//         }

//         cambiarEscena(idEscena) {
//             // Cambiar a la escena de diálogo correspondiente al ID proporcionado
//             this.scene.start('EscenaDialogo', { nombreJugador: data.nombreJugador, id: idEscena });
//         }
//     }

//     // Configurar el juego con las escenas creadas
//     let config = {
//         type: Phaser.AUTO,
//         scale: {
//             mode: Phaser.Scale.FIT,
//             autoCenter: Phaser.Scale.CENTER_BOTH,
//             width: 1920,
//             height: 1080
//         }, 
//         scene: [PantallaInicio, EscenaDialogo]       
//     };

//     // Crear una instancia del juego con la configuración proporcionada
//     let game = new Phaser.Game(config);
// };



