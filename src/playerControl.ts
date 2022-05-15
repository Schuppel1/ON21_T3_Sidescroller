import { inputControlButtons } from "./inputControl"
import { Obstacle } from "./obstacle"
import { Plattform } from "./plattforms"
import { Player } from "./player"
import { moveObjects } from "./utilities"
import { background, endOfMap, gameStatus, leftBarrier, rightBarrier } from "./worldSettings"

// Dieses Modul repäsentiert die Spielersteuerung und all seinen Functionen.


export function playerMovementControl(player: Player, plattforms: Plattform[], obstacles: Obstacle[]): void {
    let xSpeed = 2
    if (gameStatus == "On-Going") {
        if (inputControlButtons.left.pressed) {
            if (player.position.x - xSpeed < leftBarrier) {
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
            } else if (player.position.x + player.width + xSpeed > rightBarrier) {
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