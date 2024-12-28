import { Player, Enemy, Bullet, Particle } from './gameState';

export const drawBackground = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = '#000033';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw stars
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * ctx.canvas.width;
    const y = Math.random() * ctx.canvas.height;
    const size = Math.random() * 2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
};

export const drawPlayer = (ctx: CanvasRenderingContext2D, player: Player) => {
  ctx.save();
  ctx.translate(player.position.x, player.position.y);
  ctx.rotate(player.rotation);

  // Draw ship body
  ctx.beginPath();
  ctx.moveTo(0, -player.size);
  ctx.lineTo(player.size, player.size);
  ctx.lineTo(0, player.size / 2);
  ctx.lineTo(-player.size, player.size);
  ctx.closePath();

  ctx.strokeStyle = '#00FF00';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw engine glow
  ctx.beginPath();
  ctx.moveTo(-player.size / 2, player.size);
  ctx.lineTo(0, player.size + 10);
  ctx.lineTo(player.size / 2, player.size);
  ctx.strokeStyle = '#FF4400';
  ctx.stroke();

  ctx.restore();
};

export const drawEnemies = (ctx: CanvasRenderingContext2D, enemies: Enemy[]) => {
  enemies.forEach(enemy => {
    ctx.save();
    ctx.translate(enemy.position.x, enemy.position.y);
    ctx.rotate(enemy.rotation);

    // Draw enemy ship
    ctx.beginPath();
    ctx.moveTo(0, -enemy.size);
    ctx.lineTo(enemy.size, enemy.size);
    ctx.lineTo(-enemy.size, enemy.size);
    ctx.closePath();

    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  });
};

export const drawBullets = (ctx: CanvasRenderingContext2D, bullets: Bullet[]) => {
  bullets.forEach(bullet => {
    ctx.beginPath();
    ctx.arc(bullet.position.x, bullet.position.y, bullet.size, 0, Math.PI * 2);
    ctx.fillStyle = bullet.isPlayerBullet ? '#00FF00' : '#FF0000';
    ctx.fill();
  });
};

export const drawParticles = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
  particles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.life / particle.maxLife;
    ctx.fill();
    ctx.globalAlpha = 1;
  });
};