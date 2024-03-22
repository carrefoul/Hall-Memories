window.onload = () => {
    let nombreJugador = '';
    let jsonData; // Variable global para almacenar los datos del JSON
    let nuevaPartidaBtn = document.getElementById('nuevaPartidaBtn');
    let form = document.querySelector('.form');
    let continuarBtn = document.getElementById('continuar');
    let pantallaInicial = document.getElementById('pantallaInicial');
    let nombreJugadorDiv = document.querySelector('.nombreJugador');
    let escenaDialogo = document.querySelector('.escenaDialogo');
    let textElement = document.getElementById('text');
    let optionButtonsElement = document.getElementById('option-buttons');

    nuevaPartidaBtn.addEventListener('click', () => {
        nuevaPartidaBtn.style.display = 'none';
        nombreJugadorDiv.style.display = 'block';
    });

    continuarBtn.addEventListener('click', () => {
        let nombreInput = document.getElementById('nombre').value;
        nombreJugador = nombreInput.charAt(0).toUpperCase() + nombreInput.slice(1).toLowerCase();
        form.style.display = 'none';
        pantallaInicial.style.display = 'none';
        escenaDialogo.style.display = 'flex';

        fetch('../assets/data/data.json')
            .then(response => response.json())
            .then(data => {
                jsonData = data; // Almacenar los datos en la variable global
                // Reemplazar todas las instancias de "(nombreJugador)" en el JSON
                jsonData.forEach(node => {
                    if (node.Lila.includes('(nombreJugador)')) {
                        node.Lila = node.Lila.replace('(nombreJugador)', nombreJugador);
                    }
                    if (node.opcionA.includes('(nombreJugador)')) {
                        node.opcionA = node.opcionA.replace('(nombreJugador)', nombreJugador);
                    }
                    // Modificar (textoFrancés) por un span donde se mostrará la traducción
                    if (node.Lila.includes('(textoFrancés)')) {
                        node.Lila = node.Lila.replace('(textoFrancés)', '<span id="translatedText"></span>');
                    }
                    // Modificar las opciones si contienen "(textoEspañol)"
                    // Reemplazar (textoEspañol) por un área de texto en las opciones A y B
                    if (node.opcionA && node.opcionA.includes('(textoEspañol)')) {
                        let indexA = node.opcionA.indexOf('(textoEspañol)');
                        let beforeA = node.opcionA.substring(0, indexA);
                        let afterA = node.opcionA.substring(indexA + '(textoEspañol)'.length);
                        node.opcionA = beforeA + '<span id="spanishTextContainer"><input id="spanishText" onclick="event.stopPropagation()"></input><span id="translateButton" class="option" onclick="sendText(event)">Enviar</span></span>' + afterA;
                    }

                });
                // Mostrar el primer nodo del diálogo con traducción
                showFirstTextNodeWithTranslation();
            })
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
            });
    });

    function translateText(text) {
        return fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|fr`)
            .then(response => response.json())
            .then(data => {
                // Extrae y devuelve el texto traducido de la respuesta
                console.log(data.responseData.translatedText)
                return data.responseData.translatedText;
            })
            .catch(error => {
                console.error('Error al traducir el texto:', error);
                return null;
            });
    }


    // Función para manejar la traducción dentro del diálogo
    function handleTranslation(text) {
        return new Promise((resolve, reject) => {
            // Traduce el texto ingresado
            translateText(text)
                .then(translation => {
                    if (translation) {
                        // Muestra la traducción en el lugar correspondiente
                        let translatedText = document.getElementById('translatedText');
                        translatedText.textContent = translation;
                        resolve();
                    } else {
                        reject('Error al traducir el texto');
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    function showTextNodeWithTranslation(textNode) {
        console.log("Mostrando nodo de texto:", textNode);

        // Verificar si es un nodo final
        if (textNode.id === 'FINAL1' || textNode.id === 'FINAL2' || textNode.id === 'FINAL3') {
            console.log("Es un nodo final:", textNode.id);
            // Mostrar el texto del final correspondiente
            showFinalText(textNode.id);
            return;
        }

        textElement.innerHTML = textNode.Lila;
        optionButtonsElement.innerHTML = '';

        if (textNode.opcionA) {
            let spanA = document.createElement('span');
            spanA.innerHTML = `> ${textNode.opcionA}`; // Agrega el símbolo ">" delante de la opción A
            spanA.classList.add('btn');
            spanA.addEventListener('click', () => {
                let nextNodeId = getNextNodeId(textNode, 'opcionA');
                console.log("Siguiente nodo ID (Opción A):", nextNodeId);
                if (nextNodeId === 'FINAL1' || nextNodeId === 'FINAL2' || nextNodeId === 'FINAL3') {
                    // Mostrar el texto del final correspondiente
                    showFinalText(nextNodeId);
                } else {
                    let nextTextNode = jsonData.find(node => node.id === nextNodeId); // Usar la variable global jsonData
                    // Avanzar al siguiente nodo
                    showTextNodeWithTranslation(nextTextNode);
                }
            });
            optionButtonsElement.appendChild(spanA);
        }

        if (textNode.opcionB) {
            let spanB = document.createElement('span');
            spanB.innerHTML = `> ${textNode.opcionB}`; // Agrega el símbolo ">" delante de la opción B
            spanB.classList.add('btn');
            spanB.addEventListener('click', () => {
                let nextNodeId = getNextNodeId(textNode, 'opcionB');
                console.log("Siguiente nodo ID (Opción B):", nextNodeId);
                if (nextNodeId === 'FINAL1' || nextNodeId === 'FINAL2' || nextNodeId === 'FINAL3') {
                    // Mostrar el texto del final correspondiente
                    showFinalText(nextNodeId);
                } else {
                    let nextTextNode = jsonData.find(node => node.id === nextNodeId); // Usar la variable global jsonData
                    // Avanzar al siguiente nodo
                    showTextNodeWithTranslation(nextTextNode);
                }
            });
            optionButtonsElement.appendChild(spanB);
        }
    }




    // Muestra el primer nodo del diálogo con la traducción
    function showFirstTextNodeWithTranslation() {
        let textNode = jsonData.find(node => node.id === 1);
        showTextNodeWithTranslation(textNode);
    }

    function getNextNodeId(textNode, optionSelected) {
        let nextNodeId = -1;
        switch (textNode.id) {
            case 1:
                nextNodeId = (optionSelected === 'opcionA') ? 2 : 3;
                break;
            case 2:
                nextNodeId = (optionSelected === 'opcionA') ? 3 : -1;
                break;
            case 3:
                nextNodeId = (optionSelected === 'opcionA') ? 4 : 6;
                break;
            case 4:
                nextNodeId = 5;
                break;
            case 5:
                nextNodeId = (optionSelected === 'opcionA') ? 6 : 'FINAL2'; // Opción B lleva al final 2
                break;
            case 6:
                nextNodeId = (optionSelected === 'opcionA') ? 7 : 11;
                break;
            case 7:
                nextNodeId = (optionSelected === 'opcionA') ? 8 : 'FINAL2'; // Opción B lleva al final 2
                break;
            case 8:
                nextNodeId = (optionSelected === 'opcionA') ? 9 : 'FINAL2'; // Opción B lleva al final 2
                break;
            case 9:
                nextNodeId = (optionSelected === 'opcionA') ? 10 : -1;
                break;
            case 10:
                nextNodeId = (optionSelected === 'opcionA') ? 'FINAL1' : 'FINAL3'; // Opción A lleva al final 1, Opción B lleva al final 3
                break;
            case 11:
                nextNodeId = (optionSelected === 'opcionA') ? 9 : 'FINAL2'; // Opción B lleva al final 2
                break;
            case 'FINAL1':
                nextNodeId = -1; // No hay siguiente nodo, ir directamente al final 1
                break;
            default:
                break;
        }
        console.log("Siguiente nodo ID:", nextNodeId);
        return nextNodeId;
    }



    function showFinalText(finalId) {
        console.log("Mostrando texto final para ID:", finalId);

        let finalText;
        if (finalId === 'FINAL1') {
            // Ocultar el diálogo y mostrar la escena de llaves
            escenaDialogo.style.display = 'none';
            document.querySelector('.escenaLLaves').style.display = 'block';
            return; // Salir de la función sin establecer el texto en el Final 1
        } else if (finalId === 'FINAL2') {
            finalText = "Al siguiente día, te das cuenta de que Lila ya no está en la garita. Necesitaba a alguien con quien hablar y te subiste a tu casa sin hacerle caso."; // Texto del final 2
        } else if (finalId === 'FINAL3') {
            finalText = "Han despedido a Lila, ya que encontrar las llaves era una tarea muy importante. Se dieron cuenta de que estaba teniendo pérdidas de memoria."; // Texto del final 3
        } else {
            console.error('ID de final no válido:', finalId);
            return;
        }

        // Ocultar el diálogo y mostrar el texto del final
        escenaDialogo.style.display = 'none';
        finalScreen.style.display = 'flex'; // Mostrar la pantalla del final
        document.getElementById('finalText').innerText = finalText;

        // Mostrar el botón para reiniciar el juego si no es la escenaLLaves
        if (finalId !== 'FINAL1') {
            let reiniciarBtn = document.getElementById('reiniciarBtn');
            reiniciarBtn.addEventListener('click', reiniciarJuego);
            reiniciarBtn.style.display = 'block';
        }
    }

    // Función para reiniciar el juego
    function reiniciarJuego() {
        location.reload(); // Recargar la página para reiniciar el juego
    }


    window.sendText = function sendText(event) {
        let textToTranslate = document.getElementById('spanishText').value.trim();

        if (!textToTranslate) {
            console.error('Por favor, introduce un texto válido para traducir.');
            event.stopPropagation(); // Detiene la propagación del evento clic para evitar que se active el botón de opción
            return;
        }

        let translation = handleTranslation(textToTranslate);

        console.log(translation)

        let nextNodeId = 9; // ID del siguiente nodo deseado
        let nextTextNode = jsonData.find(node => node.id === nextNodeId);

        if (nextTextNode) {
            showTextNodeWithTranslation(nextTextNode);
        } else {
            console.error('No se encontró el nodo con ID:', nextNodeId);
        }
    }

    let objectsMoved = {
        lampara: false,
        reloj: false,
        agenda: false,
        planta: false,
        cafe: false
    };

    // Función para verificar si todos los objetos se han movido
    function checkObjectsMoved() {
        console.log("Checking if all objects are moved...");
        for (let key in objectsMoved) {
            if (!objectsMoved[key]) {
                console.log("Object not moved:", key);
                return false;
            }
        }
        console.log("All objects moved!");
        return true;
    }

    // Función para cambiar la imagen del personaje a .lilaPerfil y ocultar la imagen original
    // Función para cambiar la imagen del personaje a .lilaPerfil y ocultar la imagen original
    function changeCharacterImage() {
        let personaje = document.querySelector('.personaje-llaves img');
        let lilaPerfil = document.querySelector('.lilaPerfil');
        if (personaje && lilaPerfil) {
            personaje.style.display = 'none';
            lilaPerfil.style.display = 'block';
        }
    }

    // Función para configurar el comportamiento de arrastre con límite
    function setupDraggableWithLimit(selector, resetX, resetY) {
        interact(selector).draggable({
            restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            inertia: true,
            autoScroll: true,
            onmove: function (event) {
                var target = event.target;
                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // Aplicar la transformación con las nuevas coordenadas
                target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

                // Actualizar los atributos de posición
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
            onend: function (event) {
                var target = event.target;

                // Establecer un temporizador para devolver el objeto a su posición original
                setTimeout(function () {
                    target.style.transition = 'transform 0.5s';
                    target.style.transform = 'translate(' + resetX + 'px, ' + resetY + 'px)';
                    target.setAttribute('data-x', resetX);
                    target.setAttribute('data-y', resetY);

                    // Llamar a la función para cambiar la imagen del personaje cuando se complete el arrastre de todos los objetos
                    changeCharacterImage();
                }, 500); // Tiempo ajustado a 0.5 segundos
            }
        });
    }

    // Configurar el comportamiento para la agenda
    setupDraggableWithLimit('.agenda-llaves', 0, 0);

    // Configurar el comportamiento para la taza de café
    setupDraggableWithLimit('.cafe-llaves', 0, 0);

    // Configurar el comportamiento para el reloj
    setupDraggableWithLimit('.reloj-llaves', 0, 0);

    // Configurar el comportamiento para la planta
    setupDraggableWithLimit('.planta-llaves', 0, 0);

    // Configurar el comportamiento para la lámpara
    setupDraggableWithLimit('.lampara-llaves', 0, 0);



};

