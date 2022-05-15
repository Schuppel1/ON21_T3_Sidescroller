import { Player } from "./player"
import { gravitiy } from "./worldSettings"

//Dieses Model stellt die Plattformen da. 
export class Plattform {
    position: {
        x: number
        y: number
    }
    width: number
    height: number
    sheet: HTMLImageElement = new Image()
    spriteWith: number = 0
    spriteHeight: number = 0
    canvasContext: CanvasRenderingContext2D
    startpositionX: number
    startpositionY: number


    constructor(context: CanvasRenderingContext2D, xPosition: number, yPosition: number, width: number, height: number, spriteUrl: string, spriteWith: number, spriteHeight: number) {
        this.position = {
            x: xPosition,
            y: yPosition
        }
        this.startpositionX = xPosition
        this.startpositionY = yPosition
        this.width = width
        this.height = height
        this.spriteWith = spriteWith
        this.spriteHeight = spriteHeight
        this.sheet.src = spriteUrl
        this.canvasContext = context
    }

    private draw(): void {
        let count: number = this.width / this.spriteWith
        for (let i = 0; i < count; i++) {
            this.canvasContext.drawImage(this.sheet,
                0, 0, this.spriteWith, this.spriteHeight,
                this.position.x + i * this.spriteWith, this.position.y - 10, this.spriteWith, this.height)
        }

        // context!.fillStyle = 'red'
        // context!.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(): void {
        this.draw()
    }

    reset(): void {
        this.position = {
            x: this.startpositionX ,
            y: this.startpositionY 
        }
    }

    standOnTop(player: Player): boolean {
        //-20 wegen dem Spielermodel damit es realistischer wirkt
        if (player.position.x + player.width >= this.position.x + 20 &&
            player.position.x + 1 <= this.position.x + this.width - 20) {
            //if (player.position.y + player.height + Math.min(player.pysikForce.y, gravitiy) <= this.position.y) {
            if (player.position.y + player.height <= this.position.y) {
                if (player.position.y + player.height + Math.max(player.pysikForce.y, gravitiy) >= this.position.y - gravitiy) {
                    if (player.pysikForce.y >= 0) {
                        return true
                    }
                }
            }
        }
        return false
    }
}



export function updateAllPlattforms(plattforms:Plattform[]): void {
    plattforms.forEach(element => {
        element.update()
    })
}

export class GrassPlattform extends Plattform {
    constructor (positionX:number, positionY:number, context: CanvasRenderingContext2D) {
        super(context, positionX, positionY, 500, 100, "./img/plattform/grass100x100.png", 100, 100)
    }
}

export class IcePlattform extends Plattform {
    constructor (positionX:number, positionY:number, context: CanvasRenderingContext2D) {
        super(context, positionX, positionY, 100, 100, "./img/plattform/icePlattform100x100.png", 100, 100)
    }
}