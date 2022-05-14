import { Player } from "./player";
import { Obstacle } from "./obstacle";

let canvas: HTMLCanvasElement = document.getElementById("canvas-game") as HTMLCanvasElement
//Größe setzen. Kann später verändert werden. 
let context = canvas.getContext("2d");
let plattforms: Plattform[] = []; //Hier sind alle Plattformen drin. 
//die Obstacle dienen nur dem Styling. Haben keinen Effekt was Collision angeht. 
let groundObstacle: Obstacle[] = []; //Hier sind alle Plattformen drin.

//1920x663
let background: { picture: HTMLImageElement; deltaX: number } = {
    picture: new Image(),
    deltaX: 0
}

background.picture.src = "./img/background/forest0.jpg"

function setGamesize(): void {
    let h1Element = document.querySelector("h1")!;
    let h1Size: number = h1Element.clientHeight;
    let h1MarginTop: number = parseInt(getComputedStyle(h1Element).marginTop) + 1;
    let h1MarginBot: number = parseInt(getComputedStyle(h1Element).marginBottom) + 1;

    canvas.height = window.innerHeight - h1Size - h1MarginTop - h1MarginBot - 10;
    canvas.width = window.innerWidth - 10;
}

window.addEventListener("resize", function () {
    setGamesize();
    drawBarrier();
    rightBarrier = 4 * innerWidth / 5;
    leftBarrier = innerWidth / 5
});




//Map Constante Gravitation. (Die Fallgeschwindigkeit/pysikForce.y nimmt beim fallen zu.)
const gravitiy: number = .05;


//Modul auslagern!!!s


const player: Player = new Player(context!, leftBarrier+20)




function playerMovementControl(): void {
    let xSpeed = 2;
    if (gameStatus == "On-Going") {
        if (playerControlButtons.left.pressed) {
            if (player.position.x - xSpeed < leftBarrier) {
                if (background.deltaX != 0) {
                    background.deltaX -= 0.5;
                    controllBackground(-xSpeed);
                }
                player.moveHorizontal(0);

            } else {
                player.moveHorizontal(-xSpeed);
            }
        } else if (playerControlButtons.right.pressed) {
            if (player.position.x + player.width + xSpeed > rightBarrier) {
                controllBackground(xSpeed);
                player.moveHorizontal(0);
                if (background.deltaX != 720) {
                    background.deltaX += 0.5;
                }

            } else {
                player.moveHorizontal(xSpeed);
            }

        }
        else {
            player.moveHorizontal(0);
        }

        if (playerControlButtons.jump.pressed) {
            player.jump();
        }
    } else {
        player.moveHorizontal(0);
    }

}

function checkIfDead(): boolean {
    if (player.position.y + player.height >= canvas.height) {
        player.playerStatus = Status.Dead
        gameStatus = "Game-Over";
        gameOver()

        return true;
    } else {
        return false;
    }
}

function gameOver() {
    context!.fillStyle = "white";
    context!.font = '48px serif';
    context!.fillText('Game Over!!!', 200, 50);
    context!.font = '20px serif';
    context!.fillText('Willst es noch einmal Versuchen? y/n', 200, 75);
    gameStatus = "Game-Over"
}

//left = true; Hintergrund nach links verschieben. 
function controllBackground(force: number): void {
    plattforms.forEach(function (item) {
        item.position.x -= force;
    });

    groundObstacle.forEach(function (item) {
        item.position.x -= force;
    });
    //HintergrundBild muss noch verschoben werden. Aber Async
}

function drawBarrier() {
    context!.fillStyle = 'black'
    context!.fillRect(innerWidth / 5, 0, 1, innerHeight)
    context!.fillRect(4 * innerWidth / 5, 0, 1, innerHeight)
}

class Plattform {
    firmness: "solid" | "open" | "jumpable"; // If you walk through it (open), can jump through it button it (jumpable) or nothing (solid) 
    position: {
        x: number;
        y: number;
    };
    width: number;
    height: number;
    sheet: HTMLImageElement = new Image();
    spriteWith: number = 0;
    spriteHeight: number = 0;
    constructor(xPosition: number, yPosition: number, width: number, height: number, spriteUrl: string, spriteWith: number, spriteHeight: number) {
        this.firmness = "open";
        this.position = {
            x: xPosition,
            y: yPosition
        }
        this.width = width
        this.height = height
        this.spriteWith = spriteWith
        this.spriteHeight = spriteHeight
        this.sheet.src = spriteUrl
    }

    private draw(): void {
        let count: number = this.width / this.spriteWith;
        for (let i = 0; i < count; i++) {
            context!.drawImage(this.sheet,
                0, 0, this.spriteWith, this.spriteHeight,
                this.position.x + i * this.spriteWith, this.position.y - 10, this.spriteWith, this.height);
        }

        // context!.fillStyle = 'red'
        // context!.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(): void {
        this.draw();
    }

    standOnTop(player: Player): boolean {
        //-20 wegen dem Spielermodel damit es realistischer wirkt
        if (player.position.x + player.width >= this.position.x + 20 &&
            player.position.x + 1 <= this.position.x + this.width - 20) {
            //if (player.position.y + player.height + Math.min(player.pysikForce.y, gravitiy) <= this.position.y) {
            if (player.position.y + player.height <= this.position.y) {
                if (player.position.y + player.height + Math.max(player.pysikForce.y, gravitiy) >= this.position.y - gravitiy) {
                    if (player.pysikForce.y >= 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

function loadBackground(): void {

    context!.drawImage(background.picture, background.deltaX, 0, 1200, 663,
        0, 0, innerWidth, innerHeight);
}

//plattforms.push(testPlattform);
plattforms.push(new Plattform(0, innerHeight - 150, 1000, 100, "./img/grass100x100.png", 100, 100));
plattforms.push(new Plattform(1080, innerHeight - 150, 1000, 100, "./img/grass100x100.png", 100, 100));
plattforms.push(new Plattform(2080, innerHeight - 150, 1000, 100, "./img/grass100x100.png", 100, 100));
plattforms.push(new Plattform(3450, innerHeight - 150, 1000, 100, "./img/grass100x100.png", 100, 100));

groundObstacle.push(new Obstacle(1000, innerHeight - 140, 80, 80, "./img/assets/flame/fire", 256, 256, true, 13));
groundObstacle.push(new Obstacle(3090, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3130, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3170, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3210, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3250, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3290, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3330, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3370, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3410, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));

let portal: Obstacle = new Obstacle(4150, innerHeight - 445, 300, 300, "./img/assets/portal/portalleft.png", 1025, 1025)
groundObstacle.push(portal);

function checkAllCollision(): boolean {
    let standOnPlattform: boolean = false;
    let collisionPlattformHeight: number = player.position.y;

    for (let element of plattforms) {
        if (element.standOnTop(player)) {
            //Falls durch die gravitation nicht direkt position auf der Plattform erreicht wird
            collisionPlattformHeight = element.position.y
            standOnPlattform = true;
            break;
        }
    }

    if (standOnPlattform) {
        player.playerStatus = Status.Normal;
        player.pysikForce.y = 0;
        player.position.y = collisionPlattformHeight - player.height;
    } else if (player.position.y + player.height < canvas.height) {
        player.pysikForce.y += gravitiy;

    } else {
        if (player.pysikForce.y > 0) {
            player.playerStatus = Status.Dead;
            player.pysikForce.y = 0;
        }
    }

    // console.log(standOnPlattform)
    return standOnPlattform;
}

function updateAllPlattforms(): void {
    plattforms.forEach(element => {
        element.update();
    });
}

function updateAllObstacle(): void {
    groundObstacle.forEach(element => {
        element.update();
    });
}

function updateArray(myarray: Obstacle[] | Plattform[]): void {
    myarray.forEach((element: Obstacle | Plattform) => {
        element.update();
    });
}

function checkForWin(): void {
    if (player.position.x >= portal.position.x + 30) {

    }
}

function animate(): void {

    let deadTest:boolean=false;
    context!.clearRect(0, 0, innerWidth, innerHeight);
    requestAnimationFrame(animate)

    playerMovementControl();


    loadBackground()
    updateArray(plattforms)
    updateArray(groundObstacle)
    player.update()
    checkAllCollision()
    deadTest=checkIfDead(); 
    if (deadTest) {
        gameStatus = "Game-Over"        
    }

    switch (gameStatus) {
        case "Game-Over":
            if (playerControlButtons.yes.pressed) {
                player.position.y = 0
                gameStatus = "On-Going";
                player.playerStatus = Status.Normal;
            }
            break;
        case "Pause":
            if (playerControlButtons.pause.pressed) {
                gameStatus = "On-Going";
            }
            break;
        case "Gewonnen":
            if (playerControlButtons.yes.pressed) {
                player.position.y = 0
                gameStatus = "On-Going";
                player.playerStatus = Status.Normal;
            }
            break;
        case "On-Going":
            break;

    }
    // if (gameOverStatus) {
    //     if (playerControlButtons.yes.pressed) {
    //         player.position.y = 0
    //         gameOverStatus = false;
    //         player.playerStatus = Status.Normal;
    //     }
    // }

}
setGamesize();
animate();