// Paweł Piłat, Norbert Janas, Paweł Janusz

var canvas = document.getElementById("main_canvas");
var context = canvas.getContext("2d");
// context.rotate(40 * Math.PI / 180);
var ballRadius = 10;
var ballXPosition = canvas.width/2;
var ballYPosition = canvas.height-30;//co to jest
// Move speed of Ball
var ballSpeedX = 5;
var ballSpeedY = -7;  // Negative
var paddleHeight = 10;
var paddleWidth = 75;
var paddleSpeedX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

var bricks = [];
for(var column=0; column<brickColumnCount; column++) {
  bricks[column] = [];
  for(var row=0; row<brickRowCount; row++) {
    bricks[column][row] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleSpeedX = relativeX - paddleWidth/2;
  }
}
function collisionDetection() {
  for(var column=0; column<brickColumnCount; column++) {
    for(var row=0; row<brickRowCount; row++) {
      var currentBrick = bricks[column][row];
      if(currentBrick.status == 1) {
        if(
            ballXPosition > currentBrick.x &&
            ballXPosition < currentBrick.x+brickWidth &&
            ballYPosition > currentBrick.y &&
            ballYPosition < currentBrick.y+brickHeight
        ) {
          ballSpeedY = -ballSpeedY;
          currentBrick.status = 0;
          score++;
          if(score == brickRowCount*brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {
  context.beginPath();
  context.arc(ballXPosition, ballYPosition, ballRadius, 0, Math.PI*2);
  context.fillStyle = "#0095DD";
  context.fill();
  context.closePath();
}
function drawPaddle() {
  context.beginPath();
  context.rect(paddleSpeedX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  context.fillStyle = "#0095DD";
  context.fill();
  context.closePath();
}
function drawBricks() {
  for(var column=0; column<brickColumnCount; column++) {
    for(var row=0; row<brickRowCount; row++) {
      if(bricks[column][row].status == 1) {
        var brickX = (row*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (column*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[column][row].x = brickX;
        bricks[column][row].y = brickY;
        context.beginPath();
        context.rect(brickX, brickY, brickWidth, brickHeight);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
      }
    }
  }
}
function drawScore() {
  context.font = "16px Arial";
  context.fillStyle = "#0095DD";
  context.fillText("Score: "+score, 8, 20);
}
function drawLives() {
  context.font = "16px Arial";
  context.fillStyle = "#0095DD";
  context.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if(ballXPosition + ballSpeedX > canvas.width-ballRadius || ballXPosition + ballSpeedX < ballRadius) {
    ballSpeedX = -ballSpeedX;
  }
  if(ballYPosition + ballSpeedY < ballRadius) {
    ballSpeedY = -ballSpeedY;
  }
  else if(ballYPosition + ballSpeedY > canvas.height-ballRadius) {
    if(ballXPosition > paddleSpeedX && ballXPosition < paddleSpeedX + paddleWidth) {
      ballSpeedY = -ballSpeedY;
    }
    else {
      lives--;
      if(!lives) {
        alert("GAME OVER");
        document.location.reload();
      }
      else {
        ballXPosition = canvas.width/2;
        ballYPosition = canvas.height-30;
        ballSpeedX = 3;
        ballSpeedY = -3;
        paddleSpeedX = (canvas.width-paddleWidth)/2;
      }
    }
  }

  if(rightPressed && paddleSpeedX < canvas.width-paddleWidth) {
    paddleSpeedX += 7;
  }
  else if(leftPressed && paddleSpeedX > 0) {
    paddleSpeedX -= 7;
  }

  ballXPosition += ballSpeedX;
  ballYPosition += ballSpeedY;
  requestAnimationFrame(draw);
}

draw();