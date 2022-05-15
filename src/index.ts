import { Player } from "./player"
import { Obstacle, updateAllObstacle } from "./obstacle"
import { Plattform, updateAllPlattforms } from "./plattforms"
import { gameStatus, leftViewBarrier, loadBackground, setGamesize, setGameStatus, setLeftBarrier, setRightBarrier } from "./worldSettings"
import { checkAllCollision, movementControl } from "./objectControl"
import { checkForWin, checkIfDead, gameOverText, gewonnenTextGame, pauseText, reset } from "./utilities"
import { introText, loadExampleMap, portal } from "./maps"
import { inputControlButtons } from "./inputControl"

let canvas: HTMLCanvasElement = document.getElementById("canvas-game") as HTMLCanvasElement
//Größe setzen. Kann später verändert werden. 
let context = canvas.getContext("2d")
let plattforms: Plattform[] = [] //Hier sind alle Plattformen drin. 
//die Obstacle dienen nur dem Styling. Haben keinen Effekt was Collision angeht. 
let groundObstacle: Obstacle[] = [] //Hier sind alle Plattformen drin.
//Spieler wird erstellt
const player: Player = new Player(context!, leftViewBarrier + 20)

//Animationsfunktion
function animate(): void {

    requestAnimationFrame(animate)

    if (inputControlButtons.pause.pressed) {
        setGameStatus("Pause")
    }

    switch (gameStatus) {
        case "Intro":
            context!.clearRect(0, 0, innerWidth, innerHeight)
            loadBackground(context!)
            introText(context!)
            break
        case "Game-Over":
            loadBackground(context!)
            updateAllPlattforms(plattforms)
            updateAllObstacle(groundObstacle)
            player.update()
            gameOverText(context!)
            if (inputControlButtons.yes.pressed) {
                reset(player, plattforms, groundObstacle)
                loadExampleMap(context!,plattforms, groundObstacle )
            }
            break
        case "Pause":
            pauseText(context!)
            if (inputControlButtons.yes.pressed) {
                setGameStatus("On-Going")
            }
            break
        case "Gewonnen":
            gewonnenTextGame(context!)
            if (inputControlButtons.yes.pressed) {
                reset(player, plattforms, groundObstacle)
                loadExampleMap(context!,plattforms, groundObstacle )
            }
            break
        case "On-Going":
            context!.clearRect(0, 0, innerWidth, innerHeight)
            //Hintergrund muss immer zuerst geladen werden. 
            loadBackground(context!)
            updateAllPlattforms(plattforms)
            updateAllObstacle(groundObstacle)
            player.update()
            movementControl(player,plattforms,groundObstacle)
            checkAllCollision(player, plattforms, canvas)

            if (checkIfDead(player, canvas)) {
                setGameStatus("Game-Over")
            }
            if(checkForWin(player,portal)) {
                setGameStatus("Gewonnen")
            }
            break

    }
}
loadExampleMap(context!,plattforms, groundObstacle )
setGamesize(canvas)
animate()
