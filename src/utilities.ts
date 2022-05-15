import { groundObstacle, plattforms } from "./index";
import { Obstacle } from "./obstacle";
import { Plattform } from "./plattforms";
import { Player, Status } from "./player";
import { gravitiy, setGameStatus } from "./worldSettings";


//left = true; Hintergrund nach links verschieben. 
export function moveObjects(force: number): void {
    plattforms.forEach(function (item) {
        item.position.x -= force;
    });

    groundObstacle.forEach(function (item) {
        item.position.x -= force;
    });
    //HintergrundBild muss noch verschoben werden. Aber Async
}

export function checkIfDead(player:Player, canvas: HTMLCanvasElement): boolean {
    if (player.position.y + player.height >= canvas.height) {
        player.playerStatus = Status.Dead
        return true;
    } else {
        return false;
    }
}

export function gameOver(context: CanvasRenderingContext2D) {
    context!.fillStyle = "white";
    context!.font = '48px serif';
    context!.fillText('Game Over!!!', 200, 50);
    context!.font = '20px serif';
    context!.fillText('Willst es noch einmal Versuchen? y/n', 200, 75);
    setGameStatus("Game-Over");
}

export function checkAllCollision(player:Player,plattforms:Plattform[], canvas: HTMLCanvasElement): boolean {
    let standOnPlattform: boolean = false;
    let collisionPlattformHeight: number = player.position.y;

    //Überprüffung Kollision mit einer Plattform
    for (let element of plattforms) {
        if (element.standOnTop(player)) {
            //Falls durch die gravitation nicht direkt position auf der Plattform erreicht wird
            collisionPlattformHeight = element.position.y
            standOnPlattform = true;
            break;
        }
    }

    if (standOnPlattform) {
        player.playerStatus = Status.Normal;
        player.pysikForce.y = 0;
        player.position.y = collisionPlattformHeight - player.height;
    } else if (player.position.y + player.height < canvas.height) {
        player.pysikForce.y += gravitiy;

    } else {
        if (player.pysikForce.y > 0) {
            player.playerStatus = Status.Dead;
            player.pysikForce.y = 0;
        }
    }
    
    return standOnPlattform;
}

function checkForWin(player:Player, portal:Obstacle): void {
    if (player.position.x >= portal.position.x + 30) {

    }
}