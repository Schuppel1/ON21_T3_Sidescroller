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
    let h1MarginTop: number = parseInt(window.getComputedStyle(h1Element).marginTop) + 1;
    let h1MarginBot: number = parseInt(window.getComputedStyle(h1Element).marginBottom) + 1;

    canvas.height = window.innerHeight - h1Size - h1MarginTop - h1MarginBot - 5;
    canvas.width = window.innerWidth - 10;
}

setGamesize();

window.addEventListener("resize", function () {
    setGamesize();
});


let c = canvas.getContext("2d");


