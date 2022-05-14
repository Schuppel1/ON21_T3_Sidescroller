// THIS IS the Player Module!
// Dieses Modul repäsentiert das Spieler Modell und all seinen Functionen.

//Hier steht der Status was das Spieler Modell Sein kann. Wurde als Enum probiert. um zu sehen ob Enums in Typescript gehen. 
enum Status {
    Normal, JumpingLeft, JumpingRight, Dead
}

//ViewPorts. An diesen Punkt wird der Spieler nicht verschoben sondern der Hintergrund. 
let leftViewPort:number =  4 * innerWidth
let rightViewPort:number = innerWidth / 5

//Hier steht die Classe Spieler
export class Player {

    height: number
    width: number
    position: { x: number; y: number; }
    pysikForce: { x: number; y: number; }
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
    left:boolean = false
    
    canvasContext: CanvasRenderingContext2D

    
    constructor(context: CanvasRenderingContext2D ) {
        this.playerStatus = Status.Normal
        this.position = {
            x: leftViewPort + 10,  // x Position des Spielers
            y: 249   // Y Position des Spielers
        }
        this.pysikForce = {
            x: 0, // Kraft in x Richtung (könnte Wind sein)
            y: 5  // Gravitation nach unten
        }
        this.width = 75  // Breite des Spielers
        this.height = 75 // Höhe des Spielers
        this.canvasContext = context
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
        // if (gameStatus == "On-Going") {
        //     this.pysikForce.x = force;
        // } else {
        //     this.pysikForce.x = 0;
        // }
        this.pysikForce.x = force
        //Abfrage nach dem gameStatus muss Außerhalb der Classe erfolgen. 
    }

    jump(leftJump:boolean): void {
        if (this.playerStatus == (Status.Normal)) {
            //this.pysikForce.y += -10;
            this.pysikForce.y += -4.5;
            if (leftJump) {
                this.playerStatus = Status.JumpingLeft;
            } else {
                this.playerStatus = Status.JumpingRight;
            }
        }
    }

    // Muss in der PlayerControl gesetzt werden
    public setAnimationImages(moveDirection?:"left" | "right"):void {
        if(moveDirection=="left") {
            //movement left
            this.aktuelImgCount = this.runImgCount;
            this.aktuelUrl = this.runUrlBase;
            this.left = true;
        } else if (moveDirection=="right") {
            //movement right
            this.aktuelImgCount = this.runImgCount;
            this.aktuelUrl = this.runUrlBase;
            this.left = false;
        } else if (this.playerStatus == Status.JumpingLeft) {
            //jump to the Left
            this.aktuelImgCount = this.jumpImgCount;
            this.aktuelUrl = this.jumpUrlBase;
            this.left = true;
        } else if (this.playerStatus == Status.JumpingRight) {
            //jump to the right
            this.aktuelImgCount = this.jumpImgCount;
            this.aktuelUrl = this.jumpUrlBase;
            this.left = false;
        } else if (this.playerStatus == Status.Dead) {
            //sterbe Animation
            this.aktuelImgCount = this.deadImgCount;
            this.aktuelUrl = this.deadUrlBase;
            this.left = false;
        } else {
            //Idle
            this.aktuelImgCount = this.idleImgCount;
            this.aktuelUrl = this.idleUrlBase;
            this.left = false;
        }

    }

    // Abfrage nach dem gameStatus muss Außerhalb der Classe erfolgen.
    // Bewegungsrichtung ebenfalls 
    private animatemovement(): void {
        
        //Bilder Ordner sind gesetzt in den variablen 

        //Frame rate der Animation wird in abhängigkeit des status gesetzt
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


        if (this.left) {
            this.sheet.src = this.aktuelUrl + this.aktuelImg.toString() + "left" + ".png"
        } else {
            this.sheet.src = this.aktuelUrl + this.aktuelImg.toString() + ".png"
        }

        if (this.playerStatus == Status.Dead) {
            this.canvasContext!.drawImage(this.sheet,
                0, 0, 601, 502,
                this.position.x, this.position.y, 80, 75);
        } else {
            this.canvasContext!.drawImage(this.sheet,
                0, 0, 416, 454,
                this.position.x, this.position.y, 75, 75);
        }
    }
}