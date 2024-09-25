// src/rendering/Scene.ts
import * as THREE from 'three';
import * as Colors from '../utils/Colors';

export class Scene {
    public scene: THREE.Scene;

    constructor() {
        this.scene = new THREE.Scene();

        const textureLoader = new THREE.TextureLoader();

        const ambientLight = new THREE.AmbientLight(Colors.WorldAmbientLight, 0.01);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(Colors.WorldAmbientLight, 0.5);
        directionalLight.position.set(-1, 1, -1);
        //this.scene.add(directionalLight);

    
        const textureRepeat = 4;

        const normalMap = textureLoader.load('assets/tile/tiling_24_normal-1K.png');
        const aoMap = textureLoader.load('assets/tile/tiling_24_ambientocclusion-1K.png');
        const roughnessMap = textureLoader.load('assets/tile/tiling_24_roughness-1K.png');
        const metalnessMap = textureLoader.load('assets/tile/tiling_24_metallic-1K.png');
        const baseColorMap = textureLoader.load('assets/tile/tiling_24_basecolor-1K.png');
        const heightMap = textureLoader.load('assets/tile/tiling_24_height-1K.png');

        normalMap.wrapS = THREE.RepeatWrapping;
        normalMap.wrapT = THREE.RepeatWrapping;
        normalMap.repeat.set(textureRepeat, textureRepeat);
        roughnessMap.wrapS = THREE.RepeatWrapping;
        roughnessMap.wrapT = THREE.RepeatWrapping;
        roughnessMap.repeat.set(textureRepeat, textureRepeat);
        metalnessMap.wrapS = THREE.RepeatWrapping;
        metalnessMap.wrapT = THREE.RepeatWrapping;
        metalnessMap.repeat.set(textureRepeat, textureRepeat);
        aoMap.wrapS = THREE.RepeatWrapping;
        aoMap.wrapT = THREE.RepeatWrapping;
        aoMap.repeat.set(textureRepeat, textureRepeat);
        baseColorMap.wrapS = THREE.RepeatWrapping;
        baseColorMap.wrapT = THREE.RepeatWrapping;
        baseColorMap.repeat.set(textureRepeat, textureRepeat);
        heightMap.wrapS = THREE.RepeatWrapping;
        heightMap.wrapT = THREE.RepeatWrapping;
        heightMap.repeat.set(textureRepeat, textureRepeat);

        const planeGeometry = new THREE.PlaneGeometry(200, 200);
        const planeMaterial = new THREE.MeshPhysicalMaterial({ 
            
            map: baseColorMap,
            roughnessMap: roughnessMap,
            metalnessMap: metalnessMap,
            aoMap: aoMap,
            displacementMap: heightMap,
            // envMap: envMap,
            normalMap: normalMap,
            
        });
        const ground = new THREE.Mesh(planeGeometry, planeMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

    }

    add(object: THREE.Object3D) {
        this.scene.add(object);
    }

    remove(object: THREE.Object3D) {
        this.scene.remove(object);
    }

    clear() {
        this.scene.children = [];
    }


}
