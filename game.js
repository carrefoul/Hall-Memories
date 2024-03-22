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

        fetch('assets/data/data.json')
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
                    let nextTextNode = jsonData.find(node => node.id === nextNodeId); 
                    showTextNodeWithTranslation(nextTextNode);
                }
            });
            optionButtonsElement.appendChild(spanA);
        }

        if (textNode.opcionB) {
            let spanB = document.createElement('span');
            spanB.innerHTML = `> ${textNode.opcionB}`; 
            spanB.classList.add('btn');
            spanB.addEventListener('click', () => {
                let nextNodeId = getNextNodeId(textNode, 'opcionB');
                console.log("Siguiente nodo ID (Opción B):", nextNodeId);
                if (nextNodeId === 'FINAL1' || nextNodeId === 'FINAL2' || nextNodeId === 'FINAL3') {
                    showFinalText(nextNodeId);
                } else {
                    let nextTextNode = jsonData.find(node => node.id === nextNodeId); 
                    showTextNodeWithTranslation(nextTextNode);
                }
            });
            optionButtonsElement.appendChild(spanB);
        }
    }


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
                nextNodeId = (optionSelected === 'opcionA') ? 6 : 'FINAL2'; 
                break;
            case 6:
                nextNodeId = (optionSelected === 'opcionA') ? 7 : 11;
                break;
            case 7:
                nextNodeId = (optionSelected === 'opcionA') ? 8 : 'FINAL2'; 
                break;
            case 8:
                nextNodeId = (optionSelected === 'opcionA') ? 9 : 'FINAL2'; 
                break;
            case 9:
                nextNodeId = (optionSelected === 'opcionA') ? 10 : -1;
                break;
            case 10:
                nextNodeId = (optionSelected === 'opcionA') ? 'FINAL1' : 'FINAL3'; 
                break;
            case 11:
                nextNodeId = (optionSelected === 'opcionA') ? 9 : 'FINAL2';
                break;
            case 'FINAL1':
                nextNodeId = -1; 
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
            escenaDialogo.style.display = 'none';
            document.querySelector('.escenaLLaves').style.display = 'block';
            return; 
        } else if (finalId === 'FINAL2') {
            finalText = "Al siguiente día, te das cuenta de que Lila ya no está en la garita. Necesitaba a alguien con quien hablar y te subiste a tu casa sin hacerle caso."; // Texto del final 2
        } else if (finalId === 'FINAL3') {
            finalText = "Han despedido a Lila, ya que encontrar las llaves era una tarea muy importante. Se dieron cuenta de que estaba teniendo pérdidas de memoria."; // Texto del final 3
        } else {
            console.error('ID de final no válido:', finalId);
            return;
        }

        escenaDialogo.style.display = 'none';
        finalScreen.style.display = 'flex'; // Mostrar la pantalla del final
        document.getElementById('finalText').innerText = finalText;

        if (finalId !== 'FINAL1') {
            let reiniciarBtn = document.getElementById('reiniciarBtn');
            reiniciarBtn.addEventListener('click', reiniciarJuego);
            reiniciarBtn.style.display = 'block';
        }
    }

    function reiniciarJuego() {
        location.reload();
    }


    window.sendText = function sendText(event) {
        let textToTranslate = document.getElementById('spanishText').value.trim();

        if (!textToTranslate) {
            console.error('Por favor, introduce un texto válido para traducir.');
            event.stopPropagation(); 
            return;
        }

        let translation = handleTranslation(textToTranslate);

        console.log(translation)

        let nextNodeId = 9; 
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
    
    function checkObjectsMoved() {
        console.log("Checking if all objects are moved correctly...");
        for (let key in objectsMoved) {
            if (!objectsMoved[key]) {
                console.log("Object not moved:", key);
                return false;
            }
        }
        console.log("All objects moved correctly!");
        return true;
    }
    
    function changeCharacterImage() {
        let personaje = document.querySelector('.personaje-llaves img');
        let lilaPerfil = document.querySelector('.lilaPerfil');
        if (personaje && lilaPerfil) {
            personaje.style.display = 'none';
            lilaPerfil.style.display = 'block';
        }
    }
    
    function setupDraggableWithLimit(selector, direction, limit, resetX, resetY) {
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
    
                if (
                    (direction === 'horizontal' && event.dx <= limit && event.dx >= 0) ||
                    (direction === 'vertical' && event.dy <= limit && event.dy >= 0)
                ) {
                    objectsMoved[selector.slice(1)] = true;
                }
    
                target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
            onend: function (event) {
                var target = event.target;
    
                setTimeout(function () {
                    target.style.transition = 'transform 0.5s';
                    target.style.transform = 'translate(' + resetX + 'px, ' + resetY + 'px)';
                    target.setAttribute('data-x', resetX);
                    target.setAttribute('data-y', resetY);
    
                    if (checkObjectsMoved()) {
                        changeCharacterImage();
                    }
                }, 500); 
            }
        });
    }
    
    setupDraggableWithLimit('.lampara-llaves', 'horizontal', -100, 0, 0);
    
    setupDraggableWithLimit('.agenda-llaves', 'vertical', 100, 0, 0);
    
    setupDraggableWithLimit('.cafe-llaves', 'vertical', -100, 0, 0);
    
    setupDraggableWithLimit('.reloj-llaves', 'vertical', 100, 0, 0);
    
    setupDraggableWithLimit('.planta-llaves', 'horizontal', -100, 0, 0);
    
    
};

