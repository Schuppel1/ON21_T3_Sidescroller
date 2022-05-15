//Dieses Modul überwacht die eingaben des Spielers
export let inputControlButtons = {
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
            inputControlButtons.left.pressed = true
            break
        case "d":
            inputControlButtons.right.pressed = true
            break
        case " ":
            inputControlButtons.jump.pressed = true
            break
        case "y":
            inputControlButtons.yes.pressed = true
            break
        case "p":
            inputControlButtons.pause.pressed = true
            break
        default:
            break
    }
})

//steuerung taste wird losgelassen
addEventListener('keyup', (event: KeyboardEvent) => {
    switch (event.key) {
        case "a":
            inputControlButtons.left.pressed = false
            break
        case "d":
            inputControlButtons.right.pressed = false
            break
        case " ":
            inputControlButtons.jump.pressed = false
            break
        case "y":
            inputControlButtons.yes.pressed = false
            break
        case "p":
            inputControlButtons.pause.pressed = false
            break
        default:
            break
    }
})