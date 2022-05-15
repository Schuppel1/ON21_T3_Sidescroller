import { Obstacle } from "./obstacle"
import { Plattform } from "./plattforms"
import { Player, Status } from "./player"
import { endOfMap, gravitiy, resetWorld, setEndOfMap} from "./worldSettings"


//left = true Hintergrund nach links verschieben. 
export function moveObjects(force: number, plattforms:Plattform[],groundObstacle:Obstacle[]): void {
    plattforms.forEach(function (item) {
        item.position.x -= force
    })

    groundObstacle.forEach(function (item) {
        item.position.x -= force
    })

    setEndOfMap(endOfMap - force)
    //HintergrundBild muss noch verschoben werden. Aber Async
}

export function checkIfDead(player:Player, canvas: HTMLCanvasElement): boolean {
    if (player.position.y + player.height >= canvas.height) {
        player.playerStatus = Status.Dead
        return true
    } else {
        return false
    }
}



export function checkAllCollision(player:Player,plattforms:Plattform[], canvas: HTMLCanvasElement): boolean {
    let standOnPlattform: boolean = false
    let collisionPlattformHeight: number = player.position.y

    //Überprüffung Kollision mit einer Plattform
    for (let element of plattforms) {
        if (element.standOnTop(player)) {
            //Falls durch die gravitation nicht direkt position auf der Plattform erreicht wird
            collisionPlattformHeight = element.position.y
            standOnPlattform = true
            break
        }
    }

    if (standOnPlattform) {
        player.playerStatus = Status.Normal
        player.pysikForce.y = 0
        player.position.y = collisionPlattformHeight - player.height
    } else if (player.position.y + player.height < canvas.height) {
        player.pysikForce.y += gravitiy

    } else {
        if (player.pysikForce.y > 0) {
            player.playerStatus = Status.Dead
            player.pysikForce.y = 0
        }
    }
    
    return standOnPlattform
}

export function checkForWin(player:Player, portal:Obstacle): boolean {
    if (player.position.x >= portal.position.x + 30) {
        return true
    } else 
    return false
}

export function reset (player:Player,plattforms: Plattform[], obstacles: Obstacle[]  ) {

    player.reset()

    for (let element of plattforms) {
        element.reset()
    }

    for (let element of obstacles) {
        element.reset()
    }

    resetWorld()

}

export function gameOverText(context: CanvasRenderingContext2D) {
    writeTitle('Game Over!!!', context)
    writeText('Willst es noch einmal Versuchen? y/n', context)
}

export function pauseText(context: CanvasRenderingContext2D) {
    writeTitle("Spiel ist pausiert!", context)
    writeText('Willst du weiterspielen? Dann drucke "y"', context)
}

export function gewonnenTextGame(context: CanvasRenderingContext2D) {
    writeTitle("Das Portal scheint noch nicht fertig zu sein!", context)
    writeText('Ende der Demo. Willst du es nochmal spielen? "y"', context)
}

export function writeTitle(title:string, context: CanvasRenderingContext2D, yPosition? :number) {
    context!.lineWidth = 1;
    context!.fillStyle = "WhiteSmoke"
    context!.strokeStyle = "black"
    context!.font = '58px serif'
    context!.fillText(title, 200, yPosition? yPosition : 50 )
    context!.strokeText(title, 200, yPosition? yPosition : 50)
}

export function writeText(title:string, context: CanvasRenderingContext2D, yPosition? :number ) {
    context!.lineWidth = 1;
    context!.fillStyle = "WhiteSmoke"
    context!.strokeStyle = "black"
    context!.font = '40px serif'
    context!.fillText(title, 200, yPosition? yPosition : 100 )
    context!.strokeText(title, 200, yPosition? yPosition : 100)
}
