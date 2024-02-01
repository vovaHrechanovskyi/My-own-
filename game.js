function setup(){
    createCanvas(400, 400)
}


function draw(){
    background('skyblue')
    for(let balloon of Game.balloons){
        balloon.draw()
        balloon.move(Game.score)
    

        if(balloon.y <= balloon.size / 2 && balloon.color != 'black'){
            noLoop()
            clearInterval(interval)
            Game.balloons.splice(0)
            background(136, 220, 166)
            let finalScore = Game.score
            Game.score = ''
            fill('white')
            textAlign(CENTER, CENTER)
            textSize(60)
            text('FINISH', 200, 200)
            textSize(40)
            text('Score:' + finalScore, 200, 300)
        }
    }
    if(frameCount % 50 == 0){
        Game.addCommonBalloon()
    }
    if(frameCount % 100 == 0){
        Game.addUniqueBalloon()
    }
    if(frameCount % 120 == 0){
        Game.addAngryBalloon()
    }

    textSize(32)
    fill('black')
    text(Game.score, 20, 40)
}

function mousePressed(){
    if(!isLooping()){
        loop()
        Game.score = 0
        interval = setInterval(() => {
            sendStats()
        }, 2000)
    }
    Game.checkIfBalloonBurst()
    Game.countOfMouseClick += 1
}

function sendStats() {
    let stats = {
        countOfBlue: Game.countOfBlue,
        countOfGreen: Game.countOfGreen,
        countOfBlack: Game.countOfBlack,
        countOfMouseClick: Game.countOfMouseClick,
    }

    fetch('/statistic', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(stats)
})
}

let interval = setInterval(() => {
    sendStats()
}, 2000)

class Game{
    static balloons = []
    static score = 0
    static countOfBlue = 0
    static countOfGreen = 0
    static countOfBlack = 0
    static countOfMouseClick = 0

    static addCommonBalloon(){
        let balloon = new CommonBalloon(50, 'blue')
        this.balloons.push(balloon)
    }
    static addUniqueBalloon(){
        let balloon = new UniqueBalloon(35, 'green')
        this.balloons.push(balloon)
    }
    static addAngryBalloon(){
        let balloon = new AngryBalloon(50, 'black')
        this.balloons.push(balloon)
    }

    static checkIfBalloonBurst(){
        Game.balloons.forEach((balloon, index)=>{
            let distance = dist(balloon.x, balloon.y, mouseX, mouseY)
            if (distance <= balloon.size / 2){
                balloon.burst(index)
            }
        })
    }
    
}

class CommonBalloon{
    constructor(size, color){
        this.x = random(width)
        this.y = height
        this.size = size
        this.color = color

    }
    draw(){
        fill(this.color)
        ellipse(this.x, this.y, this.size)
        line(this.x, this.y + this.size / 2, this.x, this.y + this.size * 2)
    }

    move(score){
        if(score < 100){
            this.y -= 1
        } else if(score >= 100 && score < 200){
            this.y -= 1.5
        }else{
            this.y -= 2
        }
    }
    burst(index){
        Game.balloons.splice(index, 1)
        Game.score += 1
        Game.countOfBlue += 1
    }
}

class UniqueBalloon extends CommonBalloon{
    constructor(size, color){
        super(size, color)
    }
    burst(index){
        Game.balloons.splice(index, 1)
        Game.score += 10
        Game.countOfGreen += 1
    }
}

class AngryBalloon extends CommonBalloon{
    constructor(size, color){
        super(size, color)
    }
    burst(index){
        Game.balloons.splice(index, 1)
        Game.score -= 10
        Game.countOfBlack += 1
    }
}


