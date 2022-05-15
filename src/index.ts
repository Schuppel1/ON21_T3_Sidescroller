import { Player, Status } from "./player";
import { Obstacle } from "./obstacle";
import { Plattform } from "./plattforms";
import { getGameStatus, leftBarrier, loadBackground, rightBarrier, setGamesize, setGameStatus, setLeftBarrier, setRightBarrier } from "./worldSettings";
import { playerControlButtons, playerMovementControl } from "./playerControl";
import { checkAllCollision, checkIfDead } from "./utilities";

let canvas: HTMLCanvasElement = document.getElementById("canvas-game") as HTMLCanvasElement
//Größe setzen. Kann später verändert werden. 
let context = canvas.getContext("2d");
export let plattforms: Plattform[] = []; //Hier sind alle Plattformen drin. 
//die Obstacle dienen nur dem Styling. Haben keinen Effekt was Collision angeht. 
export let groundObstacle: Obstacle[] = []; //Hier sind alle Plattformen drin.


window.addEventListener("resize", function () {
    setGamesize(canvas)
    setRightBarrier( 4 * innerWidth / 5)
    setLeftBarrier(innerWidth / 5)
});

const player: Player = new Player(context!, leftBarrier+20)


plattforms.push(new Plattform(0, innerHeight - 150, 1000, 100, "./img/grass100x100.png", 100, 100));
plattforms.push(new Plattform(1080, innerHeight - 150, 1000, 100, "./img/grass100x100.png", 100, 100));
plattforms.push(new Plattform(2080, innerHeight - 150, 1000, 100, "./img/grass100x100.png", 100, 100));
plattforms.push(new Plattform(3450, innerHeight - 150, 1000, 100, "./img/grass100x100.png", 100, 100));

groundObstacle.push(new Obstacle(1000, innerHeight - 140, 80, 80, "./img/assets/flame/fire", 256, 256, true, 13));
groundObstacle.push(new Obstacle(3090, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3130, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3170, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3210, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3250, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3290, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3330, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3370, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
groundObstacle.push(new Obstacle(3410, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));

let portal: Obstacle = new Obstacle(4150, innerHeight - 445, 300, 300, "./img/assets/portal/portalleft.png", 1025, 1025)
groundObstacle.push(portal);







function updateArray(myarray: Obstacle[] | Plattform[]): void {
    myarray.forEach((element: Obstacle | Plattform) => {
        element.update();
    });
}

function checkForWin(): void {
    if (player.position.x >= portal.position.x + 30) {

    }
}

function animate(): void {

    let deadTest:boolean=false;
    context!.clearRect(0, 0, innerWidth, innerHeight);
    requestAnimationFrame(animate)

    playerMovementControl(player);


    loadBackground(context!)
    updateArray(plattforms)
    updateArray(groundObstacle)
    player.update()
    checkAllCollision(player, plattforms, canvas)
    deadTest=checkIfDead(player,canvas); 
    if (deadTest) {
        setGameStatus("Game-Over")
    }

    switch (getGameStatus()) {
        case "Game-Over":
            if (playerControlButtons.yes.pressed) {
                player.position.y = 0
                setGameStatus("On-Going")
                player.playerStatus = Status.Normal;
            }
            break;
        case "Pause":
            if (playerControlButtons.pause.pressed) {
                setGameStatus("On-Going")
            }
            break;
        case "Gewonnen":
            if (playerControlButtons.yes.pressed) {
                player.position.y = 0
                setGameStatus("On-Going")
                player.playerStatus = Status.Normal;
            }
            break;
        case "On-Going":
            break;

    }
    // if (gameOverStatus) {
    //     if (playerControlButtons.yes.pressed) {
    //         player.position.y = 0
    //         gameOverStatus = false;
    //         player.playerStatus = Status.Normal;
    //     }
    // }

}
setGamesize(canvas);
animate();