let canvas,ctx,line,img,p,init,res,btn,inp
let baseSize = 1

window.addEventListener('load', ()=>{
    const plg = document.getElementById('meas_plg')
    if (plg) {
        plg.innerHTML = `<canvas id="meas"></canvas>
        <input id="base_size" type="text" value="1">
        <button id="setSize">Set base size</button>
        <p id="res"></p><link rel="stylesheet" type="text/css" href="prepare.css">`

    }

    canvas = document.getElementById('meas')
    p = document.getElementById('pos')
    res = document.getElementById('res')
    inp = document.getElementById('base_size')
    btn = document.getElementById('setSize')
    ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'white'
    canvas.addEventListener('click', setPoint)

    line = new Line(ctx)
    img = new Image
    img.onload = start;
    img.src = './img/52.jpg';

    btn.addEventListener('click', (e)=>{
        baseSize = +inp.value
        line.x1 = NaN
        line.y1 = NaN
        line.x2 = NaN
        line.y2 = NaN
        init = NaN
    })
})

const setPoint = (e) => {
    if (!line.x1 || !line.y1) {
        var r = canvas.getBoundingClientRect()
        line.x1 = e.clientX-r.left
        line.y1 = e.clientY-r.top
        console.log(x1,y1)
    }else {
        var r = canvas.getBoundingClientRect()
        line.x2 = e.clientX-r.left
        line.y2 = e.clientY-r.top
        let l = Math.sqrt((line.x2-line.x1)**2 + (line.y2-line.y1)**2)
        if (!init) init = l
        else res.textContent = l / (init/baseSize)
        line.x1 = NaN
        line.y1 = NaN
        line.x2 = NaN
        line.y2 = NaN
    }
}

function Line(ctx) {
    var me = this;
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.draw = function() {
        ctx.beginPath();
        ctx.moveTo(me.x1, me.y1);
        ctx.lineTo(me.x2, me.y2);
        ctx.stroke();
    }
}

function start() {
    let k = img.height/img.width
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetWidth*k
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.onmousemove = updateLine;
}

function updateLine(e) {
    if (line.x1 && line.y1) {
        var r = canvas.getBoundingClientRect()
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        line.x2 = e.clientX-r.left;
        line.y2 = e.clientY-r.top;
        line.draw();
    }
}