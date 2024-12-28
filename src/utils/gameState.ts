export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  position: Vector2D;
  velocity: Vector2D;
  rotation: number;
  size: number;
}

export interface Player extends GameObject {
  isShooting: boolean;
  lastShot: number;
}

export interface Enemy extends GameObject {
  health: number;
}

export interface Bullet extends GameObject {
  isPlayerBullet: boolean;
}

export interface Particle extends GameObject {
  life: number;
  maxLife: number;
  color: string;
}

export interface GameState {
  player: Player;
  enemies: Enemy[];
  bullets: Bullet[];
  particles: Particle[];
  keys: { [key: string]: boolean };
}

export const initialGameState = (): GameState => ({
  player: {
    position: { x: window.innerWidth / 2, y: window.innerHeight - 100 },
    velocity: { x: 0, y: 0 },
    rotation: 0,
    size: 30,
    isShooting: false,
    lastShot: 0,
  },
  enemies: [],
  bullets: [],
  particles: [],
  keys: {},
});