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



function setGamesize(): void {
    let h1Element = document.querySelector("h1")!;
    let h1Size: number = h1Element.clientHeight;
    let h1MarginTop: number = parseInt(getComputedStyle(h1Element).marginTop) + 1;
    let h1MarginBot: number = parseInt(getComputedStyle(h1Element).marginBottom) + 1;

    canvas.height = window.innerHeight - h1Size - h1MarginTop - h1MarginBot - 5;
    canvas.width = window.innerWidth - 10;
}

setGamesize();

window.addEventListener("resize", function () {
    setGamesize();
});


let context = canvas.getContext("2d");

//Map Constante Gravitation. (Die Fallgeschwindigkeit/pysikForce.y nimmt beim fallen zu.)
const gravitiy:number = .1;

//Modul auslagern!!!
class Player {
    height: number;
    width: number;
    position: { x: number; y: number; };
    pysikForce: { x: number; y: number; };

    constructor() {
        this.position = {
            x: 50,  // x Position des Spielers
            y: 50   // Y Position des Spielers
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
        this.eraseOldFrame();
        this.position.y += this.pysikForce.y;
        this.position.x += this.pysikForce.x;
        //später auslagern und überprüfen auf Platformen. 
        if(this.position.y + this.height + this.pysikForce.y <= canvas.height) {
            this.pysikForce.y += gravitiy;
        } else {
            this.pysikForce.y = 0;
        }
        this.draw();
    }

    private eraseOldFrame(): void {
        // Ohne -1 bein der Y - Position gibt es Streifen. 
        context?.clearRect(this.position.x, this.position.y-1, this.width, this.height);
    }
}



const player: Player = new Player()


function animate(): void {
    requestAnimationFrame(animate)
    player.update();
}

animate();