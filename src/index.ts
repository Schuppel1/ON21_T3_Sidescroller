let canvas: HTMLCanvasElement = document.getElementById("canvas-game") as HTMLCanvasElement
//Größe setzen. Kann später verändert werden. 
let context = canvas.getContext("2d");
let plattforms: Plattform[] = []; //Hier sind alle Plattformen drin. 
//die Obstacle dienen nur dem Styling. Haben keinen Effekt was Collision angeht. 
let groundObstacle: Obstacle[] = []; //Hier sind alle Plattformen drin.
let gameStatus: "Gewonnen" | "Game-Over" | "Pause" | "On-Going" = "On-Going"

class Obstacle {
    position: {
        x: number;
        y: number;
    };
    width: number;
    height: number;
    sheet: HTMLImageElement = new Image();
    spriteWith: number = 0;
    spriteHeight: number = 0;

    imgCount: number = 0
    aktuelImg: number = 0
    aktuelUrl: string = ""
    animatedSprite: boolean = true
    frameDivider: number = 0;
    constructor(xPosition: number, yPosition: number, width: number, height: number, spriteUrl: string, spriteWith: number, spriteHeight: number, animatedSprite?: boolean, imgCount?: number) {
        this.position = {
            x: xPosition,
            y: yPosition
        }
        this.width = width
        this.height = height
        this.spriteWith = spriteWith
        this.spriteHeight = spriteHeight
        this.sheet.src = spriteUrl
        this.imgCount = imgCount ?? 0
        this.animatedSprite = animatedSprite ?? false
        this.aktuelUrl = spriteUrl
    }



    private draw(): void {
        if (!this.animatedSprite) {
            context!.drawImage(this.sheet,
                0, 0, this.spriteWith, this.spriteHeight,
                this.position.x, this.position.y, this.width, this.height);
        } else {
            //reduziert die 60fps zu 5fps
            if ((++this.frameDivider) % 10 == 0) {
                this.aktuelImg = (this.aktuelImg + 1) % this.imgCount
            }

            this.sheet.src = this.aktuelUrl + this.aktuelImg.toString() + ".png"

            context!.drawImage(this.sheet,
                0, 0, this.spriteWith, this.spriteHeight,
                this.position.x, this.position.y, this.width, this.height);
        }
    }

    update(): void {
        this.draw();
    }
}

let rightBarrier: number = 4 * innerWidth / 5; //Ab diesen Punkt wird der Bachground verschoben anstatt der Spieler
let leftBarrier: number = innerWidth / 5; // Ab diesen Punkt wird der Bachground verschoben anstatt der Spieler
let gameOverStatus: boolean = false;

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

enum Status {
    Normal, JumpingLeft, JumpingRight, Dead
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
    jumpUrlBase: string = "./img/player/CuteGirlFiles/jump/Jump"
    jumpImgCount: number = 30
    deadUrlBase: string = "./img/player/CuteGirlFiles/dead/Dead"
    deadImgCount: number = 30
    aktuelImg: number = 0
    aktuelUrl: string = ""
    aktuelImgCount: number = 0

    constructor() {
        this.playerStatus = Status.Normal;
        this.position = {
            x: leftBarrier + 10,  // x Position des Spielers
            y: 249   // Y Position des Spielers
        }
        this.pysikForce = {
            x: 0, // Kraft in x Richtung (könnte Wind sein)
            y: 5  // Gravitation nach unten
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
        this.animatemovement();
        // this.draw();
    }

    moveHorizontal(force: number): void {
        if (gameStatus == "On-Going") {
            this.pysikForce.x = force;
        } else {
            this.pysikForce.x = 0;
        }

    }

    jump(): void {
        if (this.playerStatus == (Status.Normal)) {
            //this.pysikForce.y += -10;
            this.pysikForce.y += -4.5;
            if (playerControlButtons.left.pressed) {
                this.playerStatus = Status.JumpingLeft;
            } else {
                this.playerStatus = Status.JumpingRight;
            }
        }
    }

    private animatemovement(): void {
        let left = false;

        if (playerControlButtons.left.pressed && gameStatus == "On-Going") {
            //movement left
            this.aktuelImgCount = this.runImgCount;
            this.aktuelUrl = this.runUrlBase;
            left = true;
        } else if (playerControlButtons.right.pressed && gameStatus == "On-Going") {
            //movement right
            this.aktuelImgCount = this.runImgCount;
            this.aktuelUrl = this.runUrlBase;
            left = false;
        } else if (this.playerStatus == Status.JumpingLeft) {
            //jump to the Left
            this.aktuelImgCount = this.jumpImgCount;
            this.aktuelUrl = this.jumpUrlBase;
            left = true;
        } else if (this.playerStatus == Status.JumpingRight) {
            //jump to the right
            this.aktuelImgCount = this.jumpImgCount;
            this.aktuelUrl = this.jumpUrlBase;
            left = false;
        } else if (this.playerStatus == Status.Dead) {
            //yo soy un poco dead
            this.aktuelImgCount = this.deadImgCount;
            this.aktuelUrl = this.deadUrlBase;
            left = false;
        } else {
            //Idle
            this.aktuelImgCount = this.idleImgCount;
            this.aktuelUrl = this.idleUrlBase;
            left = false;
        }
        if (this.playerStatus == Status.Dead) {
            if ((++this.frameDivider) % 10 == 0) {
                if (this.aktuelImg != this.aktuelImgCount - 1) {
                    this.aktuelImg = (this.aktuelImg + 1) % this.aktuelImgCount
                }
            }
        } else {
            if ((++this.frameDivider) % 3 == 0) {
                this.aktuelImg = (this.aktuelImg + 1) % this.aktuelImgCount
            }
        }

        if (left) {
            this.sheet.src = this.aktuelUrl + this.aktuelImg.toString() + "left" + ".png"
        } else {
            this.sheet.src = this.aktuelUrl + this.aktuelImg.toString() + ".png"
        }

        if (this.playerStatus == Status.Dead) {
            context!.drawImage(this.sheet,
                0, 0, 601, 502,
                this.position.x, this.position.y, 80, 75);
        } else {
            context!.drawImage(this.sheet,
                0, 0, 416, 454,
                this.position.x, this.position.y, 75, 75);
        }

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
    },
    pause: {
        pressed: false
    }
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
        case "p":
            playerControlButtons.pause.pressed = true;
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
        case "p":
            playerControlButtons.pause.pressed = false;
            break;
        default:
            break;
    }
});

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