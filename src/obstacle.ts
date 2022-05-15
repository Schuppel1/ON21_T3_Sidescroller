// Dieses Modul Repäsentiert Obstacle. Also Gefahren/Hinternisse. 
export class Obstacle {
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
    canvasContext: CanvasRenderingContext2D;
    startpositionX: number;
    startpositionY: number;

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
                this.position.x, this.position.y, this.width, this.height);
        } else {
            //reduziert die 60fps zu 5fps
            if ((++this.frameDivider) % 10 == 0) {
                this.aktuelImg = (this.aktuelImg + 1) % this.imgCount
            }

            this.sheet.src = this.aktuelUrl + this.aktuelImg.toString() + ".png"

            this.canvasContext!.drawImage(this.sheet,
                0, 0, this.spriteWith, this.spriteHeight,
                this.position.x, this.position.y, this.width, this.height);
        }
    }

    update(): void {
        this.animation();
    }
}

export function updateAllObstacle(obstacles:Obstacle[]): void {
    obstacles.forEach(element => {
        element.update();
    });
}