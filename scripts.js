// Paweł Piłat, Norbert Janas, Paweł Janusz

// ----------------------------- PARAMETERS -----------------------------
var canvas = document.getElementById("main_canvas");
var context = canvas.getContext("2d");
// context.rotate(90 * Math.PI/180);
// context.translate(0,-canvas.height)

//ustawianie wielkości takiej jak okno
canvas.width = innerWidth;
canvas.height = innerHeight;

var canvasWidth = canvas.width;
var canvasHeigth = canvas.height;
// Piłka, jej rozmiar i pozycja startowa (nie po utraceniu życia)
var offset = 0;
var unit = 0;

if(canvasHeigth >= canvasWidth){
	unit = canvasWidth / 10;
	offset = unit
	unit = (canvasWidth - 2 * offset) / 10;
	offset = (canvasWidth - (10 * unit))/2

}
else if(canvasWidth >= canvasHeigth ){
	unit = canvasHeigth / 10;
	offset = unit
	unit = (canvasHeigth - 2 * offset) / 10;
	offset = (canvasWidth - (10 * unit))/2
}

var ballRadius = unit/5;//10
var ballXStartingPosition = canvasWidth/2;
var ballYStartingPosition = canvasHeigth-25;
var ballXPosition = ballXStartingPosition;
var ballYPosition = ballYStartingPosition;

// Predkosc piłki
var ballSpeedX = 3;
var ballSpeedY = -3;  // Negative

// Gracz rozmiar
var playerHeight = unit/2;//10
var playerWidth = 2 * unit//80;

// Sterowanie za pomocą klawiatury (strzałki)
var playerPosition = (canvasWidth-playerWidth)/2;
var rightPressed = false;
var leftPressed = false;
var speed = 7;

// Parametry planszy
var brickAmountRow = 5;
var brickAmountColumn = 3;
var brickWidth = 2 * unit;//75
var brickHeight =  unit;//20

var brickPadding = unit/10;//20
// Odstępy
// od góry planszy
var brickOffsetTop = offset;//35
// od lewej
var brickOffsetLeft = offset;//30

//info takie tam o grze i wgl
var score = 0;
var lives = 3;
var level = 1;

// Kolory
var brickColors = ["#EA3812", "#44EA12", "#12BEEA", "#C012EA", "#EA9E12","#1242C5", "#CBE032", "#E11A8F", "13F1B0"]
var playerColor = "#140507"
var ballColor = "#140507"
var scoreAndLivesColor = "#000"

// ----------------------------------------------------------------------

var bricks = Array();

function setupBricks(){
  for(column = 0; column < brickAmountColumn; column++) {
  	bricks[column] = Array();
  	rowRandomColor = brickColors[Math.floor(Math.random() * brickColors.length)];
  	for(row = 0; row < brickAmountRow; row++) {
  		bricks[column][row] = {
  			x: 0,
  			y: 0,
  			color: rowRandomColor,
  			notDestroyed: 1
  		};
  	}
  }
}

// Sterowanie
// document.addEventListener("mousemove", mouseMove, false);
document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);

// function mouseMove(e) {
// 	var relativeX = e.clientX - canvas.offsetLeft;
// 	if(relativeX > 0 && relativeX < canvasWidth) {
// 		playerPosition = relativeX - playerWidth/2;
// 	}
// }

function keyDown(e) {
    console.log(e.key);
    if(e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
        leftPressed = true;
    }
    else if(e.key == " ") {
        alert("PAUZA");
        if(rightPressed)
        {
          rightPressed = false;
          playerPosition -= speed;
        }
        else if(leftPressed)
        {
          leftPressed = false;
          playerPosition += speed;
        }
    }
}

function keyUp(e) {
    if(e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
        leftPressed = false;
    }
}


function collisionDetection() {
	// Iterujemy po blokach
	for(var column = 0; column < brickAmountColumn; column++) {
		for(var row = 0; row < brickAmountRow; row++) {
			var currentBrick = bricks[column][row];
			if(currentBrick.notDestroyed == 1) {
		        if(
					// Jeśli znajduje się na szerokość bloku
		            ballXPosition > currentBrick.x &&
					ballXPosition < currentBrick.x+brickWidth &&
					// Jeśli znajduje się na wysokośc bloku
		            ballYPosition > currentBrick.y &&
		            ballYPosition < currentBrick.y+brickHeight
		        ) {
					// Trafienie
					currentBrick.notDestroyed = 0;
					// Odwracamy prędkość (odbicie)
         			ballSpeedY = -ballSpeedY;
					score++;
					// Jeśli score = ilości bloków to wygraliśmy
        			if(score == brickAmountRow * brickAmountColumn * level) {
                loadNewLevel()
        				//alert("YOU WIN, CONGRATS!");
						    //document.location.reload();
					}
        		}
      		}
    	}
  	}
}

function drawBricks() {
	for(column = 0; column < brickAmountColumn; column++) {
		for(row = 0; row < brickAmountRow; row++) {
			if(bricks[column][row].notDestroyed == 1) {
        		var brickX = (row*(brickWidth+brickPadding))+brickOffsetLeft;
        		var brickY = (column*(brickHeight+brickPadding))+brickOffsetTop;
        		bricks[column][row].x = brickX;
        		bricks[column][row].y = brickY;
        		context.beginPath();
        		context.rect(brickX, brickY, brickWidth, brickHeight);
        		context.fillStyle = bricks[column][row].color;
        		context.fill();
        		context.closePath();
      		}
   		}
  	}
}

function drawBall() {
	context.beginPath();
	context.arc(ballXPosition, ballYPosition, ballRadius, 0, Math.PI*2);
	context.fillStyle = ballColor;
	context.fill();
	context.closePath();
}

function drawPlayer() {
	context.beginPath();
	context.rect(playerPosition, canvasHeigth-playerHeight, playerWidth, playerHeight);
	context.fillStyle = playerColor;
	context.fill();
	context.closePath();
}


function drawScore() {
	context.font = "17px Times New Roman";
	context.fillStyle = scoreAndLivesColor;
	context.fillText("Punkty: "+score, 8, 20);
}

function drawLives() {
	context.font = "17px Times New Roman";
	context.fillStyle = scoreAndLivesColor;
	context.fillText("Życia: "+lives, canvasWidth-65, 20);
}

function drawGame() {
	context.clearRect(0, 0, canvasWidth, canvasHeigth);
	drawBricks();
	drawBall();
	drawPlayer();
	drawScore();
	drawLives();
	collisionDetection();

	if(ballXPosition + ballSpeedX > canvasWidth-ballRadius || ballXPosition + ballSpeedX < ballRadius) {
		ballSpeedX = -ballSpeedX;
	}
	if(ballYPosition + ballSpeedY < ballRadius) {
		ballSpeedY = -ballSpeedY;
	}
	else if(ballYPosition + ballSpeedY > canvasHeigth-ballRadius) {
		if(ballXPosition > playerPosition && ballXPosition < playerPosition + playerWidth) {
			ballSpeedY = -ballSpeedY;
    	}
		else {
			lives--;
			if(!lives) {
        context.clearRect(0, 0, canvasWidth, canvasHeigth);
      	drawBricks();
      	drawBall();
      	drawPlayer();
      	drawScore();
      	drawLives();
        collisionDetection();
				alert("FUCKING LOOSER");
				document.location.reload();
			}
			else {
        		ballXPosition = ballXStartingPosition;
        		ballYPosition = ballYStartingPosition;
        		ballSpeedX = 3;
        		ballSpeedY = -3;
        		playerPosition = (canvasWidth-playerWidth)/2;
			}
		}
	}

	if(rightPressed && playerPosition < canvasWidth-playerWidth) {
		playerPosition += speed;
	}
	else if(leftPressed && playerPosition > 0) {
		playerPosition -= speed;
	}

	ballXPosition += ballSpeedX;
	ballYPosition += ballSpeedY;
	requestAnimationFrame(drawGame);
}

function loadNewLevel() {
  level++;
  ballXPosition = ballXStartingPosition;
  ballYPosition = ballYStartingPosition;
  ballSpeedX = 3;
  ballSpeedY = -3;
  playerPosition = (canvasWidth-playerWidth)/2;
  setupBricks();
  context.clearRect(0, 0, canvasWidth, canvasHeigth);
	drawBricks();
	drawBall();
	drawPlayer();
	drawScore();
	drawLives();
	collisionDetection();
}

setupBricks();
drawGame();


$('#view').on('touchstart', function(e) {
	var clickX = e.touches[0];
	console.log(e.touches);
	var viewWidth = $("#view").width();	
	if (clickX.clientX > viewWidth/2) {
		rightPressed = true;
	} else {
		leftPressed = true;
	}
}).on('touchend', function(e) {
	if (e.touches.length > 0){
		var viewWidth = $("#view").width();	
		var latestTouch = e.touches[0];
		rightPressed = false;
		leftPressed = false;
		if (latestTouch.clientX > viewWidth/2) {
			rightPressed = true;
		} else {
			leftPressed = true;
		}
	} else{
		rightPressed = false;
		leftPressed = false;
	}

});
