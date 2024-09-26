// src/rendering/PostProcessing.ts

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

export class PostProcessing {
    public composer: EffectComposer;
    private renderPass: RenderPass;
    private bloomPass: UnrealBloomPass;
    private filmPass: FilmPass;

    constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
        this.composer = new EffectComposer(renderer);

        this.renderPass = new RenderPass(scene, camera);
        this.composer.addPass(this.renderPass);

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,
            0.8,
            0.2
        );
        
        this.filmPass = new FilmPass(1);

        this.composer.addPass(this.bloomPass);
        //this.composer.addPass(this.filmPass);
    }

    render() {
        this.composer.render();
    }

    setSize(width: number, height: number) {
        this.composer.setSize(width, height);
        this.bloomPass.setSize(width, height);
        this.filmPass.setSize(width, height);
    }

    setBloomStrength(strength: number) {
        this.bloomPass.strength = strength;
    }
}
