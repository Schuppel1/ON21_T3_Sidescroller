let gameStatus: "Gewonnen" | "Game-Over" | "Pause" | "On-Going" | "Dialog"


export function getGameStatus(): "Gewonnen" | "Game-Over" | "Pause" | "On-Going" | "Dialog" {
    return gameStatus;
}

export function setGameStatus(gameStatusGlobal:"Gewonnen" | "Game-Over" | "Pause" | "On-Going" | "Dialog") {
    gameStatus = gameStatusGlobal;
}

