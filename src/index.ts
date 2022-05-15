import { Player } from "./player";
import { Obstacle, updateAllObstacle } from "./obstacle";
import { Plattform, updateAllPlattforms } from "./plattforms";
import { gameStatus, leftBarrier, loadBackground, setGamesize, setGameStatus, setLeftBarrier, setRightBarrier } from "./worldSettings";
import { playerControlButtons, playerMovementControl } from "./playerControl";
import { checkAllCollision, checkForWin, checkIfDead, gameOverText, gewonnenTextGame, pauseText, reset } from "./utilities";
import { loadExampleMap, portal } from "./maps";

let canvas: HTMLCanvasElement = document.getElementById("canvas-game") as HTMLCanvasElement
//Größe setzen. Kann später verändert werden. 
let context = canvas.getContext("2d");
export let plattforms: Plattform[] = []; //Hier sind alle Plattformen drin. 
//die Obstacle dienen nur dem Styling. Haben keinen Effekt was Collision angeht. 
export let groundObstacle: Obstacle[] = []; //Hier sind alle Plattformen drin.

window.addEventListener("resize", function () {
    setGamesize(canvas)
    setRightBarrier(4 * innerWidth / 5)
    setLeftBarrier(innerWidth / 5)
});

const player: Player = new Player(context!, leftBarrier + 20)

loadExampleMap(context!)

function animate(): void {

    requestAnimationFrame(animate)

    if (playerControlButtons.pause.pressed) {
        setGameStatus("Pause")
    }

    switch (gameStatus) {
        case "Game-Over":
            loadBackground(context!)
            updateAllPlattforms(plattforms)
            updateAllObstacle(groundObstacle)
            player.update()
            gameOverText(context!)
            if (playerControlButtons.yes.pressed) {
                reset(player, plattforms, groundObstacle)
            }
            break;
        case "Pause":
            pauseText(context!)
            if (playerControlButtons.yes.pressed) {
                setGameStatus("On-Going")
            }
            break;
        case "Gewonnen":
            gewonnenTextGame(context!)
            if (playerControlButtons.yes.pressed) {
                reset(player, plattforms, groundObstacle)
            }
            break;
        case "On-Going":
            context!.clearRect(0, 0, innerWidth, innerHeight);
            //Hintergrund muss immer zuerst geladen werden. 
            loadBackground(context!)


            updateAllPlattforms(plattforms)
            updateAllObstacle(groundObstacle)
            player.update()
            playerMovementControl(player)
            checkAllCollision(player, plattforms, canvas)
            let deadTest = checkIfDead(player, canvas);
            if (deadTest) {
                setGameStatus("Game-Over")
            }
            if(checkForWin(player,portal)) {
                setGameStatus("Gewonnen")
            }
            break;

    }
}
setGamesize(canvas);
animate();