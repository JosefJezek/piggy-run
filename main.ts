enum ActionKind {
    Walking,
    Idle,
    Jumping,
    Dead,
    Flying
}
namespace SpriteKind {
    export const Ground = SpriteKind.create()
    export const Cloud = SpriteKind.create()
}
function initGround () {
    ground1 = sprites.create(assets.image`ground 1`, SpriteKind.Ground)
    ground2 = sprites.create(assets.image`ground 2`, SpriteKind.Ground)
    ground1.setPosition(scene.screenWidth() / 2, 112)
    ground2.setPosition(ground1.x + scene.screenWidth(), 112)
    ground1.vx = -100
    ground2.vx = -100
    ground1.z = 2
    ground2.z = 2
}
function createPterodactyl () {
    pterodactyl = sprites.createProjectileFromSide(assets.image`pterodactyl 1`, ground1.vx, 0)
    pterodactyl.y = 70
    pterodactyl.z = 2
    animation.attachAnimation(pterodactyl, fly)
    animation.setAction(pterodactyl, ActionKind.Flying)
}
function initPiggy () {
    piggy = sprites.create(assets.image`piggy 1`, SpriteKind.Player)
    run = animation.createAnimation(ActionKind.Walking, 300)
    run.addAnimationFrame(assets.image`piggy 2`)
    run.addAnimationFrame(assets.image`piggy 3`)
    animation.attachAnimation(piggy, run)
    jump = animation.createAnimation(ActionKind.Jumping, 200)
    jump.addAnimationFrame(assets.image`piggy 4`)
    animation.attachAnimation(piggy, jump)
    dead = animation.createAnimation(ActionKind.Dead, 200)
    dead.addAnimationFrame(assets.image`piggy 5`)
    animation.attachAnimation(piggy, dead)
    piggy.z = 3
    piggy.setPosition(20, 98)
}
controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
    // Allow jump from 85px to resolve latency of button click in a web browser. The piggy is placed on 98px.
    if (piggy.y > 85 && end == 0) {
        piggy.vy = -160
        animation.setAction(piggy, ActionKind.Jumping)
        music.playTone(587, music.beat(BeatFraction.Quarter))
    }
})
// Send a data payload to the hosting iframe of the simulator.
// https://forum.makecode.com/t/extension-to-interact-with-the-web-in-exported-games/4262
function sendMessageToSimulator (action: string, data: string) {
    const json = {
        action: action,
        data: data
    }
const msg = JSON.stringify(json)
const buf = Buffer.fromUTF8(msg);
control.simmessages.send('web', buf)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
    end = 1
    timeSinceStart = game.runtime()
    animation.setAction(piggy, ActionKind.Dead)
    pause(50)
    if (info.score() >= 5000) {
        music.magicWand.play()
        game.setDialogCursor(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `)
        game.splash("Gratulujeme!", "Odznak je váš!")
    }
    game.setDialogCursor(assets.image`piggy 1`)
    sendMessageToSimulator("event", "gameOver-" + info.score() + "-" + timeSinceStart)
    game.over(false, effects.dissolve)
})
function initFlyAnimation () {
    fly = animation.createAnimation(ActionKind.Flying, 350)
    fly.addAnimationFrame(assets.image`pterodactyl 1`)
    fly.addAnimationFrame(assets.image`pterodactyl 2`)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy()
    music.playTone(262, music.beat(BeatFraction.Quarter))
    info.changeScoreBy(100)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Cloud, function (sprite, otherSprite) {
    otherSprite.say("+200")
    otherSprite.destroy(effects.confetti, 200)
    music.jumpUp.play()
    info.changeScoreBy(200)
})
let cloud: Sprite = null
let bonus: Sprite = null
let obstacle: Sprite = null
let choice = 0
let timeSinceStart = 0
let dead: animation.Animation = null
let jump: animation.Animation = null
let run: animation.Animation = null
let fly: animation.Animation = null
let pterodactyl: Sprite = null
let ground2: Sprite = null
let ground1: Sprite = null
let piggy: Sprite = null
let end = 0
game.setDialogCursor(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `)
scene.setBackgroundColor(1)
initGround()
initPiggy()
initFlyAnimation()
info.setScore(0)
let counter = 0
end = 0
let difficulty = 3
piggy.say("3-2-1!")
game.showLongText("Hrajte mezerníkem nebo tlačítkem A, zkuste získat odznak :)", DialogLayout.Top)
piggy.say("RUN!", 2000)
game.onUpdate(function () {
    if (piggy.y < 98) {
        piggy.ay = 400
    } else {
        piggy.ay = 0
        piggy.y = 98
        if (end == 0) {
            animation.setAction(piggy, ActionKind.Walking)
        }
    }
})
game.onUpdateInterval(50, function () {
    if (end == 1) {
        return
    }
    info.changeScoreBy(1)
    counter += 1
    if (counter == 300) {
        music.pewPew.play()
        piggy.say("SUPER!", 5000)
    } else if (counter == 1100) {
        music.pewPew.play()
        piggy.say("COOL!", 5000)
    } else if (counter == 2100) {
        music.pewPew.play()
        piggy.say("WOW!", 5000)
    }
    if (counter % 500 == 0) {
        scene.setBackgroundColor(15)
    }
    if (counter % 1000 == 0) {
        scene.setBackgroundColor(1)
    }
    if (counter % 1000 == 0) {
        if (counter / 1000 % 2 == 0) {
            difficulty = difficulty - 1
        } else {
            difficulty = difficulty + 1
        }
    }
    if (ground1.x < -1 * (scene.screenWidth() / 2)) {
        ground1.x = ground2.x + scene.screenWidth()
    }
    if (ground2.x < -1 * (scene.screenWidth() / 2)) {
        ground2.x = ground1.x + scene.screenWidth()
    }
})
game.onUpdateInterval(1000, function () {
    choice = randint(0, difficulty)
    // console.logValue("difficulty", difficulty)
    // console.logValue("choice", choice)
    if (choice == 0) {
        obstacle = sprites.createProjectileFromSide(assets.image`tree`, ground1.vx, 0)
        obstacle.y = 100
        obstacle.z = 3
    } else if (choice == 1) {
        obstacle = sprites.createProjectileFromSide(assets.image`mushrooms`, ground1.vx, 0)
        obstacle.y = 104
        obstacle.z = 3
    } else if (choice == 2) {
        obstacle = sprites.createProjectileFromSide(assets.image`snake`, ground1.vx, 0)
        obstacle.y = 94
        obstacle.z = 3
    } else if (choice == 3) {
        bonus = sprites.createProjectileFromSide(assets.image`apple`, ground1.vx, 0)
        bonus.setKind(SpriteKind.Food)
        bonus.y = 104
        bonus.z = 2
        bonus.say("+100")
    } else if (choice == 4) {
        createPterodactyl()
    }
    ground1.vx += -1
    ground2.vx += -1
})
game.onUpdateInterval(1500, function () {
    if (Math.percentChance(40)) {
        cloud = sprites.createProjectileFromSide(assets.image`cloud`, ground1.vx / 4, 0)
        cloud.y = randint(20, 60)
        cloud.setKind(SpriteKind.Cloud)
        cloud.z = 1
    }
})
