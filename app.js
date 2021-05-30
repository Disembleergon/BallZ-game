// ----- service worker ------
if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./serviceworker.js")
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// ---- canvas resize logic -----

const player = {
    "x": window.innerWidth/2,
    "y":window.innerHeight/2,
    "radius": (window.innerHeight + window.innerWidth) / 100,
    "color":"antiquewhite"
}

const resizeCanvas = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    player.x = canvas.width/2;
    player.y = canvas.height/2;
}

window.addEventListener("resize", () => {
    resizeCanvas();
})

resizeCanvas();

// ------ game ------
const BG = "rgba(0, 0, 0, 0.1)"
const enemyColors = [
    "#036bfc",
    "#87D4C8",
    "#571bfa",
    "#0af7ff",
    "#3300ff"
];

var bullets = [];
var enemies = [];
var particles = [];
var score = 0;

function addEnemy(){

    let rad = (window.innerHeight + window.innerWidth) / 50;
    let x;
    let y;

    if(Math.random() < 0.5){
        x = Math.random() < 0.5 ? (0 - rad) : (canvas.width + rad);
        y = Math.random() * canvas.height;
    }else{
        y = Math.random() < 0.5 ? (0-rad) : (canvas.height + rad);
        x = Math.random() * canvas.width;
    }

    let angle = Math.atan2(player.y - y, player.x - x);
    let dx = Math.cos(angle);
    let dy = Math.sin(angle);

    const enemy = {
        "x": x,
        "y": y,
        "radius": rad,
        "deltaX":dx * 1.55,
        "deltaY":dy * 1.55,
        "color": enemyColors[Math.round(Math.random() * (enemyColors.length - 1))]
    }

    enemies.push(enemy);
}

setInterval(addEnemy, 700);

function update(){
    
    requestAnimationFrame(update);

    // remove bullets out of sight
    bullets = bullets.filter((b) => {
        return b.x + b.radius > 0 && b.x - b.radius < canvas.width && b.y - b.radius > 0 && b.y + b.radius < canvas.height;
    })

    particles = particles.filter((p) => {
        return p.color.a > 0;
    })

    // ------- draw and game-logic ---------

    // clear
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    bullets.forEach(b => {
        ctx.beginPath();
        ctx.fillStyle = b.color;
        ctx.arc(b.x += b.deltaX, b.y += b.deltaY, b.radius, 0, Math.PI*2);
        ctx.fill();
    })

    enemies.forEach((enemy, eIndex) => {
        ctx.beginPath();
        ctx.fillStyle = enemy.color;
        ctx.arc(enemy.x += enemy.deltaX, enemy.y += enemy.deltaY, enemy.radius, 0, Math.PI*2);
        ctx.fill();

        // bullet-collision-detection
        bullets.forEach((bullet, bIndex) => {

            let distance = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            if(distance - bullet.radius - enemy.radius < 1){
                
                setTimeout(() => {enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);}, 0);
                score++;

                for(let i = 0; i < 15; i++){

                    let particle = {
                        "x": enemy.x,
                        "y": enemy.y,
                        "deltaX": (Math.random()-0.5) * (Math.random() * 10),
                        "deltaY":(Math.random()-0.5) * (Math.random() * 10),
                        "radius":2,
                        "color":{
                            "r":10,
                            "g":247,
                            "b":255,
                            "a":1
                        }
                    }

                    particles.push(particle);

                }
            }
        })

        let distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);
        if(distance - enemy.radius - player.radius < 1){
            alert("Score: " + score)
            bullets = [];
            enemies = [];
            score = 0;
        }
    })

    particles.forEach(particle => {

        ctx.beginPath()
        ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.color.a -= 0.013})`;
        ctx.arc(particle.x += particle.deltaX, particle.y += particle.deltaY, particle.radius, 0, Math.PI*2);
        ctx.fill();

    })

    ctx.beginPath();
    ctx.fillStyle = player.color;
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2);
    ctx.fill();
}

update();

// ---- event handling -----
document.addEventListener("click" || "touchstart", event => {

    let angle = Math.atan2(event.clientY - canvas.height/2, event.clientX - canvas.width/2);
    let dx = Math.cos(angle);
    let dy = Math.sin(angle);

    const bullet = {
        "x": canvas.width/2,
        "y": canvas.height/2,
        "radius": 5,
        "deltaX":dx * 3,
        "deltaY":dy * 3,
        "color":`rgb(${Math.random() * 255}, ${Math.random()*255}, ${Math.random()*255})`
    }

    bullets.push(bullet);
})