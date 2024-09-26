// src/game/entities/Projectile.ts
import * as THREE from 'three';
import * as Colors from '../../utils/Colors';

export class Projectile {
    public mesh: THREE.Mesh;
    public velocity: THREE.Vector3;
    public isActive: boolean;

    private lifespan: number = 5; //seconds
    private age: number = 0;

    constructor(position: THREE.Vector3, direction: THREE.Vector3, speed: number) {

        const geometry = new THREE.SphereGeometry(1, 8, 8);
        const material = new THREE.MeshStandardMaterial({ 
            color: Colors.BulletBase,
            emissive: Colors.BulletEmissive,
            emissiveIntensity: 1
         });
        this.mesh = new THREE.Mesh(geometry, material);

        const light = new THREE.PointLight(Colors.BulletEmissive, 8, 15, 0.75);
        light.position.set(0, 0, 0);
        //this.mesh.add(light);

        this.mesh.position.copy(position);
        this.velocity = direction.clone().normalize().multiplyScalar(speed);

        this.isActive = true;
    }

    update(deltaTime: number) {
        this.mesh.position.addScaledVector(this.velocity, deltaTime);

        if (this.isOutOfBounds()) {
            this.isActive = false;
        }

        this.age += deltaTime;
        if (this.age >= this.lifespan) {
            this.isActive = false;
        }
    }

    private isOutOfBounds(): boolean {
        const bounds = 200;
        const { x, z } = this.mesh.position;
        return x < -bounds || x > bounds || z < -bounds || z > bounds;
    }
}