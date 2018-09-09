const WINDOW_WIDTH = 1024
const WINDOW_HEIGHT = 768
const RADIUS = 8
const MARGIN_TOP =  60
const MARGIN_LEFT = 30

const endTime = new Date(Date.now() + 100000000)
let SECONDS = 0

window.onload = function () {
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')

    canvas.width = WINDOW_WIDTH
    canvas.height = WINDOW_HEIGHT

    SECONDS = getSeconds()
    render(ctx)
    animate(ctx)
}

function getSeconds() {
    let curTime = new Date()
    return Math.round((endTime.getTime() - curTime.getTime())/1000)
}

function animate(ctx) {
    render(ctx)
    update()
    requestAnimationFrame(animate.bind(null, ctx))
}

function update() {
    SECONDS = getSeconds()
}

function render (ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    let hour = ~~(SECONDS/3600)
    let minutes = ~~((SECONDS - hour * 3600)/ 60)
    let seconds = SECONDS % 60

    renderDigit(MARGIN_LEFT, MARGIN_TOP, ~~(hour/10), ctx)
    renderDigit(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, hour%10, ctx)

    renderDigit(MARGIN_LEFT + 30*(RADIUS+1), MARGIN_TOP, 10, ctx)


    renderDigit(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, ~~(minutes/10), ctx)
    renderDigit(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, minutes%10, ctx)

    renderDigit(MARGIN_LEFT + 69*(RADIUS+1), MARGIN_TOP, 10, ctx)

    renderDigit(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, ~~(seconds/10), ctx)
    renderDigit(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, seconds%10, ctx)
}

function renderDigit (x, y, num, ctx) {
    ctx.fillStyle= 'rgb(0, 102, 153)';
    
    for (let i = 0; i < digit[num].length; i++) {
        for (let j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                ctx.beginPath()
                ctx.arc( x + j*2*(RADIUS + 1)+(RADIUS + 1), y + i*2*(RADIUS + 1)+(RADIUS + 1), RADIUS, 0, 2*Math.PI)
                ctx.closePath()

                ctx.fill()
            }
        }
    }

}
