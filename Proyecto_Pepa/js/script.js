// Cargar la imagen de la tuerca
var tuercaImage = new Image();
tuercaImage.src = './images/TUERCA.png';  // Asegúrate de que la ruta sea correcta
tuercaImage.onload = function() {
    makeMaze(); // Llamar a makeMaze aquí si es necesario
};

// Cargar la imagen del robot
var sprite = new Image();
sprite.src = './images/ROBOT.png';  // Asegúrate de que la ruta sea correcta
sprite.onload = function() {
    sprite = changeBrightness(1.2, sprite);
};

// Cargar la imagen del portal
var finishSprite = new Image();
finishSprite.src = './images/PORTAL.png';  // Asegúrate de que la ruta sea correcta
finishSprite.onload = function() {
    finishSprite = changeBrightness(1.1, finishSprite);
};

// Función para dibujar las tuercas
function drawRedPoints(ctx, points, cellSize) {
    points.forEach(point => {
        ctx.drawImage(
            tuercaImage,
            (point.x + 1) * cellSize - cellSize / 2 - (cellSize / 4),
            (point.y + 1) * cellSize - cellSize / 2 - (cellSize / 4),
            cellSize / 1.50,  // Ancho de la imagen ajustado al tamaño de la celda
            cellSize / 1.50   // Altura de la imagen ajustada al tamaño de la celda
        );
    });
}

// Generar puntos aleatorios para las tuercas en el laberinto y asignar preguntas
function generateRandomRedPointsAndQuestions(numPoints, mazeWidth, mazeHeight) {
    let points = [];
    while (points.length < numPoints) {
        let point = {
            x: rand(mazeWidth),
            y: rand(mazeHeight),
            questionIndex: points.length  // Asignar un índice de pregunta a cada punto
        };
        // Verificar que el punto generado no esté en el mismo lugar que otro punto ya generado
        if (!points.some(p => p.x === point.x && p.y === point.y)) {
            points.push(point);
        }
    }
    return points;
}

// Resetear el juego
function resetGame() {
    answeredQuestions = []; // Reiniciar preguntas contestadas
    redPoints = generateRandomRedPointsAndQuestions(questions.length, maze.map().length, maze.map()[0].length); // Generar nuevos puntos aleatorios para las tuercas
    makeMaze(); // Reiniciar el laberinto
}

// Modificar displayVictoryMess para mostrar el mensaje y desactivar los controles
function displayVictoryMess(moves) {
    document.getElementById("moves").innerHTML = "Te moviste " + moves + " pasos.";
    toggleVisablity("Message-Container");
    player.unbindKeyDown(); // Desactivar los controles del robot
}

// Función para reactivar los controles del robot después de hacer clic en "¡Genial!"
function enableControlsAfterVictory() {
    toggleVisablity("Message-Container"); // Ocultar el mensaje de victoria
    player.bindKeyDown(); // Volver a habilitar los controles del robot
}

// Función para generar un número aleatorio
function rand(max) {
    return Math.floor(Math.random() * max);
}

// Función para mezclar un arreglo
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Función para cambiar el brillo de una imagen
function changeBrightness(factor, sprite) {
    var virtCanvas = document.createElement("canvas");
    virtCanvas.width = 500;
    virtCanvas.height = 500;
    var context = virtCanvas.getContext("2d");
    context.drawImage(sprite, 0, 0, 500, 500);

    var imgData = context.getImageData(0, 0, 500, 500);

    for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = imgData.data[i] * factor;
        imgData.data[i + 1] = imgData.data[i + 1] * factor;
        imgData.data[i + 2] = imgData.data[i + 2] * factor;
    }
    context.putImageData(imgData, 0, 0);

    var spriteOutput = new Image();
    spriteOutput.src = virtCanvas.toDataURL();
    virtCanvas.remove();
    return spriteOutput;
}

// Función para mostrar u ocultar un elemento HTML
function toggleVisablity(id) {
    if (document.getElementById(id).style.visibility == "visible") {
        document.getElementById(id).style.visibility = "hidden";
    } else {
        document.getElementById(id).style.visibility = "visible";
    }
}

// Array para llevar el registro de las preguntas contestadas
let answeredQuestions = [];

// Variable global para almacenar las preguntas seleccionadas
let selectedQuestions = [];

// Función para mostrar la pregunta
function showQuestion(questionIndex) {
    const questionObj = selectedQuestions[questionIndex];
    let questionText = questionObj.question;
    let options = questionObj.options;
    let playerAnswer = prompt(questionText + "\n" + options.join("\n"));

    if (playerAnswer === questionObj.answer) {
        alert("¡Correcto!");
        answeredQuestions.push(questionIndex);  // Marcar la pregunta como contestada
        return true; // Permite avanzar
    } else {
        alert("Respuesta incorrecta. Inténtalo de nuevo.");
        return false; // No permite avanzar hasta responder correctamente
    }
}

// Definición de la clase Maze (Laberinto)
function Maze(Width, Height) {
    var mazeMap;
    var width = Width;
    var height = Height;
    var startCoord, endCoord;
    var dirs = ["n", "s", "e", "w"];
    var modDir = {
        n: { y: -1, x: 0, o: "s" },
        s: { y: 1, x: 0, o: "n" },
        e: { y: 0, x: 1, o: "w" },
        w: { y: 0, x: -1, o: "e" }
    };

    this.map = function () { return mazeMap; };
    this.startCoord = function () { return startCoord; };
    this.endCoord = function () { return endCoord; };

    function genMap() {
        mazeMap = new Array(height);
        for (y = 0; y < height; y++) {
            mazeMap[y] = new Array(width);
            for (x = 0; x < width; ++x) {
                mazeMap[y][x] = {
                    n: false,
                    s: false,
                    e: false,
                    w: false,
                    visited: false,
                    priorPos: null
                };
            }
        }
    }

    function defineMaze() {
        var isComp = false;
        var move = false;
        var cellsVisited = 1;
        var numLoops = 0;
        var maxLoops = 0;
        var pos = { x: 0, y: 0 };
        var numCells = width * height;
        while (!isComp) {
            move = false;
            mazeMap[pos.x][pos.y].visited = true;

            if (numLoops >= maxLoops) {
                shuffle(dirs);
                maxLoops = Math.round(rand(height / 8));
                numLoops = 0;
            }
            numLoops++;
            for (index = 0; index < dirs.length; index++) {
                var direction = dirs[index];
                var nx = pos.x + modDir[direction].x;
                var ny = pos.y + modDir[direction].y;

                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    if (!mazeMap[nx][ny].visited) {
                        mazeMap[pos.x][pos.y][direction] = true;
                        mazeMap[nx][ny][modDir[direction].o] = true;

                        mazeMap[nx][ny].priorPos = pos;
                        pos = { x: nx, y: ny };
                        cellsVisited++;
                        move = true;
                        break;
                    }
                }
            }

            if (!move) {
                pos = mazeMap[pos.x][pos.y].priorPos;
            }
            if (numCells == cellsVisited) {
                isComp = true;
            }
        }
    }

    function defineStartEnd() {
        switch (rand(4)) {
            case 0:
                startCoord = { x: 0, y: 0 };
                endCoord = { x: height - 1, y: width - 1 };
                break;
            case 1:
                startCoord = { x: 0, y: width - 1 };
                endCoord = { x: height - 1, y: 0 };
                break;
            case 2:
                startCoord = { x: height - 1, y: 0 };
                endCoord = { x: 0, y: width - 1 };
                break;
            case 3:
                startCoord = { x: height - 1, y: width - 1 };
                endCoord = { x: 0, y: 0 };
                break;
        }
    }

    genMap();
    defineStartEnd();
    defineMaze();
}

// Función para dibujar el laberinto
function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
    var map = Maze.map();
    var cellSize = cellsize;
    var drawEndMethod;
    ctx.lineWidth = cellSize / 40;

    this.redrawMaze = function (size) {
        cellSize = size;
        ctx.lineWidth = cellSize / 50;
        drawMap();
        drawRedPoints(ctx, redPoints, cellSize); // Dibujar puntos rojos
        drawEndMethod();
    };

    function drawCell(xCord, yCord, cell) {
        var x = xCord * cellSize;
        var y = yCord * cellSize;

        if (cell.n == false) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cellSize, y);
            ctx.stroke();
        }
        if (cell.s === false) {
            ctx.beginPath();
            ctx.moveTo(x, y + cellSize);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (cell.e === false) {
            ctx.beginPath();
            ctx.moveTo(x + cellSize, y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (cell.w === false) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + cellSize);
            ctx.stroke();
        }
    }

    function drawMap() {
        for (x = 0; x < map.length; x++) {
            for (y = 0; y < map[x].length; y++) {
                drawCell(x, y, map[x][y]);
            }
        }
    }

    function drawEndFlag() {
        var coord = Maze.endCoord();
        var gridSize = 4;
        var fraction = cellSize / gridSize - 2;
        var colorSwap = true;
        for (let y = 0; y < gridSize; y++) {
            if (gridSize % 2 == 0) {
                colorSwap = !colorSwap;
            }
            for (let x = 0; x < gridSize; x++) {
                ctx.beginPath();
                ctx.rect(
                    coord.x * cellSize + x * fraction + 4.5,
                    coord.y * cellSize + y * fraction + 4.5,
                    fraction,
                    fraction
                );
                if (colorSwap) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                } else {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                }
                ctx.fill();
                colorSwap = !colorSwap;
            }
        }
    }

    function drawEndSprite() {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        var coord = Maze.endCoord();
        ctx.drawImage(
            endSprite,
            2,
            2,
            endSprite.width,
            endSprite.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }

    function clear() {
        var canvasSize = cellSize * map.length;
        ctx.clearRect(0, 0, canvasSize, canvasSize);
    }

    if (endSprite != null) {
        drawEndMethod = drawEndSprite;
    } else {
        drawEndMethod = drawEndFlag;
    }
    clear();
    drawMap();
    drawRedPoints(ctx, redPoints, cellSize); // Dibujar puntos rojos
    drawEndMethod();
}

// Definición de la clase Player (Jugador)
function Player(maze, c, _cellsize, onComplete, sprite = null) {
    var ctx = c.getContext("2d");
    var drawSprite;
    var moves = 0;
    drawSprite = drawSpriteCircle;
    if (sprite != null) {
        drawSprite = drawSpriteImg;
    }
    var player = this;
    var map = maze.map();
    var cellCoords = {
        x: maze.startCoord().x,
        y: maze.startCoord().y
    };
    var cellSize = _cellsize;
    var halfCellSize = cellSize / 2;

    this.redrawPlayer = function (_cellsize) {
        cellSize = _cellsize;
        drawSpriteImg(cellCoords);
    };

    function drawSpriteCircle(coord) {
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.arc(
            (coord.x + 1) * cellSize - halfCellSize,
            (coord.y + 1) * cellSize - halfCellSize,
            halfCellSize - 2,
            0,
            2 * Math.PI
        );
        ctx.fill();
        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
            onComplete(moves);
            player.unbindKeyDown(); // Desactivar los controles del robot
        }
    }

    function drawSpriteImg(coord) {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        ctx.drawImage(
            sprite,
            0,
            0,
            sprite.width,
            sprite.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
            onComplete(moves);
            player.unbindKeyDown(); // Desactivar los controles del robot
        }
    }

    function removeSprite(coord) {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        ctx.clearRect(
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }

    function check(e) {
        var cell = map[cellCoords.x][cellCoords.y];
        moves++;

        // Verificar si la nueva posición es un punto rojo
        let pointIndex = redPoints.findIndex(point => point.x === cellCoords.x && point.y === cellCoords.y);

        if (pointIndex !== -1 && !answeredQuestions.includes(redPoints[pointIndex].questionIndex)) {
            if (showQuestion(redPoints[pointIndex].questionIndex)) {
                // Eliminar el punto rojo después de responder correctamente
                redPoints.splice(pointIndex, 1);
                draw.redrawMaze(cellSize); // Redibujar el laberinto sin el punto rojo
            } else {
                return; // Si la respuesta es incorrecta, no avanzar
            }
        }

        switch (e.keyCode) {
            case 65:
            case 37: // oeste
                if (cell.w == true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x - 1,
                        y: cellCoords.y
                    };
                    drawSprite(cellCoords);
                }
                break;
            case 87:
            case 38: // norte
                if (cell.n == true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x,
                        y: cellCoords.y - 1
                    };
                    drawSprite(cellCoords);
                }
                break;
            case 68:
            case 39: // este
                if (cell.e == true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x + 1,
                        y: cellCoords.y
                    };
                    drawSprite(cellCoords);
                }
                break;
            case 83:
            case 40: // sur
                if (cell.s == true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x,
                        y: cellCoords.y + 1
                    };
                    drawSprite(cellCoords);
                }
                break;
        }
    }

    this.bindKeyDown = function () {
        window.addEventListener("keydown", check, false);

        $("#view").swipe({
            swipe: function (
                event,
                direction,
                distance,
                duration,
                fingerCount,
                fingerData
            ) {
                console.log(direction);
                switch (direction) {
                    case "up":
                        check({ keyCode: 38 });
                        break;
                    case "down":
                        check({ keyCode: 40 });
                        break;
                    case "left":
                        check({ keyCode: 37 });
                        break;
                    case "right":
                        check({ keyCode: 39 });
                        break;
                }
            },
            threshold: 0
        });
    };

    this.unbindKeyDown = function () {
        window.removeEventListener("keydown", check, false);
        $("#view").swipe("destroy");
    };

    drawSprite(maze.startCoord());

    this.bindKeyDown();
}

// Configuración inicial para el lienzo del laberinto
var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var maze, draw, player;
var cellSize;
var difficulty;

window.onload = function() {
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
        ctx.canvas.width = viewHeight - viewHeight / 100;
        ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
        ctx.canvas.width = viewWidth - viewWidth / 100;
        ctx.canvas.height = viewWidth - viewWidth / 100;
    }

    makeMaze();
};

window.onresize = function () {
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
        ctx.canvas.width = viewHeight - viewHeight / 100;
        ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
        ctx.canvas.width = viewWidth - viewWidth / 100;
        ctx.canvas.height = viewWidth - viewWidth / 100;
    }
    cellSize = mazeCanvas.width / difficulty;
    if (player != null) {
        draw.redrawMaze(cellSize);
        player.redrawPlayer(cellSize);
    }
};

// Función para mezclar las preguntas
function shuffleQuestions(questionsArray) {
    for (let i = questionsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questionsArray[i], questionsArray[j]] = [questionsArray[j], questionsArray[i]];
    }
    return questionsArray;
}

// Crear el laberinto y configurar todo para comenzar el juego
function makeMaze() {
    if (player != undefined) {
        player.unbindKeyDown();
        player = null;
    }

    // Obtener la dificultad y el número de preguntas seleccionadas
    var e = document.getElementById("diffSelect");
    difficulty = e.options[e.selectedIndex].value;

    var q = document.getElementById("questionSelect");
    var numQuestions = parseInt(q.options[q.selectedIndex].value); // Convertir el valor a número entero

    // Mezclar las preguntas y seleccionar el número de preguntas necesario
    selectedQuestions = shuffleQuestions(questions).slice(0, numQuestions);

    cellSize = mazeCanvas.width / difficulty;
    maze = new Maze(difficulty, difficulty);

    // Reiniciar la lista de preguntas contestadas y puntos rojos
    answeredQuestions = [];  // Reiniciar las preguntas contestadas
    redPoints = generateRandomRedPointsAndQuestions(numQuestions, difficulty, difficulty); // Generar nuevos puntos con el número correcto de preguntas

    // Asignar las preguntas seleccionadas a los puntos rojos
    for (let i = 0; i < redPoints.length; i++) {
        redPoints[i].questionIndex = i; // Asignar el índice de la pregunta seleccionada
    }

    draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
    player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);

    if (document.getElementById("mazeContainer").style.opacity < "100") {
        document.getElementById("mazeContainer").style.opacity = "100";
    }
}

document.getElementById("loginButton").addEventListener("click", function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validación simple (esto es solo un ejemplo, no para uso en producción)
    if (email === "usuario@example.com" && password === "12345") {
        alert("Inicio de sesión exitoso");
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("page").style.display = "block";
    } else {
        alert("Correo o contraseña incorrectos");
    }
});

window.onload = function() {
    document.getElementById("page").style.display = "none"; // Ocultar el juego inicialmente
};
