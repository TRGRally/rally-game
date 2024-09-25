// src/rendering/Camera.ts
import * as THREE from 'three';

export class Camera {
    public camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
    private frustumSize: number = 100;
    private zoomSpeed: number = 0.1;

    constructor() {
        const aspect = window.innerWidth / window.innerHeight;

        this.camera = new THREE.OrthographicCamera(
            (this.frustumSize * aspect) / -2,
            (this.frustumSize * aspect) / 2,
            this.frustumSize / 2,
            this.frustumSize / -2,
            0.1,
            1000
        );

        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);

        this.camera.position.set(0, 200, 150);
        this.camera.lookAt(0, 0, 0);
    }

    zoom(deltaY: number) {
        this.camera.zoom += (-deltaY * 0.01 * this.zoomSpeed) * this.camera.zoom;
        this.camera.zoom = THREE.MathUtils.clamp(this.camera.zoom, 0.5, 2);
        console.log(this.camera.zoom);
        this.camera.updateProjectionMatrix();
      }

    updateProjectionMatrix() {
        this.camera.updateProjectionMatrix();
    }
}
