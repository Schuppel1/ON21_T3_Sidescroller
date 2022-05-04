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

let plattforms: Plattform[] = []; //Hier sind alle Plattformen drin. 


function setGamesize(): void {
    let h1Element = document.querySelector("h1")!;
    let h1Size: number = h1Element.clientHeight;
    let h1MarginTop: number = parseInt(getComputedStyle(h1Element).marginTop) + 1;
    let h1MarginBot: number = parseInt(getComputedStyle(h1Element).marginBottom) + 1;

    canvas.height = window.innerHeight - h1Size - h1MarginTop - h1MarginBot - 5;
    canvas.width = window.innerWidth - 10;
}



window.addEventListener("resize", function () {
    setGamesize();
});


let context = canvas.getContext("2d");

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

    constructor() {
        this.playerStatus = Status.Normal;
        this.position = {
            x: 50,  // x Position des Spielers
            y: 249   // Y Position des Spielers
        }
        this.pysikForce = {
            x: 0, // Kraft in x Richtung (könnte Wind sein)
            y: 0  // Gravitation nach unten
        }
        this.width = 100  // Breite des Spielers
        this.height = 100 // Höhe des Spielers
    }

    private draw(): void {
        context!.fillStyle = 'red'
        context!.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    // wird nach jedem Zeitintervall aufgerufen. Updatet die Position etc. 
    update(): void {
        let roundString: String;
        //this.eraseOldFrame();
        roundString = (this.position.y + this.pysikForce.y).toFixed(3);
        this.position.y = Number(roundString);
        roundString = (this.position.x + this.pysikForce.x).toFixed(3);
        this.position.x = Number(roundString);
        this.draw();
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
    }
}


function collsion(player: Player, plattform: Plattform) {
    let standOnPlattform: boolean = plattform.standOnTop(player);
    //console.log(standOnPlattform)
    if (standOnPlattform) {
        player.playerStatus = Status.Normal;
        player.pysikForce.y = 0;
    } else if (player.position.y + player.height <= canvas.height) {

        player.pysikForce.y += gravitiy;
    } else {
        if (player.pysikForce.y > 0) {
            player.playerStatus = Status.Normal;
            player.pysikForce.y = 0;
        }
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
        default:
            break;
    }
});

function playerMovementControl() {
    let xSpeed = 2;
    if (playerControlButtons.left.pressed) {
        player.moveHorizontal(-xSpeed);

    } else if (playerControlButtons.right.pressed) {
        player.moveHorizontal(xSpeed);
    }
    else {
        player.moveHorizontal(0);
    }

    if (playerControlButtons.jump.pressed) {
        player.jump();
    }
}

class Plattform {
    firmness: "solid" | "open" | "jumpable"; // If you walk through it (open), can jump through it button it (jumpable) or nothing (solid) 
    position: {
        x: number;
        y: number;
    };
    width: number;
    height: number;
    constructor() {
        this.firmness = "open";
        this.position = {
            x: 50,
            y: 350
        }
        this.width = 300
        this.height = 20
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


const testPlattform: Plattform = new Plattform()
plattforms.push(testPlattform);



function animate(): void {
    requestAnimationFrame(animate)
    playerMovementControl();
    context!.clearRect(0, 0, innerWidth, innerHeight);
    testPlattform.update();
    //console.log("Update Player: y: "+ player.position.y + " y+h :" + (player.position.y + player.height)  + " pysikForce " + player.pysikForce.y)
    collsion(player, testPlattform)
    player.update();
}

animate();
setGamesize();

//Video :35min