// src/game/systems/EnemyBoidsSystem.ts

//yet another rally game -> chatgpt moment
import { Enemy } from '../entities/Enemy';
import * as THREE from 'three';

export class EnemyBoidsSystem {
    private enemies: Enemy[];
    private bounds: { x: number; z: number };

    // Boids parameters
    private separationDistance: number = 15;
    private alignmentDistance: number = 20;
    private cohesionDistance: number = 20;
    private maxSpeed: number = 50;
    private maxForce: number = 15;

    // Weight coefficients
    public separationWeight: number = 1.0;
    public alignmentWeight: number = 1.0;
    public cohesionWeight: number = 1.0;
    public seekWeight: number = 1.0;

    public target: THREE.Vector3;

    constructor(enemies: Enemy[], bounds: { x: number; z: number }, target: THREE.Vector3) {
        this.enemies = enemies;
        this.bounds = bounds;
        this.target = target;
    }

    update(deltaTime: number) {
        this.enemies.forEach((enemy) => {

            if (!enemy.isActive) {
                return;
            }

            const acceleration = new THREE.Vector3();

            const separation = this.computeSeparation(enemy).multiplyScalar(this.separationWeight);
            const alignment = this.computeAlignment(enemy).multiplyScalar(this.alignmentWeight);
            const cohesion = this.computeCohesion(enemy).multiplyScalar(this.cohesionWeight);
            const seek = this.computeSeek(enemy).multiplyScalar(this.seekWeight);

            acceleration.add(separation);
            acceleration.add(alignment);
            acceleration.add(cohesion);
            acceleration.add(seek);

            // Update velocity and position
            enemy.velocity.add(acceleration.multiplyScalar(deltaTime));

            // Limit speed
            if (enemy.velocity.length() > this.maxSpeed) {
                enemy.velocity.setLength(this.maxSpeed);
            }

            // Update position
            enemy.mesh.position.add(enemy.velocity.clone().multiplyScalar(deltaTime));

            if (enemy.velocity.lengthSq() > 0.0001) {
                const angle = Math.atan2(enemy.velocity.x, enemy.velocity.z);
                enemy.mesh.rotation.y = angle;
                enemy.torch.target.position.copy(this.target);
            }

            // Handle boundary conditions (e.g., wrap around or reflect)
            this.handleBoundaries(enemy);
        });
    }

    private computeSeek(enemy: Enemy): THREE.Vector3 {
        const desired = new THREE.Vector3().subVectors(this.target, enemy.mesh.position);
        desired.setLength(this.maxSpeed);

        const steer = new THREE.Vector3().subVectors(desired, enemy.velocity);
        if (steer.length() > this.maxForce) {
            steer.setLength(this.maxForce);
        }

        return steer;
    }
    private computeSeparation(enemy: Enemy): THREE.Vector3 {
        const steer = new THREE.Vector3();
        let count = 0;

        this.enemies.forEach((other) => {
            if (other !== enemy) {
                const distance = enemy.mesh.position.distanceTo(other.mesh.position);
                if (distance < this.separationDistance && distance > 0) {
                    const diff = new THREE.Vector3()
                        .subVectors(enemy.mesh.position, other.mesh.position)
                        .normalize()
                        .divideScalar(distance); // Weight by distance
                    steer.add(diff);
                    count++;
                }
            }
        });

        if (count > 0) {
            steer.divideScalar(count);
        }

        if (steer.length() > 0) {
            steer.setLength(this.maxForce);
        }

        return steer;
    }

    private computeAlignment(enemy: Enemy): THREE.Vector3 {
        const sum = new THREE.Vector3();
        let count = 0;

        this.enemies.forEach((other) => {
            const distance = enemy.mesh.position.distanceTo(other.mesh.position);
            if (distance < this.alignmentDistance && distance > 0) {
                sum.add(other.velocity);
                count++;
            }
        });

        if (count > 0) {
            sum.divideScalar(count);
            sum.setLength(this.maxForce);
            return sum.sub(enemy.velocity);
        } else {
            return new THREE.Vector3();
        }
    }

    private computeCohesion(enemy: Enemy): THREE.Vector3 {
        const sum = new THREE.Vector3();
        let count = 0;

        this.enemies.forEach((other) => {
            const distance = enemy.mesh.position.distanceTo(other.mesh.position);
            if (distance < this.cohesionDistance && distance > 0) {
                sum.add(other.mesh.position);
                count++;
            }
        });

        if (count > 0) {
            sum.divideScalar(count);
            return this.seek(enemy, sum);
        } else {
            return new THREE.Vector3();
        }
    }

    private seek(enemy: Enemy, target: THREE.Vector3): THREE.Vector3 {
        const desired = new THREE.Vector3().subVectors(target, enemy.mesh.position);
        desired.setLength(this.maxSpeed);

        const steer = new THREE.Vector3().subVectors(desired, enemy.velocity);
        if (steer.length() > this.maxForce) {
            steer.setLength(this.maxForce);
        }

        return steer;
    }

    private handleBoundaries(enemy: Enemy) {
        const position = enemy.mesh.position;
        const velocity = enemy.velocity;
        const { x: maxX, z: maxZ } = this.bounds;
    
        if (position.x > maxX) {
            position.x = maxX;
            velocity.x = -velocity.x;
        } else if (position.x < -maxX) {
            position.x = -maxX;
            velocity.x = -velocity.x;
        }
    
        if (position.z > maxZ) {
            position.z = maxZ;
            velocity.z = -velocity.z;
        } else if (position.z < -maxZ) {
            position.z = -maxZ;
            velocity.z = -velocity.z;
        }
    }
}
