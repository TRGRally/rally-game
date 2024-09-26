// src/game/entities/Player.ts
import * as THREE from 'three';
import * as Colors from '../../utils/Colors';

export class Player {
    public mesh: THREE.Mesh;
    public light: THREE.PointLight;
    public torch: THREE.SpotLight;

    public velocity: THREE.Vector3;
    public size: number = 4;
    public canShoot: boolean;
    public shootCooldown: number;
    public shootTimer: number;
    public onGround: boolean = false;

    constructor() {
        const geometry = new THREE.CylinderGeometry(this.size, this.size, 10);
        const material = new THREE.MeshStandardMaterial({
            color: Colors.PlayerBase,
            emissive: Colors.PlayerEmissive,
            emissiveIntensity: 0.5
        });
        this.mesh = new THREE.Mesh(geometry, material);

        this.light = new THREE.PointLight(Colors.PlayerEmissive, 5, 150, 0.75);
        this.light.position.set(0, 10, 0);
        this.mesh.add(this.light);

        this.torch = new THREE.SpotLight(Colors.PlayerTorch, 50, 0, Math.PI / 8, 1, 1);
        this.mesh.add(this.torch);
        const spotLightHelper = new THREE.SpotLightHelper(this.torch);
        //this.mesh.add(spotLightHelper);

        const lightHelper = new THREE.PointLightHelper(this.light);
        //this.mesh.add(lightHelper);


        this.velocity = new THREE.Vector3();

        this.canShoot = true;
        this.shootCooldown = 0.2;
        this.shootTimer = 0;
    }

    update(deltaTime: number) {
        if (!this.canShoot) {
            this.shootTimer += deltaTime;
            if (this.shootTimer >= this.shootCooldown) {
                this.canShoot = true;
                this.shootTimer = 0;
            }
        }
    }
    
    //only sends shoot event if able to from cooldown or other
    shoot() {
        if (this.canShoot) {
            this.canShoot = false;
            return true;
        }
        return false;
    }

    log() {
        console.table(this.mesh.position);
    }
}
