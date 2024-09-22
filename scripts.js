const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let balls = [];
let ballCount = 10; // 初始球数
const demonRadius = 30;
let demonX = Math.random() * (canvas.width - 2 * demonRadius) + demonRadius; // 随机位置
let demonY = Math.random() * (canvas.height - 2 * demonRadius) + demonRadius; // 随机位置
const demonSpeed = 5;

document.getElementById('count').innerText = ballCount;

// 初始化球
for (let i = 0; i < ballCount; i++) {
	const radius = Math.random() * 10 + 5; // 随机半径
	balls.push({
		x: Math.random() * (canvas.width - 2 * radius) + radius,
		y: Math.random() * (canvas.height - 2 * radius) + radius,
		dx: (Math.random() - 0.5) * 4,
		dy: (Math.random() - 0.5) * 4,
		radius: radius,
		color: getRandomColor()
	});
}

// 监听键盘事件控制恶魔圈
document.addEventListener('keydown', (event) => {
	switch (event.key) {
		case 'ArrowUp':
			demonY -= demonSpeed;
			break;
		case 'ArrowDown':
			demonY += demonSpeed;
			break;
		case 'ArrowLeft':
			demonX -= demonSpeed;
			break;
		case 'ArrowRight':
			demonX += demonSpeed;
			break;
	}
});

function getRandomColor() {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function drawBall(ball) {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = ball.color;
	ctx.fill();
	ctx.closePath();
}

function drawDemon() {
	ctx.beginPath();
	ctx.arc(demonX, demonY, demonRadius, 0, Math.PI * 2);
	ctx.strokeStyle = 'white'; // 将恶魔圈颜色设置为白色圆环
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.closePath();
}

function updateBalls() {
	for (let i = 0; i < balls.length; i++) {
		let ball = balls[i];
		ball.x += ball.dx;
		ball.y += ball.dy;

		if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
			ball.dx = -ball.dx;
			ball.color = getRandomColor(); // 碰撞到边缘时变色
		}
		if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) {
			ball.dy = -ball.dy;
			ball.color = getRandomColor(); // 碰撞到边缘时变色
		}

		// 检查恶魔圈是否抓到球
		if (Math.hypot(ball.x - demonX, ball.y - demonY) < demonRadius + ball.radius) {
			balls.splice(i, 1);
			ballCount--;
			document.getElementById('count').innerText = ballCount;
			i--; // 调整索引
		}

		// 检查球与球之间的碰撞
		for (let j = i + 1; j < balls.length; j++) {
			let otherBall = balls[j];
			if (Math.hypot(ball.x - otherBall.x, ball.y - otherBall.y) < ball.radius + otherBall.radius) {
				ball.color = getRandomColor();
				otherBall.color = getRandomColor();
			}
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	balls.forEach(drawBall);
	drawDemon();
	updateBalls();
	requestAnimationFrame(draw);
}

draw();