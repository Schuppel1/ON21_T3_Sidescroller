import { Player} from "./player";
import { Flame, Obstacle, Portal, Spike, updateAllObstacle } from "./obstacle";
import { GrassPlattform, IcePlattform, Plattform, updateAllPlattforms } from "./plattforms";
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

//grassplattform ist immer 500 pixelbreit
plattforms.push(new GrassPlattform(0, innerHeight - 150, context!))
plattforms.push(new GrassPlattform(500, innerHeight - 150, context!))
groundObstacle.push(new Flame(1000, innerHeight - 160,context!))
plattforms.push(new GrassPlattform(1100, innerHeight - 150, context!))
plattforms.push(new GrassPlattform(1600, innerHeight - 150, context!))
plattforms.push(new GrassPlattform(2100, innerHeight - 150, context!))

plattforms.push(new GrassPlattform(2600, innerHeight - 150, context!))
plattforms.push(new GrassPlattform(3100, innerHeight - 150, context!))

//Spikes sind 50Pixel Breit
groundObstacle.push(new Spike(3600, innerHeight - 150,context!));
groundObstacle.push(new Spike(3650, innerHeight - 150,context!));
groundObstacle.push(new Spike(3700, innerHeight - 150,context!));
groundObstacle.push(new Spike(3750, innerHeight - 150,context!));
groundObstacle.push(new Spike(3800, innerHeight - 150,context!));
groundObstacle.push(new Spike(3850, innerHeight - 150,context!));
groundObstacle.push(new Spike(3900, innerHeight - 150,context!));
groundObstacle.push(new Spike(3950, innerHeight - 150,context!));

plattforms.push(new GrassPlattform(4000, innerHeight - 150, context!))
groundObstacle.push(new Portal(4150, innerHeight - 445,context!));



//IcePlatten sind nur 100Pixel Breit. Werden Hier zum Springen genutzt
plattforms.push(new IcePlattform(500, innerHeight - 350 ,context!))
plattforms.push(new IcePlattform(600, innerHeight - 350 ,context!))




// groundObstacle.push(new Obstacle(1000, innerHeight - 140, 80, 80, "./img/assets/flame/fire", 256, 256, true, 13));
// groundObstacle.push(new Obstacle(3090, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
// groundObstacle.push(new Obstacle(3130, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
// groundObstacle.push(new Obstacle(3170, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
// groundObstacle.push(new Obstacle(3210, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
// groundObstacle.push(new Obstacle(3250, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
// groundObstacle.push(new Obstacle(3290, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
// groundObstacle.push(new Obstacle(3330, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
// groundObstacle.push(new Obstacle(3370, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));
// groundObstacle.push(new Obstacle(3410, innerHeight - 145, 40, 80, "./img/assets/spike.png", 139, 250));

// let portal: Obstacle = new Obstacle(4150, innerHeight - 445, 300, 300, "./img/assets/portal/portalleft.png", 1025, 1025)
// groundObstacle.push(portal);



function animate(): void {

    
    context!.clearRect(0, 0, innerWidth, innerHeight);
    requestAnimationFrame(animate)
    
    //Hintergrund muss immer zuerst geladen werden. Sonst wird alles verdeckt
    loadBackground(context!)


    updateAllPlattforms(plattforms)
    updateAllObstacle(groundObstacle)
    player.update()
    playerMovementControl(player)
    checkAllCollision(player, plattforms, canvas)
    

    // let deadTest:boolean=false;
    // playerMovementControl(player);


    // loadBackground(context!)
    // updateArray(plattforms)
    // updateArray(groundObstacle)
    // player.update()
    // checkAllCollision(player, plattforms, canvas)
    // deadTest=checkIfDead(player,canvas); 
    // if (deadTest) {
    //     setGameStatus("Game-Over")
    // }

    // switch (getGameStatus()) {
    //     case "Game-Over":
    //         if (playerControlButtons.yes.pressed) {
    //             player.position.y = 0
    //             setGameStatus("On-Going")
    //             player.playerStatus = Status.Normal;
    //         }
    //         break;
    //     case "Pause":
    //         if (playerControlButtons.pause.pressed) {
    //             setGameStatus("On-Going")
    //         }
    //         break;
    //     case "Gewonnen":
    //         if (playerControlButtons.yes.pressed) {
    //             player.position.y = 0
    //             setGameStatus("On-Going")
    //             player.playerStatus = Status.Normal;
    //         }
    //         break;
    //     case "On-Going":
    //         break;

    // }


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