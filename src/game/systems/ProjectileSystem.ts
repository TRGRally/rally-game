// src/game/systems/ProjectileSystem.ts
import { Enemy } from '../entities/Enemy';
import { Projectile } from '../entities/Projectile';
import * as THREE from 'three';

export class ProjectileSystem {
    private projectiles: Projectile[] = [];
    private scene: THREE.Scene;
    private enemies: Enemy[];

    constructor(scene: THREE.Scene, enemies: Enemy[] = []) {
        this.scene = scene;
        this.enemies = enemies;
    }

    addProjectile(projectile: Projectile) {
        this.projectiles.push(projectile);
        this.scene.add(projectile.mesh);
    }

    update(deltaTime: number) {
        //projectile update
        this.projectiles.forEach((projectile) => {
            if (projectile.isActive) {
                projectile.update(deltaTime);
            }

            //collisions with enemies
            this.enemies.forEach((enemy: Enemy) => {
                if (this.checkCollision(projectile, enemy)) {
                    projectile.isActive = false;
                    enemy.isActive = false;

                    // TODO: OBJECT POOL

                    //"removes" enemy mesh from the scene
                    enemy.torch.intensity = 0;
                    enemy.mesh.position.set(0, -100, 0);
                    
                }
            });
        });

        //TODO: OBJECT POOL
        this.projectiles = this.projectiles.filter((projectile) => {
            if (!projectile.isActive) {
                this.scene.remove(projectile.mesh);
                return false;
            }
            return true;
        });
    }

    private checkCollision(projectile: Projectile, enemy: Enemy): boolean {

        if (!enemy.isActive || !projectile.isActive) {
            return false;
        }

        const projectilePos = projectile.mesh.position;
        const enemyPos = enemy.mesh.position;
        const distance = projectilePos.distanceTo(enemyPos);
        const collisionDistance = enemy.size;
        
        return distance < collisionDistance;
    }
}
