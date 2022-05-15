import { groundObstacle, plattforms } from "./index"
import { Flame, Portal, Spike } from "./obstacle"
import { GrassPlattform, IcePlattform } from "./plattforms"
import { setBackground, setEndOfMap } from "./worldSettings"

export let portal:Portal 

export function loadExampleMap(context: CanvasRenderingContext2D) {
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

portal = new Portal(4150, innerHeight - 445,context!)
groundObstacle.push(portal);



//IcePlatten sind nur 100Pixel Breit. Werden Hier zum Springen genutzt
plattforms.push(new IcePlattform(500, innerHeight - 350 ,context!))
plattforms.push(new IcePlattform(600, innerHeight - 350 ,context!))
setBackground("./img/background/forest0.jpg")
setEndOfMap(4500);
}