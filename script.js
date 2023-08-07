//getting elements from html document and assigning them to const variables
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".control-buttons i");

//declaring variables
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY=5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

//getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

/* function to change food's position randomly */
function changeFoodPosition(){
    //Passing a random value between 0-30 as food position in 30x30 grid
    foodX = Math.ceil(Math.random() * 30) ;
    foodY = Math.ceil(Math.random() * 30) ;
}

/* function to change snake's direction by adjusting velocity based on key press */
function changeDirection(a){
    if(a.key === "ArrowUp" && velocityY != 1){ //rectricting snake from changing direction to the opposite side
        velocityX = 0;
        velocityY = -1;
    }
    else if(a.key === "ArrowDown"&& velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }
    else if(a.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
    else if(a.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }
    initGame();
}

//function to handle the timer and reload the screen when game is over
function handleGameOver(){
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

//calling changeDirection on each key click and passing key dataset value as an object
controls.forEach(key =>{
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
})

/* function to initialize the game */
function initGame () {
    if(gameOver){
        return handleGameOver();
    }
    let htmlMarkup = `<div class = "food" style = "grid-area: ${foodY} / ${foodX} "></div>`;
    //checking if the snake hit the food
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX,foodY]); //pushing food position to snake body array
        score++; //increase score by 1

        //set high score to score if score is greater than high score
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score",highScore);

        highScoreElement.innerText = `High Score: ${highScore}`;
        scoreElement.innerText = `Score: ${score}`;
    }

    //shifting forward the values of the elements in the snake body by one
    for(let i = snakeBody.length - 1; i > 0; i--){
        snakeBody[i] = snakeBody[i-1];
    }

    //setting the first element of snake body to current snake position
    snakeBody[0] = [snakeX,snakeY];

    //updating snake's head position
    snakeX += velocityX;
    snakeY += velocityY;

    //checking if the snake's head is out of the wall
    if(snakeX <= 0 || snakeX >30 || snakeY <=0 || snakeY > 30){
        gameOver = true;
    }

    for(let i = 0; i<snakeBody.length; i++){
        //adding a div for each part of the snake's body
        htmlMarkup += `<div class = "head" style = "grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]} "></div>`;
        //checking if the snake head hit the body
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0]=== snakeBody[i][0]){
            gameOver = true;
        }
    }

    
    playBoard.innerHTML = htmlMarkup; //creating food element and insterting it in the playBoard element.
}
changeFoodPosition();
initGame();
/*The snake head will move after every 125 milliseconds */
setIntervalId = setInterval(initGame,125);
document.addEventListener("keydown",changeDirection);