import { Player } from "./player";
import { moveObjects } from "./utilities";
import { background, getGameStatus, leftBarrier, rightBarrier } from "./worldSettings";

// Dieses Modul repäsentiert die Spielersteuerung und all seinen Functionen.
export let playerControlButtons = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    jump: {
        pressed: false
    },
    yes: {
        pressed: false
    },
    pause: {
        pressed: false
    }
}

//steuerung einmal taste wird gedrückt
addEventListener('keydown', (event: KeyboardEvent) => {
    switch (event.key) {
        case "a":
            // player.moveleft();
            playerControlButtons.left.pressed = true;
            break;
        case "d":
            // player.moveright();
            playerControlButtons.right.pressed = true;
            break;
        case " ":
            // player.jump();
            playerControlButtons.jump.pressed = true;
            break;
        case "y":
            playerControlButtons.yes.pressed = true;
            break;
        case "p":
            playerControlButtons.pause.pressed = true;
            break;
        default:
            break;
    }
});

//steuerung taste wird losgelassen
addEventListener('keyup', (event: KeyboardEvent) => {
    switch (event.key) {
        case "a":
            // player.moveleft();
            playerControlButtons.left.pressed = false;
            break;
        case "d":
            // player.moveright();
            playerControlButtons.right.pressed = false;
            break;
        case " ":
            // player.jump();
            playerControlButtons.jump.pressed = false;
            break;
        case "y":
            playerControlButtons.yes.pressed = false;
            break;
        case "p":
            playerControlButtons.pause.pressed = false;
            break;
        default:
            break;
    }
});

export function playerMovementControl(player: Player): void {
    let xSpeed = 2;
    if (getGameStatus() == "On-Going") {
        if (playerControlButtons.left.pressed) {
            if (player.position.x - xSpeed < leftBarrier) {
                if (background.deltaX != 0) {
                    background.deltaX -= 0.5;
                    moveObjects(-xSpeed);
                }
                player.moveHorizontal(0);

            } else {
                player.moveHorizontal(-xSpeed);
            }
        } else if (playerControlButtons.right.pressed) {
            if (player.position.x + player.width + xSpeed > rightBarrier) {
                moveObjects(xSpeed);
                player.moveHorizontal(0);
                if (background.deltaX != 720) {
                    background.deltaX += 0.5;
                }

            } else {
                player.moveHorizontal(xSpeed);
            }

        }
        else {
            player.moveHorizontal(0);
        }

        if (playerControlButtons.jump.pressed) {
            player.jump();
        }
    } else {
        player.moveHorizontal(0);
    }

}