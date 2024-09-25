// src/game/entities/Enemy.ts
import * as THREE from 'three';
import * as Colors from '../../utils/Colors';

export class Enemy {
    public mesh: THREE.Mesh;
    public light: THREE.PointLight;
    public torch: THREE.SpotLight;

    public size: number = 3;
    public velocity: THREE.Vector3;
    public isActive: boolean = false;

    constructor(position: THREE.Vector3 = new THREE.Vector3()) {

        const geometry = new THREE.CylinderGeometry(this.size, this.size, 5);
        const material = new THREE.MeshStandardMaterial({
            color: Colors.EnemyBase,
            emissive: Colors.EnemyEmissive,
            emissiveIntensity: 1
        });


        this.mesh = new THREE.Mesh(geometry, material);

        this.light = new THREE.PointLight(Colors.EnemyEmissive, 5, 22, 0.75);
        this.light.position.set(0, 8, 0);
        //this.mesh.add(this.light);

        this.torch = new THREE.SpotLight(Colors.EnemyTorch, 50, 0, Math.PI / 8, 1, 1);
        this.mesh.add(this.torch);
        const spotLightHelper = new THREE.SpotLightHelper(this.torch);
        //this.mesh.add(spotLightHelper);

        const lightHelper = new THREE.PointLightHelper(this.light);
        //this.mesh.add(lightHelper);


        this.velocity = new THREE.Vector3(
            Math.random() * 2 - 1,
            0,
            Math.random() * 2 - 1
        ).setLength(10);

        this.mesh.position.copy(position);

        this.isActive = true;


    }

    log() {
        console.table(this.mesh.position);
        console.table(this.light.position)
    }

}
