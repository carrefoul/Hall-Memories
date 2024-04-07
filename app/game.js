window.onload = () => {
    let nombreJugador = '';
    let jsonData; 
    let nuevaPartidaBtn = document.getElementById('nuevaPartidaBtn');
    let form = document.querySelector('.form');
    let continuarBtn = document.getElementById('continuar');
    let pantallaInicial = document.getElementById('pantallaInicial');
    let nombreJugadorDiv = document.querySelector('.nombreJugador');
    let escenaDialogo = document.querySelector('.escenaDialogo');
    let textElement = document.getElementById('text');
    let optionButtonsElement = document.getElementById('option-buttons');
    let mensajeError = document.getElementById('mensajeError'); 
    let finalScreen = document.getElementById('finalScreen'); 
    let audio = document.getElementById('audio');
    let audioOnButton = document.querySelector('.on');
    let audioOffButton = document.querySelector('.off');
    let clickSound = document.getElementById('clickSound');
    let controlAudio = document.querySelector('.controlAudio');

    function playClickSound() {
        clickSound.currentTime = 0.08;
        clickSound.volume = 0.1;
        clickSound.play();
        clickSound.loop = false; 
    }
    nuevaPartidaBtn.addEventListener('click', playClickSound);
    continuarBtn.addEventListener('click', playClickSound);

    function turnAudioOn() {
        audio.play();
        audioOffButton.style.display = 'inline'; 
        audioOnButton.style.display = 'none'; 
    }

    function turnAudioOff() {
        audio.pause(); 
        audioOnButton.style.display = 'inline';
        audioOffButton.style.display = 'none'; 
    }

    audioOnButton.addEventListener('click', turnAudioOn); 
    audioOffButton.addEventListener('click', turnAudioOff); 


    nuevaPartidaBtn.addEventListener('click', () => {
        nuevaPartidaBtn.style.display = 'none';
        nombreJugadorDiv.style.display = 'block';
        audio.play();
        audioOffButton.style.display = 'inline'; 
        audioOnButton.style.display = 'none';
        controlAudio.style.display = 'block';
    });

    continuarBtn.addEventListener('click', () => {
        let nombreInput = document.getElementById('nombre').value.trim(); 
        if (nombreInput === '') {
            mensajeError.textContent = 'Por favor, introduce tu nombre.'; 
            return; 
        }
        nombreJugador = nombreInput.charAt(0).toUpperCase() + nombreInput.slice(1).toLowerCase();
        form.style.display = 'none';
        pantallaInicial.style.display = 'none';
        escenaDialogo.style.display = 'flex';

        let fadeOutInterval = setInterval(() => {
            audio.volume -= 0.1;
            if (audio.volume < 0) {
                audio.volume = 0;
            }
            if (audio.volume === 0 || audio.volume < 0.1) { 
                audio.volume = 0; 
                audio.pause();
                clearInterval(fadeOutInterval);
            }
        }, 100);

        fetch('assets/data/data.json')
            .then(response => response.json())
            .then(data => {
                jsonData = data; 
                jsonData.forEach(node => {
                    if (node.Lila.includes('(nombreJugador)')) {
                        node.Lila = node.Lila.replace('(nombreJugador)', nombreJugador);
                    }
                    if (node.opcionA.includes('(nombreJugador)')) {
                        node.opcionA = node.opcionA.replace('(nombreJugador)', nombreJugador);
                    }
                    if (node.Lila.includes('(textoFrancés)')) {
                        node.Lila = node.Lila.replace('(textoFrancés)', '<span id="translatedText"></span>');
                    }
                    if (node.opcionA && node.opcionA.includes('(textoEspañol)')) {
                        let indexA = node.opcionA.indexOf('(textoEspañol)');
                        let beforeA = node.opcionA.substring(0, indexA);
                        let afterA = node.opcionA.substring(indexA + '(textoEspañol)'.length);
                        node.opcionA = beforeA + '<span id="spanishTextContainer"><input id="spanishText" onclick="event.stopPropagation()" autocomplete="off"></input><span id="translateButton" class="option" onclick="sendText(event)"></span></span>' + afterA;
                    }

                });
                showFirstTextNodeWithTranslation();
            })
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
            });
    });

    document.getElementById('nombre').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            let nombreInput = this.value.trim();
            if (nombreInput === '') {
                mensajeError.textContent = 'Por favor, introduce tu nombre.'; 
                return; 
            }
            continuarBtn.click(); 
        }
    });

    function translateText(text) {
        return fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|fr`)
            .then(response => response.json())
            .then(data => {
                if (data && data.responseData && data.responseData.translatedText) {
                    return data.responseData.translatedText;
                } 
            })
            .catch(error => {
                throw new Error('Error al traducir el texto:', error);
            });
    }

    function handleTranslation(text) {
        return new Promise((resolve, reject) => {
            translateText(text)
                .then(translation => {
                    if (translation === undefined) {
                        reject('La traducción devolvió undefined.');
                        return;
                    }

                    resolve(translation);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }


    function iniciarAnimacionMaquinaEscribir(texto, elemento, callback) {
        let index = 0;
        const speed = 35; 
        function escribir() {
            if (index < texto.length) {
                let char = texto.charAt(index);
                if (char === '<') {
                    let endIndex = texto.indexOf('>', index);
                    if (endIndex !== -1) {
                        let htmlChunk = texto.substring(index, endIndex + 1);
                        elemento.innerHTML += htmlChunk;
                        index = endIndex + 1;
                    }
                } else {
                    elemento.innerHTML += char;
                    index++;
                }
                setTimeout(escribir, speed);
            } else {
                if (callback && typeof callback === 'function') {
                    callback(); 
                }
                sonidoEscribir.pause();
            }
        }

        sonidoEscribir.currentTime = 0.2;
        sonidoEscribir.volume = 0.1; 
        sonidoEscribir.loop = true; 
        sonidoEscribir.play();

        if (elemento) {
            elemento.innerHTML = '';
            if (elemento.tagName.toLowerCase() === 'input') {
                elemento.value = texto;
                if (callback && typeof callback === 'function') {
                    callback(); 
                }
                return;
            }
        } else {
            return;
        }
        escribir();
    }


    function showTextNodeWithTranslation(textNode, translatedText) {
    
        if (textNode.id === 'FINAL1' || textNode.id === 'FINAL2' || textNode.id === 'FINAL3') {
            showFinalText(textNode.id);
            return;
        }
    
        textElement.innerHTML = ''; 
        iniciarAnimacionMaquinaEscribir(textNode.Lila, textElement, () => {   
            setTimeout(() => {
                let translatedTextElement = document.getElementById('translatedText');
    
                if (translatedTextElement) {
                    translatedTextElement.innerHTML = `<strong>${translatedText}</strong>`;
                } else {
                } 
                optionButtonsElement.innerHTML = '';     
                if (textNode.opcionA) {
                    let spanA = document.createElement('span');
                    spanA.textContent = textNode.opcionA; 
                    spanA.classList.add('btn');
                    spanA.classList.add('with-arrow');
    
                    spanA.addEventListener('click', () => {
                        if (textNode.id === 8 || textNode.id === 11) {
                            sendText();
                            document.querySelectorAll('.btn').forEach(btn => {
                                if (textNode.id === 8 || textNode.id === 11) {
                                    btn.style.opacity = '0';
                                }
                            });
                        } else {
                            let nextNodeId = getNextNodeId(textNode, 'opcionA');
                            if (nextNodeId === 'FINAL1' || nextNodeId === 'FINAL2' || nextNodeId === 'FINAL3') {
                                showFinalText(nextNodeId);
                            } else {
                                let nextTextNode = jsonData.find(node => node.id === nextNodeId);
                                showTextNodeWithTranslation(nextTextNode, translatedText);
                            }
                            optionButtonsElement.innerHTML = '';
                        }
                    });
    
                    optionButtonsElement.appendChild(spanA);
                    iniciarAnimacionMaquinaEscribir(textNode.opcionA, spanA);
    
                    if (textNode.id === 8 || textNode.id === 11) {
                        setTimeout(() => {
                            if (textNode.opcionB) {
                                let spanB = document.createElement('span');
                                spanB.innerHTML = `> ${textNode.opcionB}`; 
                                spanB.classList.add('btn');
                                spanB.classList.add('with-arrow'); 
    
                                spanB.addEventListener('click', () => {
                                    let nextNodeId = getNextNodeId(textNode, 'opcionB');
                                    if (nextNodeId === 'FINAL1' || nextNodeId === 'FINAL2' || nextNodeId === 'FINAL3') {
                                        showFinalText(nextNodeId);
                                    } else {
                                        let nextTextNode = jsonData.find(node => node.id === nextNodeId);
                                        showTextNodeWithTranslation(nextTextNode, translatedText);
                                    }
                                    optionButtonsElement.innerHTML = '';
                                });
    
                                optionButtonsElement.appendChild(spanB);
                                iniciarAnimacionMaquinaEscribir(textNode.opcionB, spanB);
                            }
                        }, 2000); 
                    } else {
                        setTimeout(() => {
                            if (textNode.opcionB) {
                                let spanB = document.createElement('span');
                                spanB.innerHTML = `> ${textNode.opcionB}`; 
                                spanB.classList.add('btn');
                                spanB.classList.add('with-arrow'); 
    
                                spanB.addEventListener('click', () => {
                                    let nextNodeId = getNextNodeId(textNode, 'opcionB');
                                    if (nextNodeId === 'FINAL1' || nextNodeId === 'FINAL2' || nextNodeId === 'FINAL3') {
                                        showFinalText(nextNodeId);
                                    } else {
                                        let nextTextNode = jsonData.find(node => node.id === nextNodeId);
                                        showTextNodeWithTranslation(nextTextNode, translatedText);
                                    }
                                    optionButtonsElement.innerHTML = '';
                                });
    
                                optionButtonsElement.appendChild(spanB);
                                iniciarAnimacionMaquinaEscribir(textNode.opcionB, spanB);
                            }
                        }, textNode.opcionA.length * 45); 
                    }
                } else {
                    if (textNode.opcionB) {
                        let spanB = document.createElement('span');
                        spanB.innerHTML = `> ${textNode.opcionB}`; 
                        spanB.classList.add('btn');
                        spanB.classList.add('with-arrow'); 
    
                        spanB.addEventListener('click', () => {
                            let nextNodeId = getNextNodeId(textNode, 'opcionB');
                            if (nextNodeId === 'FINAL1' || nextNodeId === 'FINAL2' || nextNodeId === 'FINAL3') {
                                showFinalText(nextNodeId);
                            } else {
                                let nextTextNode = jsonData.find(node => node.id === nextNodeId);
                                showTextNodeWithTranslation(nextTextNode, translatedText);
                            }
                            optionButtonsElement.innerHTML = '';
                        });
    
                        optionButtonsElement.appendChild(spanB);
                        iniciarAnimacionMaquinaEscribir(textNode.opcionB, spanB);
                    }
                }
            }); 
        });
    }



    function showFirstTextNodeWithTranslation() {
        let textNode = jsonData.find(node => node.id === 1);
        showTextNodeWithTranslation(textNode, null); 
    }

    function sendText(event) {
        let textToTranslate = document.getElementById('spanishText').value.trim();

        if (!textToTranslate) {
            console.error('Por favor, introduce un texto válido para traducir.');
            event.stopPropagation();
            return;
        }

        handleTranslation(textToTranslate)
            .then(translatedText => {
                let nextNodeId = 9; 
                let nextTextNode = jsonData.find(node => node.id === nextNodeId);

                if (nextTextNode) {
                    showTextNodeWithTranslation(nextTextNode, translatedText);
                } else {
                    console.error('No se encontró el nodo con ID:', nextNodeId);
                }
            })
            .catch(error => {
                console.error('Error al traducir el texto:', error);
                let nextNodeId = 9; 
                let nextTextNode = jsonData.find(node => node.id === nextNodeId);

                if (nextTextNode) {
                    showTextNodeWithTranslation(nextTextNode);
                } else {
                    console.error('No se encontró el nodo con ID:', nextNodeId);
                }
            });
    }

    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && document.getElementById('spanishText') === document.activeElement) {
            e.preventDefault(); 
            sendText(e); 
        }
    });

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
        return nextNodeId;
    }

    function showFinalText(finalId) {
        if (finalId === 'FINAL1') {
            escenaDialogo.style.display = 'none';
            document.querySelector('.escenaLLaves').style.display = 'flex';
            finalScreen.style.display = 'none'; 
            return;
        }

        let finalText;
        if (finalId === 'FINAL2') {
            finalText = "Al siguiente día, te das cuenta de que Lila ya no está en la garita. Necesitaba a alguien con quien hablar. Ha dejado su trabajo de conserje."; // Texto del final 2
        } else if (finalId === 'FINAL3') {
            finalText = "Han despedido a Lila, ya que encontrar las llaves era una tarea muy importante. Tenía dos avisos anteriormente y ha llegado al tercero. Se dieron cuenta de que estaba teniendo problemas con la memoria."; // Texto del final 3
        } else {
            console.error('ID de final no válido:', finalId);
            return;
        }

        escenaDialogo.style.display = 'none';
        finalScreen.style.display = 'grid'; 

        let finalTextNode = document.getElementById('finalText');
        finalTextNode.innerHTML = '';
        iniciarAnimacionMaquinaEscribir(finalText, finalTextNode, () => {
            let reiniciarBtn = document.getElementById('reiniciarBtn');
            reiniciarBtn.addEventListener('click', () => {
                let clickSound = document.getElementById('clickSound');
                clickSound.play(); 
                reiniciarJuego();
            });
            setTimeout(() => {
                reiniciarBtn.style.display = 'block';
            }, 500);
        });
    }

    function reiniciarJuego() {
        location.reload();
    }

    var movedCount = {
        'lampara': 0,
        'agenda': 0,
        'cafe': 0,
        'reloj': 0,
        'planta': 0
    };

    let textoEscena = document.getElementById('mensajeLlaves');
    let llaveMovida = false; 

    function checkAllMovedOnce() {
    for (var key in movedCount) {
        if (movedCount[key] === 0) {
            return false;
        }
    }
    
    textoEscena.innerHTML = '<p class="textoVuelta">Ay espera un momento, que creo que me las dejé en esa estantería...</p>';
    textoEscena.style.display = 'block';

    let nuevoElemento = document.querySelector('.textoVuelta');

    iniciarAnimacionMaquinaEscribir(nuevoElemento.innerHTML, nuevoElemento);

    return true;
    }

    function changeCharacterImage() {
        let personaje = document.querySelector('.personaje-llaves img');
        let lilaPerfil = document.querySelector('.lilaPerfil');
        let llaves = document.querySelector('.llaves');

        if (personaje && lilaPerfil) {
            personaje.style.display = 'none';
            lilaPerfil.style.display = 'block';
            llaves.style.display = 'block';

            interact('.drag-drop-area')
                .draggable({
                    inertia: true,
                    modifiers: [
                        interact.modifiers.restrictRect({
                            restriction: 'parent',
                            endOnly: true
                        })
                    ],
                    autoScroll: true,
                    onmove: dragMoveListener
                });
        }
    }

    function setupDraggableWithLimit(selector, direction, limit, resetX, resetY, objectId) {
        interact(selector).draggable({
            restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            inertia: true,
            autoScroll: true,
            onstart: function (event) {
                var objects = document.querySelectorAll('.objetos-llaves > div');
                for (var i = 0; i < objects.length; i++) {
                    objects[i].removeAttribute('data-moved');
                }
            },
            onmove: function (event) {
                var target = event.target;
                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                if (
                    (direction === 'horizontal' && event.dx <= limit && event.dx >= 0) ||
                    (direction === 'vertical' && event.dy <= limit && event.dy >= 0)
                ) {
                    target.setAttribute('data-moved', 'true');
                    llaveMovida = target.classList.contains('llaves'); 

                    let sonidoArrastrar = document.getElementById('sonidoArrastrar');
                    sonidoArrastrar.volume = 0.1; 
                    sonidoArrastrar.play();
                    sonidoArrastrar.currentTime = 0.3;
                }

                target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
            onend: function (event) {
                var target = event.target;
                var objectId = target.getAttribute('data-id');

                if (!movedCount.hasOwnProperty(objectId)) {
                    return;
                }

                movedCount[objectId]++;

                if (checkAllMovedOnce()) {
                    setTimeout(changeCharacterImage, 2000);
                }

                setTimeout(function () {
                    target.style.transition = 'transform 0.5s';
                    target.style.transform = 'translate(' + resetX + 'px, ' + resetY + 'px)';
                    target.setAttribute('data-x', resetX);
                    target.setAttribute('data-y', resetY);
                }, 500);
            }
        });
    }

    setupDraggableWithLimit('.lampara-llaves', 'horizontal', -100, 0, 0, 'lampara');
    var lamparaAudio = document.getElementById('sonidoArrastrar');
    document.querySelector('.lampara-llaves').addEventListener('mousedown', function () {
        lamparaAudio.currentTime = 0.3;
        lamparaAudio.volume = 0.1;
        lamparaAudio.play();
    });
    setupDraggableWithLimit('.agenda-llaves', 'vertical', 100, 0, 0, 'agenda');
    setupDraggableWithLimit('.cafe-llaves', 'vertical', -100, 0, 0, 'cafe');
    var cafeAudio = document.getElementById('sonidoArrastrar');
    document.querySelector('.cafe-llaves').addEventListener('mousedown', function () {
        cafeAudio.currentTime = 0.3;
        cafeAudio.volume = 0.1;
        cafeAudio.play();
    });
    setupDraggableWithLimit('.reloj-llaves', 'vertical', 100, 0, 0, 'reloj');
    setupDraggableWithLimit('.planta-llaves', 'horizontal', -100, 0, 0, 'planta');
    var plantaAudio = document.getElementById('sonidoArrastrar');
    document.querySelector('.planta-llaves').addEventListener('mousedown', function () {
        plantaAudio.currentTime = 0.3;
        plantaAudio.volume = 0.1;
        plantaAudio.play();
    });

    function dragMoveListener(event) {
        var target = event.target;
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

        if (target.classList.contains('llaves')) {
            llaveMovida = true;

            setTimeout(mostrarNuevaEscena, 2000);
        } 
    }

    let nuevaEscenaMostrada = false; 
    function mostrarNuevaEscena() {
        if (!nuevaEscenaMostrada) {
            let escenaLlaves = document.querySelector('.escenaLLaves');
            if (escenaLlaves) {
                escenaLlaves.style.display = 'none';
            }

            let nuevaEscena = document.getElementById('escenaFinal1');
            if (nuevaEscena) {
                nuevaEscena.style.display = 'flex';

                let textoFinal1 = document.querySelector('.textoFinal1');
                let siguienteBtn = document.getElementById('siguienteBtn');
                let siguienteBtn2 = document.getElementById('siguienteBtn2');
                let textoOculto1 = document.getElementById('textoOculto1');
                let textoOculto2 = document.getElementById('textoOculto2');
                let reiniciarJuegoBtn = document.getElementById('reiniciarJuego');

                siguienteBtn.style.display = 'none';
                siguienteBtn2.style.display = 'none';
                textoOculto1.style.display = 'none';
                textoOculto2.style.display = 'none';
                reiniciarJuegoBtn.style.display = 'none';

                iniciarAnimacionMaquinaEscribir(textoFinal1.textContent, textoFinal1, function () {
                    setTimeout(() => {
                        siguienteBtn.style.display = 'inline';
                    }, 500); 
                });

                siguienteBtn.addEventListener('click', function mostrarSiguienteTexto1() {
                    textoFinal1.style.display = 'none';
                    textoOculto1.style.display = 'block';
                    siguienteBtn.style.display = 'none';

                    iniciarAnimacionMaquinaEscribir(textoOculto1.textContent, textoOculto1, function () {
                        setTimeout(() => {
                            siguienteBtn2.style.display = 'inline';
                        }, 500); 
                    });
                });

                siguienteBtn2.addEventListener('click', function mostrarSiguienteTexto2() {
                    textoOculto1.style.display = 'none';
                    textoOculto2.style.display = 'block';
                    siguienteBtn2.style.display = 'none';

                    iniciarAnimacionMaquinaEscribir(textoOculto2.textContent, textoOculto2, function () {
                        setTimeout(() => {
                            reiniciarJuegoBtn.style.display = 'inline';
                        }, 500); 
                    });
                });

                reiniciarJuegoBtn.addEventListener('click', () => {
                    reiniciarJuego();
                });
            }

            nuevaEscenaMostrada = true; 
        }
    }
};

