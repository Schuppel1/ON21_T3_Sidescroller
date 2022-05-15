import { inputControlButtons } from "./inputControl"
import { Obstacle } from "./obstacle"
import { Plattform } from "./plattforms"
import { Player, Status } from "./player"
import { background, endOfMap, gameStatus, gravitiy, leftViewBarrier, rightViewBarrier, setEndOfMap } from "./worldSettings"

// Dieses Modul repäsentiert die Spielersteuerung und all seinen Functionen.

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


function moveObjects(force: number, plattforms:Plattform[],groundObstacle:Obstacle[]): void {
    plattforms.forEach(function (item) {
        item.position.x -= force
    })

    groundObstacle.forEach(function (item) {
        item.position.x -= force
    })

    setEndOfMap(endOfMap - force)
    //HintergrundBild muss noch verschoben werden. Aber Async
}


export function movementControl(player: Player, plattforms: Plattform[], obstacles: Obstacle[]): void {
    let xSpeed = 2
    if (gameStatus == "On-Going") {
        if (inputControlButtons.left.pressed) {
            if (player.position.x - xSpeed < leftViewBarrier) {
                if (background.deltaX != 0) {
                    background.deltaX -= 0.5
                    moveObjects(-xSpeed, plattforms, obstacles)
                }
                player.moveHorizontal(0)

            } else {
                player.moveHorizontal(-xSpeed)
            }
        } else if (inputControlButtons.right.pressed) {
            if (player.position.x + player.width + xSpeed > endOfMap) {
                player.moveHorizontal(0);
            } else if (player.position.x + player.width + xSpeed > rightViewBarrier) {
                console.log(endOfMap);
                
                if (endOfMap <= window.innerWidth - 10) {
                    player.moveHorizontal(xSpeed)
                } else {
                    moveObjects(xSpeed, plattforms, obstacles)
                    player.moveHorizontal(0)
                    if (background.deltaX != 720) {
                        background.deltaX += 0.5
                    }
                }
            } else {
                player.moveHorizontal(xSpeed)
            }

        }
        else {
            player.moveHorizontal(0)
        }

        if (inputControlButtons.jump.pressed) {
            player.jump()
        }
    } else {
        player.moveHorizontal(0)
    }

}