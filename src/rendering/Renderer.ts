// src/rendering/Renderer.ts
import * as THREE from 'three';
import { Camera } from './Camera';

export class Renderer {
    public renderer: THREE.WebGLRenderer;
    public camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;

    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.camera = new Camera().camera;

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize, false);
    }

    render(scene: THREE.Scene, camera: THREE.Camera) {
        this.renderer.render(scene, camera);
    }

    private onWindowResize = () => {
        const aspect = window.innerWidth / window.innerHeight;
    
        if (this.camera instanceof THREE.OrthographicCamera) {
            this.camera.left = -this.camera.top * aspect;
            this.camera.right = this.camera.top * aspect;
            this.camera.updateProjectionMatrix();
        } else if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = aspect;
            this.camera.updateProjectionMatrix();
        }
    
        //FORGETTING THIS IS REALLY BAD LOL
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
}
