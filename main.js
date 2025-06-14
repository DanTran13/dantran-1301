// ==== 1. PHÁT NHẠC AUTO ====
function playMusicAt(startTime = 70) {
    let audio = document.getElementById('bgm');
    if (audio) {
        audio.currentTime = startTime;
        audio.volume = 0.68;
        audio.play().catch(()=>{});
    }
}
document.addEventListener('click', function playMusicOnce() {
    playMusicAt(73);
    document.removeEventListener('click', playMusicOnce);
});
window.addEventListener('DOMContentLoaded', () => {
    playMusicAt(73);
});

// ==== 2. HIỆU ỨNG CANVAS ====
// === ẢNH NỀN CYBERPUNK ===
const bgImg = new Image();
bgImg.src = "bg.png";

const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

// --- FIRE AREA: vùng chữ DAN TRAN trên hình nền ---
let fireArea = {
    x: 0, y: 0, w: 0, h: 0
};
function updateFireArea() {
    // Căn giữa màn, vùng chữ ước lượng ~ 75% width, 36% height
    fireArea = {
        x: canvas.width*0.13,
        y: canvas.height*0.25,
        w: canvas.width*0.75,
        h: canvas.height*0.36
    };
}

// --- FIRE PARTICLES ---
let fireParticles = [];
const fireCount = 120;
function createFireParticle() {
    // Hiệu ứng lửa xuất phát random trong vùng chữ
    return {
        x: fireArea.x + Math.random()*fireArea.w,
        y: fireArea.y + fireArea.h - Math.random()*fireArea.h*0.30,
        vx: (Math.random()-0.5)*0.8,
        vy: -2.2 - Math.random()*2,
        life: 48 + Math.random()*35,
        radius: 8+Math.random()*12,
        hue: 185+Math.random()*38
    };
}
function drawFireParticles() {
    while (fireParticles.length < fireCount) {
        fireParticles.push(createFireParticle());
    }
    for (let p of fireParticles) {
        let grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `hsla(${p.hue},100%,70%,0.85)`);
        grad.addColorStop(0.38, `hsla(${p.hue+15},100%,62%,0.68)`);
        grad.addColorStop(0.95, "rgba(0,0,0,0)");
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life/80);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2*Math.PI);
        ctx.fillStyle = grad;
        ctx.shadowColor = "#12f2fa";
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.radius *= 0.98;
        p.life -= 1.1 + Math.random()*0.7;
    }
    fireParticles = fireParticles.filter(p => p.life > 0 && p.radius > 2);
}

// --- SAO BĂNG ---
const METEOR_NUM = 30;
const meteors = [];
function randomMeteor() {
    const angle = Math.PI / 3 + Math.random() * Math.PI / 12;
    const speed = 6 + Math.random() * 7;
    return {
        x: Math.random() * canvas.width,
        y: -100 - Math.random()*300,
        len: 65 + Math.random() * 90,
        size: 2.7 + Math.random() * 2.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: `hsl(${200+Math.random()*80},100%,${68+Math.random()*17}%)`,
        glow: 13 + Math.random()*9,
        alpha: 0.80 + Math.random()*0.15
    };
}
function initMeteors() {
    meteors.length = 0;
    for(let i=0; i<METEOR_NUM; i++) meteors.push(randomMeteor());
}
function drawMeteors() {
    for(let m of meteors) {
        ctx.save();
        ctx.globalAlpha = m.alpha;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx/m.vy*m.len, m.y - m.len);
        ctx.strokeStyle = m.color;
        ctx.lineWidth = m.size;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = m.glow;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size*2.3, 0, 2*Math.PI);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = m.color;
        ctx.shadowBlur = m.glow*1.7;
        ctx.globalAlpha = m.alpha*0.6;
        ctx.fill();
        ctx.restore();
        m.x += m.vx;
        m.y += m.vy;
        if(m.x > canvas.width+300 || m.y > canvas.height+200){
            let n = randomMeteor();
            m.x = n.x; m.y = n.y; m.vx = n.vx; m.vy = n.vy;
            m.len = n.len; m.size = n.size; m.color = n.color;
            m.glow = n.glow; m.alpha = n.alpha;
        }
    }
    ctx.globalAlpha = 1;
    for(let i=0;i<55;i++){
        let x = Math.random()*canvas.width, y = Math.random()*canvas.height;
        ctx.save();
        ctx.globalAlpha = 0.1 + Math.random()*0.35;
        ctx.beginPath();
        ctx.arc(x, y, 0.7+Math.random()*1.6, 0, 2*Math.PI);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#b6dbff";
        ctx.shadowBlur = 6 + Math.random()*10;
        ctx.fill();
        ctx.restore();
    }
}

// --- MATRIX RAIN ---
const symbols = ["T", "R", "A", "N", "❤", "♡", "♥", "D", "A", "N"];
const fontSize = 24;
let columns = Math.floor(window.innerWidth / fontSize);
let drops = Array(columns).fill(1);
const colorArr = ["#ff1a52", "#ff4e93", "#ff91bc", "#e2005c", "#fff"];

// --- BOTTOM BOUNCING LETTERS ---
const bottomLetters = [];
const BOTTOM_LETTER_COUNT = 120;
const bottomSymbols = ["D", "A", "N", "T", "R", "A", "N", "❤", "♡", "♥"];
const bottomColors = ["#fff", "#ffd6f9", "#ff91bc", "#e2005c", "#ff80e7", "#a6fbff"];
function addBottomLetter() {
    const size = 26 + Math.random()*18;
    bottomLetters.push({
        char: bottomSymbols[Math.floor(Math.random()*bottomSymbols.length)],
        x: Math.random() * canvas.width,
        y: canvas.height - size - Math.random()*120,
        vx: (-2+Math.random()*4),
        vy: -(3+Math.random()*10),
        size: size,
        color: bottomColors[Math.floor(Math.random()*bottomColors.length)],
        rotation: Math.random()*Math.PI*2,
        rotSpeed: (-0.08+Math.random()*0.16),
        alpha: 0.74+Math.random()*0.26
    });
    if(bottomLetters.length > BOTTOM_LETTER_COUNT) bottomLetters.shift();
}
function initBottomLetters() {
    bottomLetters.length = 0;
    for(let i=0;i<BOTTOM_LETTER_COUNT;i++) addBottomLetter();
}
function drawBottomLetters() {
    const GROUND = canvas.height - 12;
    for(let ltr of bottomLetters){
        ltr.vy += 0.28;
        ltr.x += ltr.vx;
        ltr.y += ltr.vy;
        ltr.rotation += ltr.rotSpeed;
        if(ltr.y > GROUND) {
            ltr.y = GROUND;
            if(Math.abs(ltr.vy) > 1.8) {
                ltr.vy = -ltr.vy * (0.55+Math.random()*0.13);
                ltr.vx *= 0.95;
            } else {
                ltr.vy = 0;
                ltr.vx *= 0.98;
            }
            if(Math.random()<0.007) {
                Object.assign(ltr, {
                    x: Math.random()*canvas.width,
                    y: canvas.height - ltr.size - Math.random()*180,
                    vx: (-2+Math.random()*4),
                    vy: -(6+Math.random()*10),
                    rotation: Math.random()*Math.PI*2,
                    rotSpeed: (-0.08+Math.random()*0.16)
                });
            }
        }
        if(ltr.x < 0) { ltr.x=0; ltr.vx = Math.abs(ltr.vx)*0.9; }
        if(ltr.x > canvas.width) { ltr.x=canvas.width; ltr.vx = -Math.abs(ltr.vx)*0.9; }
        ctx.save();
        ctx.globalAlpha = ltr.alpha;
        ctx.translate(ltr.x, ltr.y);
        ctx.rotate(ltr.rotation);
        ctx.font = `bold ${ltr.size}px 'Segoe UI Symbol', Arial, sans-serif`;
        ctx.fillStyle = ltr.color;
        ctx.shadowColor = ltr.color;
        ctx.shadowBlur = 10;
        ctx.fillText(ltr.char, 0, 0);
        ctx.restore();
    }
    if(Math.random()<0.28) addBottomLetter();
}

// ==== 3. SOCIAL LINKS NEON HỒNG ====
// Dùng emoji cho đơn giản, muốn SVG thì nhắn mình!
const socialLinks = [
    { name: "Facebook",  icon: "📘", url: "https://www.facebook.com/phapsukorea/"},
    { name: "Instagram", icon: "📸", url: "https://www.instagram.com/dantranvan13/"},
    { name: "Twitter",   icon: "✖️", url: "https://x.com/DanTran09071985"},
    { name: "TikTok",    icon: "🎵", url: "https://www.tiktok.com/@dantran_1301"}
];

let hoverIndex = -1;
canvas.addEventListener('mousemove', function(e){
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    hoverIndex = -1;
    for (let i=0; i<socialLinks.length; i++) {
        let s = socialLinks[i];
        if (!s._rect) continue;
        let {x,y,w,h} = s._rect;
        if (mx >= x && mx <= x+w && my >= y && my <= y+h) {
            hoverIndex = i;
            break;
        }
    }
});

canvas.addEventListener('click', function(e){
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    for (let s of socialLinks) {
        if (!s._rect) continue;
        let {x,y,w,h} = s._rect;
        if (mx >= x && mx <= x+w && my >= y && my <= y+h) {
            window.open(s.url, "_blank");
            break;
        }
    }
});

function drawSocialLinks() {
    const n = socialLinks.length;
    const w = 160, h = 50, r = 21;
    const space = 32;
    const totalWidth = n * w + (n-1)*space;
    const startX = (canvas.width - totalWidth)/2;
    const y = canvas.height - h - 38;

    for(let i=0; i<n; i++) {
        let x = startX + i*(w+space);

        socialLinks[i]._rect = {x, y, w, h};
        
        // Vẽ viền neon hồng
        ctx.save();
        ctx.beginPath();
        roundRect(ctx, x, y, w, h, r);
        ctx.shadowColor = (i === hoverIndex) ? "#fff0fa" : "#ff41b3";
        ctx.shadowBlur = (i === hoverIndex) ? 32 : 18;
        ctx.lineWidth = (i === hoverIndex) ? 4.3 : 3.2;
        ctx.strokeStyle = (i === hoverIndex) ? "#fff0fa" : "#ff41b3";
        ctx.stroke();
        ctx.restore();

        // Nền trong mờ
        ctx.save();
        ctx.globalAlpha = 0.88;
        ctx.beginPath();
        roundRect(ctx, x, y, w, h, r);
        ctx.fillStyle = (i === hoverIndex) ? "#ff41b322" : "#161622bb";
        ctx.fill();
        ctx.restore();

        // Icon & text
        ctx.save();
        ctx.font = "bold 28px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = 0.97;
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.fillText(socialLinks[i].icon, x + 21, y + h/2 + 1);
        ctx.font = "19px Arial";
        ctx.fillStyle = "#ffe6fa";
        ctx.fillText(socialLinks[i].name, x + 57, y + h/2 + 2);
        ctx.restore();
    }
}
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
}

// ==== LOOP RENDER ====
function loop() {
    if (bgImg.complete) ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    drawFireParticles();

    drawMeteors();
    // Matrix rain
    ctx.save();
    ctx.font = `bold ${fontSize}px 'Segoe UI Symbol', Arial, sans-serif`;
    ctx.textAlign = "center";
    for (let i = 0; i < drops.length; i++) {
        let text = symbols[Math.floor(Math.random() * symbols.length)];
        let color = colorArr[Math.floor(Math.random() * colorArr.length)];
        ctx.fillStyle = color;
        ctx.shadowColor = color; ctx.shadowBlur = 18;
        let x = i * fontSize + fontSize / 2, y = drops[i] * fontSize;
        ctx.fillText(text, x, y);
        if (y > canvas.height && Math.random() > 0.973) drops[i] = 0;
        drops[i]++;
    }
    ctx.shadowBlur = 0; ctx.restore();
    drawBottomLetters();
    drawSocialLinks();
    requestAnimationFrame(loop);
}

// ==== HANDLE RESIZE ====
function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(window.innerWidth / fontSize);
    drops = Array(columns).fill(1);
    initMeteors();
    initBottomLetters();
    updateFireArea();
}
window.addEventListener('resize', handleResize);

// ==== INIT ====
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
initMeteors();
initBottomLetters();
updateFireArea();
loop();
