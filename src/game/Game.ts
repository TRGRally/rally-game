// src/game/Game.ts
import { Renderer } from '../rendering/Renderer';
import { Camera } from '../rendering/Camera';
import { Scene } from '../rendering/Scene';
import { InputManager, getMouseWorldPosition } from '../controls/InputManager';
import { PlayerMovementSystem } from './systems/PlayerMovementSystem';
import { Player } from './entities/Player';
import { PerformanceMonitor } from '../debug/PerformanceMonitor';
import { Enemy } from './entities/Enemy';
import { ProjectileSystem } from './systems/ProjectileSystem';
import { Projectile } from './entities/Projectile';
import * as THREE from 'three';
import { EnemyBoidsSystem } from './systems/EnemyBoidsSystem';
import { CollisionSystem } from './systems/CollisionSystem';


export class Game {
    private renderer: Renderer;
    private camera: Camera;
    private scene: Scene;
    private inputManager: InputManager;
    private playerMovementSystem: PlayerMovementSystem;
    private projectileSystem: ProjectileSystem;
    private enemyBoidsSystem: EnemyBoidsSystem;
    private collisionSystem: CollisionSystem;
    private player: Player;
    private enemies: Enemy[] = [];

    private mouseWorldPosition: THREE.Vector3 = new THREE.Vector3();

    private lastFrameTime: number = performance.now();

    private performanceMonitor: PerformanceMonitor;

    constructor() {
        this.camera = new Camera();
        this.scene = new Scene();
        this.renderer = new Renderer(this.scene.scene, this.camera.camera);
        this.inputManager = new InputManager();
        this.playerMovementSystem = new PlayerMovementSystem(this.inputManager);

        this.player = new Player();
        this.scene.add(this.player.mesh);
        this.scene.add(this.player.torch.target);

        //TODO: formalise this somewhere
        const bounds = { x: 100, z: 100 };

        this.createEnemies();
        this.enemyBoidsSystem = new EnemyBoidsSystem(this.enemies, bounds, this.mouseWorldPosition);
        this.enemies.forEach((enemy) => {
            this.scene.add(enemy.mesh);
            this.scene.add(enemy.torch.target);
        });

        this.projectileSystem = new ProjectileSystem(this.scene.scene, this.enemies);

        //funny
        setInterval(() => {
            this.rollBoidsCoefficients(0, 5);
        }, 1000);
        setInterval(() => {
            this.player.log();
        }, 1000);

        this.collisionSystem = new CollisionSystem(this.enemies);

        this.performanceMonitor = new PerformanceMonitor();
        
    }

    start() {
        this.renderer.renderer.setAnimationLoop(this.animate);
    }

    private animate = () => {
        this.performanceMonitor.begin();

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        this.inputManager.updateGamepads()

        this.player.update(deltaTime);
        this.playerMovementSystem.update(this.player, deltaTime, this.camera.camera);
        //console.log(this.player.velocity.length());

        if (this.inputManager.isMouseButtonPressed(0)) {
            if (this.player.shoot()) {
                this.handleShooting();
            }
        }

        //zoom is debug rn
        if (this.inputManager.scrollDelta !== 0) {
            console.log('Scroll delta:', this.inputManager.scrollDelta);
            this.camera.zoom(this.inputManager.scrollDelta);
            this.inputManager.resetScrollDelta();
        }

        //this should be in inputsystem somewhere
        const mouseNDC = new THREE.Vector2(
            (this.inputManager.mousePosition.x / window.innerWidth) * 2 - 1,
            -(this.inputManager.mousePosition.y / window.innerHeight) * 2 + 1
        );
        this.mouseWorldPosition = getMouseWorldPosition(mouseNDC, this.camera.camera);

        this.projectileSystem.update(deltaTime);

        if (this.inputManager.isKeyPressed(' ')) {
            this.enemyBoidsSystem.target = this.mouseWorldPosition;
        } else {
            this.enemyBoidsSystem.target = this.player.mesh.position;
        }
        
        this.enemyBoidsSystem.update(deltaTime);
        this.collisionSystem.update(deltaTime);

        this.renderer.render();

        this.performanceMonitor.end();
    };

    private createEnemies() {
        for (let i = 0; i < 20; i++) {
            const position = new THREE.Vector3(
                (Math.random() - 0.5) * 200,
                0,
                (Math.random() - 0.5) * 200
            );
            const enemy = new Enemy(position);
            this.enemies.push(enemy);
        }
    }

    private rollBoidsCoefficients(min: number, max: number) {
        this.enemyBoidsSystem.separationWeight = Math.random() * (max - 1) + 1;
        this.enemyBoidsSystem.alignmentWeight = Math.random() * (max - min) + min;
        this.enemyBoidsSystem.cohesionWeight = Math.random() * (max - min) + min;
        this.enemyBoidsSystem.seekWeight = Math.random() * (max - min) + min;
    }

    private handleShooting() {
        const projectile = this.createProjectile();
        this.projectileSystem.addProjectile(projectile);
    }

    private createProjectile(): Projectile {
        const position = this.player.mesh.position.clone();

        //i have no clue how to use quaternions
        const direction = new THREE.Vector3(0, 0, 1);
        direction.applyQuaternion(this.player.mesh.quaternion);

        const speed = 200; //ups
        const projectile = new Projectile(position, direction, speed);

        return projectile;
    }
}
