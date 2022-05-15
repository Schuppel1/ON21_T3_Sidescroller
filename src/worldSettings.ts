//Map Constante Gravitation. (Die Fallgeschwindigkeit/pysikForce.y nimmt beim fallen zu.)
export const gravitiy: number = .05;

let gameStatus: "Gewonnen" | "Game-Over" | "Pause" | "On-Going" | "Dialog" = "On-Going"

export let rightBarrier = 4 * innerWidth / 5;
export let leftBarrier = innerWidth / 5

//1920x663
export let background: { picture: HTMLImageElement; deltaX: number } = {
    picture: new Image(),
    deltaX: 0,
}
background.picture.src = "./img/background/forest0.jpg"

export function getGameStatus(): "Gewonnen" | "Game-Over" | "Pause" | "On-Going" | "Dialog" {
    return gameStatus;
}

export function setGameStatus(gameStatusGlobal:"Gewonnen" | "Game-Over" | "Pause" | "On-Going" | "Dialog") {
    gameStatus = gameStatusGlobal;
}

export function setGamesize(canvas: HTMLCanvasElement): void {
    let h1Element = document.querySelector("h1")!;
    let h1Size: number = h1Element.clientHeight;
    let h1MarginTop: number = parseInt(getComputedStyle(h1Element).marginTop) + 1;
    let h1MarginBot: number = parseInt(getComputedStyle(h1Element).marginBottom) + 1;

    canvas.height = window.innerHeight - h1Size - h1MarginTop - h1MarginBot - 10;
    canvas.width = window.innerWidth - 10;
}

export function setLeftBarrier(value:number) {
    leftBarrier= value;
}

export function setRightBarrier(value:number) {
    rightBarrier= value;
}

export function loadBackground(context: CanvasRenderingContext2D): void {

    context!.drawImage(background.picture, background.deltaX, 0, 1200, 663,
        0, 0, innerWidth, innerHeight);
}
