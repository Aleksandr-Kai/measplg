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


function MeasPlg(containerSelecor,style_width='500px') {
    var me = this;
    this.baseSize = 1;
    this.k = 1;
    this.plgContainer = document.getElementById(containerSelecor);
    if(this.plgContainer) {
        this.plgContainer.innerHTML += `
        <div class="open">
            <span>Image URL: </span>
            <input type="text" name="" id="imgURL">
            <button id="imgLoad">Load image</button>
        </div>
        <div class="size">
            <span>Base size: </span>
            <input id="base_size" type="text" value="1">
            <button id="setSize">Define</button>
            <span id="base"></span>
        </div>
        <div class="text"><p id="res">Define base size</p></div>
        <canvas id="meas"></canvas>
        <style>
        #meas_plg {
            padding: 3%;
            width: ${style_width};
            border: 1px black solid;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          #meas_plg #meas {
            border: 1px black solid;
            width: 100%;
            cursor: crosshair;
          }
          #meas_plg #base_size {
            width: 50px;
          }
          #meas_plg #base {
            margin-left: 20px;
          }
          #meas_plg .text {
            width: 100%;
            border: 1px black solid;
          }
          #meas_plg .text p {
            text-align: center;
          }
          #meas_plg .open input {
            width: 63%;
          }
        </style>
        <!link rel="stylesheet" type="text/css" href="prepare.css">`;
    }

    this.canvas = document.getElementById('meas');
    this.res = document.getElementById('res');
    this.inp = document.getElementById('base_size');
    this.baseTxt = document.getElementById('base');
    this.btn = document.getElementById('setSize');
    this.ctx = this.canvas.getContext('2d');
    this.line = new Line(me.ctx);
    this.img = new Image;
    this.img.onload = () => {
        let k = me.img.height/me.img.width;
        me.canvas.width = me.canvas.offsetWidth;
        me.canvas.height = me.canvas.offsetWidth*k;
        me.ctx.drawImage(me.img, 0, 0, me.canvas.width, me.canvas.height);
    };

    this.SetImage = (imgPath) => {
        me.img.src = imgPath;
    }

    this.btn.addEventListener('click', (e)=>{
        me.baseSize = +me.inp.value;
        me.line.x1 = NaN;
        me.line.y1 = NaN;
        me.line.x2 = NaN;
        me.line.y2 = NaN;
        me.k = 1;
        me.res.textContent = 'Click first point';
    })

    me.canvas.onmousemove = (e) => {
        if (me.line.x1 && me.line.y1) {
            var r = me.canvas.getBoundingClientRect()
            me.ctx.drawImage(me.img, 0, 0, me.canvas.width, me.canvas.height);
            me.line.x2 = e.clientX-r.left;
            me.line.y2 = e.clientY-r.top;
            me.line.draw();
        }
    };

    this.canvas.addEventListener('click', (e) => {
        if (!me.line.x1 || !me.line.y1) {
            var r = me.canvas.getBoundingClientRect();
            me.line.x1 = e.clientX-r.left;
            me.line.y1 = e.clientY-r.top;
            if (me.k === 1) me.res.textContent = 'Click second point';
        }else {
            var r = me.canvas.getBoundingClientRect();
            me.line.x2 = e.clientX-r.left;
            me.line.y2 = e.clientY-r.top;
            let l = Math.sqrt((me.line.x2-me.line.x1)**2 + (me.line.y2-me.line.y1)**2);
            if (me.k === 1) {
                me.k = me.baseSize/l;
                me.res.textContent = `${me.baseSize} = ${Math.floor(l)}px`;
                me.baseTxt.textContent = `1 = ${Math.floor(l/me.baseSize)}px`;
            }else {
                let res = l * me.k;
                me.res.textContent = (res > 100)?Math.floor(res):res.toFixed(2);
            }
            me.line.x1 = NaN;
            me.line.y1 = NaN;
            me.line.x2 = NaN;
            me.line.y2 = NaN;
            me.ctx.drawImage(me.img, 0, 0, me.canvas.width, me.canvas.height);
        }
    });

    this.inpImgUrl = document.getElementById('imgURL');
    document.getElementById('imgLoad').addEventListener('click', () => {
        this.img.src = this.inpImgUrl.value;
    })
}

window.addEventListener('load', ()=>{
    const plg = new MeasPlg('meas_plg');
    // plg.SetImage('./img/1.jpg');
});