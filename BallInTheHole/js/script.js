window.addEventListener("load", init);

let orientation = new phoneOrientation(0, 0);
let player, points, timer;
let holes;

let playing = false;


function init() {

    window.addEventListener("deviceorientation", updatePhoneOrientation);
    var canvas = document.getElementById("canvas");
    //set canvas
    if (window.innerWidth > window.innerHeight) {
        canvas.width = (window.innerHeight - ((2 / 10) * window.innerHeight));
        canvas.height = (window.innerHeight - ((2 / 10) * window.innerHeight));
    } else {
        canvas.width = (window.innerWidth - ((1 / 10) * window.innerWidth));
        canvas.height = (window.innerWidth - ((1 / 10) * window.innerWidth));
    }
    //add listners to buttons
    document.getElementById('startGame').addEventListener("click", () => {
        if (!playing)
            startGame();
    })
    document.getElementById('resetGame').addEventListener("click", () => {
        startGame();
    })

}

function startGame() {

    //reset variables
    player = new playerBall(0, 0, 0);
    holes = [];
    points = 0;
    timer = 20;

    playing = true;
    placePlayerBall(player);
    //set 5 holes at start
    for (let i = 0; i < 5; i++)
        placeNewHole();
    //set first hole as target
    holes[0].target = true;
    //start counting
    countdownTimer();

}

function collectHole() {

    let distance, dX, dY;

    holes.forEach((el) => {
        dX = Math.abs((el.x - player.x));
        dY = Math.abs((el.y - player.y));
        distance = Math.sqrt((dX * dX) + (dY * dY));
        //check player distance from hole
        if (distance <= player.radius) {
            //if hole is target, add ponits and timer
            if (el.target) {
                points++;
                //adding less point, with less time
                if (points > 15 && points < 80) {
                    timer += 2;
                } else if (points >= 80) {
                    timer += 1;
                } else if (points <= 15)
                    timer += 3;
                //set target for next element
                holes[1].target = true;
                // add new hole at the end of board
                placeNewHole();
                //delete first board, after new one, to prevent creating hole in place of old one.
                holes.shift();
            }
            //if player get red ball lose
            else {
                alert("You lost the game.")
                playing = false;
            }
        }
    })

}

function countdownTimer() {
    timer--;
    if (timer < 0) {
        playing = false;
        alert("You lost the game.");
    }

    if (playing)
        setTimeout(countdownTimer, 1000);
}

function placeNewHole() {
    let x, y;
    let radius = (canvas.width / 50);
    let check;
    //creating holes until, their will  be set on right positions (not one on other)
    do {
        x = Math.floor(Math.random() * (canvas.width - 100)) + 50; // 50 - (canvas.width - 50)
        y = Math.floor(Math.random() * (canvas.height - 100)) + 50; // 50 - (canvas.height - 50)
        check = checkIfHoleNearby(x, y, 3 * radius)

    }
    while (check);
    //add to board
    let hole = new Hole(x, y, false, radius);
    holes.push(hole);

}

function checkIfHoleNearby(_x, _y, _radius) {

    let distance;
    let dX, dY;
    let nearby;
    //check if ball is around position
    for (let i = 0; i < holes.length; i++) {
        dX = Math.abs((holes[i].x - _x));
        dY = Math.abs((holes[i].y - _y));
        distance = Math.sqrt((dX * dX) + (dY * dY));
        console.log(distance);
        if (distance <= _radius) {
            nearby = true;
            break;
        } else
            nearby = false;
    }
    return nearby;

}

function moveAndDrawObjects() {

    let ctx = canvas.getContext("2d");
    //clean canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //drawing holes
    holes.forEach((el) => {
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius, 0, 2 * Math.PI, false);
        // if target is on green, if not on red
        if (el.target) {
            ctx.strokeStyle = "#98FB98";
            ctx.fillStyle = "#98FB98";
        } else {
            ctx.strokeStyle = "#FF4500";
            ctx.fillStyle = "#FF4500";
        }
        ctx.fill();
        ctx.stroke()
    });
    //mobing ball acorrdingly with phone orientation
    let velocityX = (orientation.gamma * canvas.width) / 4000;
    let velocityY = (orientation.beta * canvas.height) / 4000;
    player.x += velocityX;
    player.y += velocityY;
    //if new position is outside of canvas boarder, move ball to opposite end
    if (player.x > (canvas.width + player.radius))
        player.x = 0;
    if (player.y > (canvas.height + player.radius))
        player.y = 0;
    if (player.x < (0 - player.radius))
        player.x = canvas.width;
    if (player.y < (0 - player.radius))
        player.y = canvas.width;
    // check if player is around hole
    collectHole();
    // drawing ball on new position
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = "#ff9800";
    ctx.fillStyle = "#ff9800";
    ctx.fill();
    ctx.stroke();
    //timer drawing
    ctx.beginPath();
    ctx.font = "20px Open Sans";
    ctx.fillStyle = "white";
    ctx.fillText(timer, 10, 20);
    ctx.stroke();
    // drawing points
    ctx.beginPath();
    ctx.font = "20px Open Sans";
    ctx.fillStyle = "white";
    //right distance from points numbers
    if (points >= 10)
        ctx.fillText(points, (canvas.width - 30), 20);
    else if (points >= 100)
        ctx.fillText(points, (canvas.width - 50), 20);
    else
        ctx.fillText(points, (canvas.width - 20), 20);
    ctx.stroke();
    //if game is still on, call func
    if (playing)
        requestAnimationFrame(moveAndDrawObjects);
}

function phoneOrientation(_b, _g) {

    this.beta = _b;
    this.gamma = _g;

}

function updatePhoneOrientation(event) {

    orientation.beta = event.beta; //-180 - 180
    orientation.gamma = event.gamma; //-90 - 90
    //prevent change phone orientation
    if (orientation.beta > 90) orientation.beta = 90;
    if (orientation.beta < -90) orientation.beta = -90;


}

function playerBall(_x, _y, _radius) {

    this.x = _x;
    this.y = _y;
    this.radius = _radius;
}

function placePlayerBall(playerBall) {
    //set ball on start position
    let startingX = (canvas.width / 2);
    let startingY = (canvas.height / 2);
    // set radius with canvas size
    let radius = (canvas.width / 50);
    playerBall.x = startingX;
    playerBall.y = startingY;
    playerBall.radius = radius;
    moveAndDrawObjects();

}

function Hole(_x, _y, _target, _radius) {

    this.x = _x;
    this.y = _y;
    this.target = _target;
    this.radius = _radius;
}