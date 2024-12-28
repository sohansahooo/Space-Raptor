import { GameState, Enemy, Particle, Bullet, Vector2D } from './gameState';

const PLAYER_SPEED = 400;
const BULLET_SPEED = 600;
const ENEMY_SPEED = 200;
const SHOOT_COOLDOWN = 0.2;

export const updateGameState = (state: GameState, deltaTime: number) => {
  updatePlayer(state, deltaTime);
  updateEnemies(state, deltaTime);
  updateBullets(state, deltaTime);
  updateParticles(state, deltaTime);
  spawnEnemies(state);
  checkCollisions(state);
};

const updatePlayer = (state: GameState, deltaTime: number) => {
  const { player, keys } = state;
  
  // Movement
  player.velocity.x = 0;
  if (keys['ArrowLeft'] || keys['a']) player.velocity.x = -PLAYER_SPEED;
  if (keys['ArrowRight'] || keys['d']) player.velocity.x = PLAYER_SPEED;

  // Update position
  player.position.x += player.velocity.x * deltaTime;
  
  // Keep player in bounds
  player.position.x = Math.max(player.size, Math.min(window.innerWidth - player.size, player.position.x));

  // Shooting
  if ((keys[' '] || keys['ArrowUp']) && Date.now() - player.lastShot > SHOOT_COOLDOWN * 1000) {
    createBullet(state, true);
    player.lastShot = Date.now();
  }
};

const updateEnemies = (state: GameState, deltaTime: number) => {
  state.enemies.forEach(enemy => {
    enemy.position.y += ENEMY_SPEED * deltaTime;
    if (Math.random() < 0.01) {
      createBullet(state, false, enemy.position);
    }
  });

  state.enemies = state.enemies.filter(enemy => enemy.position.y < window.innerHeight + 50);
};

const updateBullets = (state: GameState, deltaTime: number) => {
  state.bullets.forEach(bullet => {
    bullet.position.y += bullet.velocity.y * deltaTime;
  });

  state.bullets = state.bullets.filter(bullet => 
    bullet.position.y > -50 && bullet.position.y < window.innerHeight + 50
  );
};

const updateParticles = (state: GameState, deltaTime: number) => {
  state.particles.forEach(particle => {
    particle.position.x += particle.velocity.x * deltaTime;
    particle.position.y += particle.velocity.y * deltaTime;
    particle.life -= deltaTime;
  });

  state.particles = state.particles.filter(particle => particle.life > 0);
};

const createBullet = (state: GameState, isPlayerBullet: boolean, position?: Vector2D) => {
  const pos = position || { ...state.player.position };
  state.bullets.push({
    position: { x: pos.x, y: pos.y },
    velocity: { x: 0, y: isPlayerBullet ? -BULLET_SPEED : BULLET_SPEED },
    rotation: 0,
    size: 4,
    isPlayerBullet
  });
};

const spawnEnemies = (state: GameState) => {
  if (state.enemies.length < 5 && Math.random() < 0.02) {
    state.enemies.push({
      position: {
        x: Math.random() * (window.innerWidth - 60) + 30,
        y: -30
      },
      velocity: { x: 0, y: ENEMY_SPEED },
      rotation: Math.PI,
      size: 25,
      health: 2
    });
  }
};

const createExplosion = (state: GameState, position: Vector2D) => {
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    state.particles.push({
      position: { ...position },
      velocity: {
        x: Math.cos(angle) * 200,
        y: Math.sin(angle) * 200
      },
      rotation: 0,
      size: 3,
      life: 0.5,
      maxLife: 0.5,
      color: '#FFA500'
    });
  }
};

const checkCollisions = (state: GameState) => {
  // Keep track of entities to remove
  const bulletsToRemove = new Set<number>();
  const enemiesToRemove = new Set<number>();

  // Check player bullets against enemies
  state.bullets.forEach((bullet, bulletIndex) => {
    if (bullet.isPlayerBullet) {
      state.enemies.forEach((enemy, enemyIndex) => {
        if (bulletsToRemove.has(bulletIndex) || enemiesToRemove.has(enemyIndex)) return;

        const dx = bullet.position.x - enemy.position.x;
        const dy = bullet.position.y - enemy.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < enemy.size + bullet.size) {
          enemy.health--;
          bulletsToRemove.add(bulletIndex);

          if (enemy.health <= 0) {
            enemiesToRemove.add(enemyIndex);
            createExplosion(state, enemy.position);
          }
        }
      });
    } else {
      // Check enemy bullets against player
      const dx = bullet.position.x - state.player.position.x;
      const dy = bullet.position.y - state.player.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < state.player.size + bullet.size) {
        bulletsToRemove.add(bulletIndex);
        createExplosion(state, state.player.position);
      }
    }
  });

  // Remove entities in reverse order to maintain correct indices
  Array.from(bulletsToRemove)
    .sort((a, b) => b - a)
    .forEach(index => state.bullets.splice(index, 1));

  Array.from(enemiesToRemove)
    .sort((a, b) => b - a)
    .forEach(index => state.enemies.splice(index, 1));
};