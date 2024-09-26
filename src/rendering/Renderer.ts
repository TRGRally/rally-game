// src/rendering/Renderer.ts
import * as THREE from 'three';
import { Camera } from './Camera';
import { PostProcessing } from './PostProcessing';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';

export class Renderer {
    public renderer: THREE.WebGLRenderer;
    private camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private postProcessing: PostProcessing;
    constructor(scene: THREE.Scene, camera: THREE.OrthographicCamera | THREE.PerspectiveCamera) {
        this.camera = camera;
        this.scene = scene;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        if (!this.renderer.xr.isPresenting) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        document.body.appendChild(this.renderer.domElement);

        this.postProcessing = new PostProcessing(this.renderer, this.scene, this.camera);

        this.renderer.xr.enabled = true;
        document.body.appendChild(VRButton.createButton(this.renderer));

        window.addEventListener('resize', this.onWindowResize, false);
    }

    render() {
        //VR doesnt like post processing
        if (this.renderer.xr.isPresenting) {
            this.renderer.render(this.scene, this.camera);
        } else {
            this.postProcessing.render();
        }
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

        if (!this.renderer.xr.isPresenting) {
            //FORGETTING THIS IS REALLY BAD LOL
            this.renderer.setSize(window.innerWidth, window.innerHeight);

        }

        if (this.postProcessing) {
            this.postProcessing.setSize(window.innerWidth, window.innerHeight);
        }

    };
}
