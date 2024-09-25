// src/game/systems/CollisionSystem.ts

//this is literally a chatgpt conversion of the code from rally game og
//fuck doing this from scratch
import { Enemy } from '../entities/Enemy';
import * as THREE from 'three';

export class CollisionSystem {
    private enemies: Enemy[];

    constructor(enemies: Enemy[]) {
        this.enemies = enemies;
    }

    update(deltaTime: number) {
        // Perform collision detection and resolution for all pairs of enemies
        for (let i = 0; i < this.enemies.length; i++) {
            const enemyA = this.enemies[i];

            for (let j = i + 1; j < this.enemies.length; j++) {
                const enemyB = this.enemies[j];

                if (this.checkCollision(enemyA, enemyB)) {
                    this.resolveCollision(enemyA, enemyB);
                }
            }
        }
    }

    private checkCollision(enemyA: Enemy, enemyB: Enemy): boolean {
        const positionA = enemyA.mesh.position;
        const positionB = enemyB.mesh.position;
        const distance = positionA.distanceTo(positionB);

        const minDistance = enemyA.size + enemyB.size; // Assuming size is the radius
        return distance < minDistance;
    }

    private resolveCollision(enemyA: Enemy, enemyB: Enemy) {
        const positionA = enemyA.mesh.position;
        const positionB = enemyB.mesh.position;

        const overlap = (enemyA.size + enemyB.size) - positionA.distanceTo(positionB);

        // Calculate the direction of the collision
        const collisionNormal = new THREE.Vector3()
            .subVectors(positionB, positionA)
            .normalize();

        // Calculate minimum translation distance to separate the enemies
        const separation = collisionNormal.multiplyScalar(overlap / 2);

        // Adjust positions to resolve overlap
        positionA.add(separation.clone().negate());
        positionB.add(separation);

        // Adjust velocities (simple elastic collision)
        const velocityA = enemyA.velocity;
        const velocityB = enemyB.velocity;

        const relativeVelocity = new THREE.Vector3()
            .subVectors(velocityB, velocityA);

        const velocityAlongNormal = relativeVelocity.dot(collisionNormal);

        if (velocityAlongNormal > 0) {
            // Enemies are moving away from each other
            return;
        }

        const restitution = 0.5; // Coefficient of restitution (0 = inelastic, 1 = elastic)

        const impulseMagnitude = -(1 + restitution) * velocityAlongNormal;
        const impulse = collisionNormal.multiplyScalar(impulseMagnitude / 2); // Divided by 2 because masses are equal

        // Apply impulse to velocities
        velocityA.add(impulse.clone().negate());
        velocityB.add(impulse);
    }
}
