// Dieses Modul Repäsentiert Obstacle. Also Gefahren/Hinternisse. 
export abstract class Obstacle {
    position: {
        x: number
        y: number
    }
    width: number
    height: number
    sheet: HTMLImageElement = new Image()
    spriteWith: number = 0
    spriteHeight: number = 0

    imgCount: number = 0
    aktuelImg: number = 0
    aktuelUrl: string = ""
    animatedSprite: boolean = true
    frameDivider: number = 0
    canvasContext: CanvasRenderingContext2D
    startpositionX: number
    startpositionY: number

    constructor(context: CanvasRenderingContext2D, xPosition: number, yPosition: number, width: number, height: number, spriteUrl: string, spriteWith: number, spriteHeight: number, animatedSprite?: boolean, imgCount?: number) {
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
        this.imgCount = imgCount ?? 0
        this.animatedSprite = animatedSprite ?? false
        this.aktuelUrl = spriteUrl
        this.canvasContext = context
    }



    private animation(): void {
        if (!this.animatedSprite) {
            this.canvasContext!.drawImage(this.sheet,
                0, 0, this.spriteWith, this.spriteHeight,
                this.position.x, this.position.y, this.width, this.height)
        } else {
            //reduziert die 60fps zu 5fps
            if ((++this.frameDivider) % 10 == 0) {
                this.aktuelImg = (this.aktuelImg + 1) % this.imgCount
            }

            this.sheet.src = this.aktuelUrl + this.aktuelImg.toString() + ".png"

            this.canvasContext!.drawImage(this.sheet,
                0, 0, this.spriteWith, this.spriteHeight,
                this.position.x, this.position.y, this.width, this.height)
        }
    }

    update(): void {
        this.animation()
    }

    reset(): void {
        this.position = {
            x: this.startpositionX ,
            y: this.startpositionY 
        }
    }
}

export function updateAllObstacle(obstacles: Obstacle[]): void {
    obstacles.forEach(element => {
        element.update()
    })
}

//Dimension 100px Breite 100px Höhe 
export class Flame extends Obstacle {
    constructor(positionX: number, positionY: number, context: CanvasRenderingContext2D) {
        super(context, positionX, positionY, 100, 100, "./img/obstacle/flame/fire", 256, 256, true, 13)
    }
}

//Dimension 50px Breite 80px Höhe 
export class Spike extends Obstacle {
    constructor(positionX: number, positionY: number, context: CanvasRenderingContext2D) {
        super(context, positionX, positionY, 50, 80, "./img/obstacle/spike/spike.png", 139, 250)
    }
}

//Dimension 300px Breite 300px Höhe 
export class Portal extends Obstacle {
    constructor(positionX: number, positionY: number, context: CanvasRenderingContext2D) {
        super(context, positionX, positionY, 300, 300, "./img/obstacle/portal/portalleft.png", 1025, 1025)
    }
}