//THIS IS THE ENTRY FILE - WRITE YOUR MAIN LOGIC HERE!

// import { helloWorld, Beispiel } from "./myModule";
// import { alertMe } from "./myOtherModule";

// console.log(helloWorld);
// customElements.define("my-beispiel", Beispiel);

// alertMe();

// const myInputValue = document.querySelector<HTMLInputElement>("#myInput");

// const myInputValueAlternate = document.querySelector(
//   "#myInput"
// ) as HTMLInputElement;

// document
//   .querySelector<HTMLInputElement>("#myInput")
//   ?.addEventListener("focus", doSmth);

// function doSmth(e: UIEvent) {
//   const val = e.target as HTMLInputElement;
//   console.log(e, val.value);
// }

// Obere Einträge sind Beispieleinträge aus der Vorlage

// Canvas Element holen
let canvas: HTMLCanvasElement = document.getElementById("canvas-game") as HTMLCanvasElement
//Größe setzen. Kann später verändert werden. 
let context = canvas.getContext("2d");
let plattforms: Plattform[] = []; //Hier sind alle Plattformen drin. 

let rightBarrier: number = 4 * innerWidth / 5; //Ab diesen Punkt wird der Bachground verschoben anstatt der Spieler
let leftBarrier: number = innerWidth / 5; // Ab diesen Punkt wird der Bachground verschoben anstatt der Spieler
let gameOverStatus: boolean = false;



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

enum Status {
    Jumping, Normal, Duck
}
//Modul auslagern!!!s
class Player {
    height: number;
    width: number;
    position: { x: number; y: number; };
    pysikForce: { x: number; y: number; };
    playerStatus: Status;

    frameDivider = 3; //animate ist bei 60fps durch 3 geteilt sind 20fps.  

    sheet: HTMLImageElement = new Image();
    runUrlBase: string = "./img/player/CuteGirlFiles/run/Run"
    runImgCount: number = 20
    idleUrlBase: string = "./img/player/CuteGirlFiles/idle/Idle"
    idleImgCount: number = 16
    aktuelImg: number = 0

    constructor() {
        this.playerStatus = Status.Normal;
        this.position = {
            x: leftBarrier + 10,  // x Position des Spielers
            y: 249   // Y Position des Spielers
        }
        this.pysikForce = {
            x: 0, // Kraft in x Richtung (könnte Wind sein)
            y: 0  // Gravitation nach unten
        }
        this.width = 75  // Breite des Spielers
        this.height = 75 // Höhe des Spielers
    }

    private draw(): void {
        context!.fillStyle = 'red'
        context!.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    // wird nach jedem Zeitintervall aufgerufen. Updatet die Position etc. 
    update(): void {
        let roundString: string;
        //this.eraseOldFrame();
        roundString = (this.position.y + this.pysikForce.y).toFixed(3);
        this.position.y = Number(roundString);
        roundString = (this.position.x + this.pysikForce.x).toFixed(3);
        this.position.x = Number(roundString);
        //this.draw();
        this.animatemovement();
    }

    private eraseOldFrame(): void {
        // Ohne -1 bein der Y - Position gibt es Streifen. 
        context!.clearRect(this.position.x, this.position.y - 2, this.width, this.height + 2);
    }


    moveHorizontal(force: number): void {

        this.pysikForce.x = force;

    }

    jump(): void {
        if (this.playerStatus == (Status.Normal || Status.Duck)) {
            //this.pysikForce.y += -10;
            this.pysikForce.y += -6.0;
            this.playerStatus = Status.Jumping;
        }
    }

    private animatemovement(): void {



        if (playerControlButtons.left.pressed) {
            //movement left
            if ((++this.frameDivider) % 3 == 0) {
                this.aktuelImg = (this.aktuelImg + 1) % this.runImgCount
            }
            if (this.aktuelImg < 10) {
                this.sheet.src = this.runUrlBase + "0" + this.aktuelImg.toString() + "left.png"
            } else {
                this.sheet.src = this.runUrlBase + this.aktuelImg.toString() + "left.png"
            }
        } else if (playerControlButtons.right.pressed) {
            //movement right
            if ((++this.frameDivider) % 3 == 0) {
                this.aktuelImg = (this.aktuelImg + 1) % this.runImgCount
            }
            if (this.aktuelImg < 10) {
                this.sheet.src = this.runUrlBase + "0" + this.aktuelImg.toString() + ".png"
            } else {
                this.sheet.src = this.runUrlBase + this.aktuelImg.toString() + ".png"
            }
        } else if (false) {
            //jump
        } else {
            //Idle
            if ((++this.frameDivider) % 3 == 0) {
                this.aktuelImg = (this.aktuelImg + 1) % this.idleImgCount
            }
            this.sheet.src = this.idleUrlBase + this.aktuelImg.toString() + ".png"            
        }


        context!.drawImage(this.sheet,
            0, 0, 416, 454,
            this.position.x, this.position.y, 75, 75);
    }
}

const player: Player = new Player()
let playerControlButtons = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    jump: {
        pressed: false
    },
    yes: {
        pressed: false
    }
}


function collsion(player: Player, plattform: Plattform): boolean {
    let standOnPlattform: boolean = plattform.standOnTop(player);
    //console.log(standOnPlattform)
    if (standOnPlattform) {
        player.playerStatus = Status.Normal;
        player.pysikForce.y = 0;
        return true;
    } else if (player.position.y + player.height <= canvas.height) {

        player.pysikForce.y += gravitiy;
    } else {
        if (player.pysikForce.y > 0) {
            player.playerStatus = Status.Normal;
            player.pysikForce.y = 0;
        }
    }
    return false;
}

//steuerung einmal taste wird gedrückt
addEventListener('keydown', (event: KeyboardEvent) => {
    switch (event.key) {
        case "a":
            // player.moveleft();
            playerControlButtons.left.pressed = true;
            break;
        case "d":
            // player.moveright();
            playerControlButtons.right.pressed = true;
            break;
        case " ":
            // player.jump();
            playerControlButtons.jump.pressed = true;
            break;
        case "y":
            playerControlButtons.yes.pressed = true;
            break;
        default:
            break;
    }
});

//steuerung taste wird losgelassen
addEventListener('keyup', (event: KeyboardEvent) => {
    switch (event.key) {
        case "a":
            // player.moveleft();
            playerControlButtons.left.pressed = false;
            break;
        case "d":
            // player.moveright();
            playerControlButtons.right.pressed = false;
            break;
        case " ":
            // player.jump();
            playerControlButtons.jump.pressed = false;
            break;
        case "y":
            playerControlButtons.yes.pressed = false;
            break;
        default:
            break;
    }
});

function playerMovementControl(): void {
    let xSpeed = 2;
    if (!gameOverStatus) {
        if (playerControlButtons.left.pressed) {
            if (player.position.x - xSpeed < leftBarrier) {
                controllBackground(-xSpeed);
                player.moveHorizontal(0);

            } else {
                player.moveHorizontal(-xSpeed);
            }
        } else if (playerControlButtons.right.pressed) {
            if (player.position.x + player.width + xSpeed > rightBarrier) {
                controllBackground(xSpeed);
                player.moveHorizontal(0);
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
        gameOver()
        return true;
    } else {
        return false;
    }
}

function gameOver() {
    context!.font = '48px serif';
    context!.fillText('Game Over!!!', 200, 50);
    context!.font = '20px serif';
    context!.fillText('Willst es noch einmal Versuchen? y/n', 200, 75);
    gameOverStatus = true;
}

//left = true; Hintergrund nach links verschieben. 
function controllBackground(force: number): void {
    plattforms.forEach(function (item) {
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
    constructor(xPosition: number, yPosition: number, width: number, height: number) {
        this.firmness = "open";
        this.position = {
            x: xPosition,
            y: yPosition
        }
        this.width = width
        this.height = height
    }

    private draw(): void {
        context!.fillStyle = 'blue'
        context!.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(): void {
        this.draw();
    }

    standOnTop(player: Player): boolean {
        if (player.position.x + player.width >= this.position.x &&
            player.position.x + 1 <= this.position.x + this.width) {
            if (player.position.y + player.height + Math.min(player.pysikForce.y, gravitiy) <= this.position.y) {
                if (player.position.y + player.height + Math.max(player.pysikForce.y, gravitiy) >= this.position.y - gravitiy) {
                    if (player.pysikForce.y >= 0) {
                        return true;
                    }
                } else {
                }
            } else {
            }
        }
        return false;
    }
}


const testPlattform: Plattform = new Plattform(leftBarrier - 50, 350, 300, 20)
const bodenPlatte: Plattform = new Plattform(0, 400, 1200, 20)

plattforms.push(testPlattform);
plattforms.push(bodenPlatte);


function pauseGame() {

}

function animate(): void {
    playerMovementControl();
    gameOverStatus = checkIfDead();
    if (!gameOverStatus) {
        collsion(player, testPlattform)
    } else {
        if (playerControlButtons.yes.pressed) {
            //reset();
            player.position.x = leftBarrier + 10
            player.position.y = 0
            gameOverStatus = false;
        }
    }
    context!.clearRect(0, 0, innerWidth, innerHeight);
    requestAnimationFrame(animate)
    if (collsion(player, testPlattform)) { } else if (collsion(player, bodenPlatte)) { }


    testPlattform.update();
    bodenPlatte.update();
    player.update();
    //drawBarrier();
    checkIfDead();

}
setGamesize();
animate();




//Video :35min