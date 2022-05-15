import { Flame, Obstacle, Portal, Spike } from "./obstacle"
import { GrassPlattform, IcePlattform, Plattform } from "./plattforms"
import { writeText, writeTitle } from "./utilities"
import { setBackground, setEndOfMap, setGameStatus} from "./worldSettings"

export let portal: Portal

export function loadExampleMap(context: CanvasRenderingContext2D, plattforms: Plattform[], groundObstacle:Obstacle[] ) {
    plattforms.push(new GrassPlattform(0, innerHeight - 150, context!))
    plattforms.push(new GrassPlattform(500, innerHeight - 150, context!))
    groundObstacle.push(new Flame(1000, innerHeight - 160, context!))
    plattforms.push(new GrassPlattform(1100, innerHeight - 150, context!))
    plattforms.push(new GrassPlattform(1600, innerHeight - 150, context!))
    plattforms.push(new GrassPlattform(2100, innerHeight - 150, context!))

    plattforms.push(new GrassPlattform(2600, innerHeight - 150, context!))
    plattforms.push(new GrassPlattform(3100, innerHeight - 150, context!))

    //Spikes sind 50Pixel Breit
    groundObstacle.push(new Spike(3600, innerHeight - 150, context!))
    groundObstacle.push(new Spike(3650, innerHeight - 150, context!))
    groundObstacle.push(new Spike(3700, innerHeight - 150, context!))
    groundObstacle.push(new Spike(3750, innerHeight - 150, context!))
    groundObstacle.push(new Spike(3800, innerHeight - 150, context!))
    groundObstacle.push(new Spike(3850, innerHeight - 150, context!))
    groundObstacle.push(new Spike(3900, innerHeight - 150, context!))
    groundObstacle.push(new Spike(3950, innerHeight - 150, context!))

    plattforms.push(new GrassPlattform(4000, innerHeight - 150, context!))

    portal = new Portal(4150, innerHeight - 445, context!)
    groundObstacle.push(portal)



    //IcePlatten sind nur 100Pixel Breit. Werden Hier zum Springen genutzt
    plattforms.push(new IcePlattform(1500, innerHeight - 350, context!))
    plattforms.push(new IcePlattform(1600, innerHeight - 350, context!))
    plattforms.push(new IcePlattform(1700, innerHeight - 350, context!))
    plattforms.push(new IcePlattform(2000, innerHeight - 550, context!))
    plattforms.push(new IcePlattform(2100, innerHeight - 550, context!))
    plattforms.push(new IcePlattform(2400, innerHeight - 750, context!))
    plattforms.push(new IcePlattform(2500, innerHeight - 750, context!))
    plattforms.push(new IcePlattform(3100, innerHeight - 350, context!))

    setBackground("./img/background/forest0.jpg")
    setEndOfMap(4450)

}

// 60 frames = 1s 
let secondsToNextline: number = 10
let actualFrame: number = 0
let lineNumber: number =  0
let introTextArray: string[] =[]
introTextArray.push("Im Rahmen der Abgabe habe ich mir ein Rahmenkonzeot überlegt für einen Sidescroller")
introTextArray.push('Die Spielfigur könnt ihr mit "a" nach links und mit "d" nach rechts bewegen.')
introTextArray.push('Zum springen die Leertaste benutzen.')
introTextArray.push('Eine Pause Funktion ist ebenfalls vorhanden.')
introTextArray.push('Dazu einfach die "p" taste drücken.')
introTextArray.push('Es sind noch keine Gegner vorhanden.')
introTextArray.push('Ebenso ist das Ziel noch nicht betrettbar!')
introTextArray.push('Viel Spaß beim spielen!')

export function introText(context: CanvasRenderingContext2D) {

    context.fillStyle = "rgba(50, 50, 50, 0.8)"
    context.fillRect(150, 50, 1500, 700 )

    if (actualFrame % (secondsToNextline * 60) == 0) {
        if (lineNumber < introTextArray.length-1) {
            lineNumber++
        } else {
            setGameStatus("On-Going")
        }
        actualFrame=1
    }
    for (let i = 0; i<= lineNumber; i++) {
        writeTitle("Willkommen bei meinem Game Konzept",context,100)
        writeText(introTextArray[i], context, 150+i*75)
    }
    
    actualFrame++
} 