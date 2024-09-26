// src/game/systems/MovementSystem.ts
import { InputManager, getMouseWorldPosition } from '../../controls/InputManager';
import { Player } from '../entities/Player';

import * as THREE from 'three';

export class PlayerMovementSystem {
    private acceleration: number = 200; //ups^2
    private maxSpeed: number = 150;     //ups
    private inputManager: InputManager;

    constructor(inputManager: InputManager) {
        this.inputManager = inputManager;
    }

    update(player: Player, deltaTime: number, camera: THREE.Camera) {

        let inputDirection = new THREE.Vector3();

        if (this.inputManager.isKeyPressed('w') || this.inputManager.isKeyPressed('arrowup')) {
            inputDirection.z -= 1;
        }
        if (this.inputManager.isKeyPressed('s') || this.inputManager.isKeyPressed('arrowdown')) {
            inputDirection.z += 1;
        }
        if (this.inputManager.isKeyPressed('a') || this.inputManager.isKeyPressed('arrowleft')) {
            inputDirection.x -= 1;
        }
        if (this.inputManager.isKeyPressed('d') || this.inputManager.isKeyPressed('arrowright')) {
            inputDirection.x += 1;
        }

        //inputDirection.normalize();

        player.velocity.addScaledVector(inputDirection, this.acceleration * deltaTime);

        if (player.velocity.length() > this.maxSpeed) {
            player.velocity.setLength(this.maxSpeed);
        }

        player.mesh.position.addScaledVector(player.velocity, deltaTime);

        const damping = Math.exp(-3 * deltaTime);

        //testing "jumping" (no ground friction in air)
        if (!this.inputManager.isKeyPressed(' ')) {
            player.velocity.multiplyScalar(damping);
        }
        

        this.updatePlayerRotation(player, camera);
    }

    private updatePlayerRotation(player: Player, camera: THREE.Camera) {
        //normalised device coordinates op (-1 to +1)
        const mouseNDC = new THREE.Vector2(
            (this.inputManager.mousePosition.x / window.innerWidth) * 2 - 1,
            -(this.inputManager.mousePosition.y / window.innerHeight) * 2 + 1
        );

        const mousePositionInWorld = getMouseWorldPosition(mouseNDC, camera);

        const playerPosition = new THREE.Vector3().copy(player.mesh.position);
        const direction = new THREE.Vector3().subVectors(mousePositionInWorld, playerPosition);

        //Math.atan2 my beloved
        const angle = Math.atan2(direction.x, direction.z);
        //rotation.y = twist
        player.mesh.rotation.y = angle;
        //make player.torch look at the mouse
        player.torch.target.position.copy(mousePositionInWorld);

    }


    

}
