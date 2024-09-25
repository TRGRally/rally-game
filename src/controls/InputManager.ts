// src/controls/InputManager.ts
import * as THREE from 'three';

export class InputManager {
    private keysPressed: { [key: string]: boolean } = {};
    public mousePosition: { x: number, y: number } = { x: 0, y: 0 };
    public mouseButtonsPressed: { [button: number]: boolean } = {};
    public scrollDelta: number = 0;

    private gamepads: Gamepad[] = [];
    private controllerButtonsPressed: { [buttonIndex: number]: boolean } = {};
    private controllerAxes: number[] = [];

    constructor() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);

        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('contextmenu', (event) => event.preventDefault());
        window.addEventListener('selectstart', (event) => event.preventDefault());
        window.addEventListener('dragstart', (event) => event.preventDefault());

        window.addEventListener('wheel', this.onWheel);

        window.addEventListener('gamepadconnected', this.onGamepadConnected);
        window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected);
    }

    private onKeyDown = (event: KeyboardEvent) => {
        this.keysPressed[event.key.toLowerCase()] = true;
    };

    private onKeyUp = (event: KeyboardEvent) => {
        this.keysPressed[event.key.toLowerCase()] = false;
    };

    isKeyPressed(key: string): boolean {
        return !!this.keysPressed[key.toLowerCase()];
    }

    private onMouseMove = (event: MouseEvent) => {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
    };

    private onMouseDown = (event: MouseEvent) => {
        this.mouseButtonsPressed[event.button] = true;
    };

    private onMouseUp = (event: MouseEvent) => {
        this.mouseButtonsPressed[event.button] = false;
    };

    isMouseButtonPressed(button: number): boolean {
        return !!this.mouseButtonsPressed[button];
    }

    private onWheel = (event: WheelEvent) => {
        let deltaY = event.deltaY;

        //different scroll modes on different input devices
        if (event.deltaMode === 1) {
            deltaY *= 16;
        } else if (event.deltaMode === 2) {
            deltaY *= window.innerHeight;
        }

        this.scrollDelta = event.deltaY;
    };

    resetScrollDelta() {
        this.scrollDelta = 0;
    }

    private onGamepadConnected = (event: GamepadEvent) => {
        console.log('Gamepad connected:', event.gamepad);
        this.gamepads[event.gamepad.index] = event.gamepad;
    };

    private onGamepadDisconnected = (event: GamepadEvent) => {
        console.log('Gamepad disconnected:', event.gamepad);
        delete this.gamepads[event.gamepad.index];
    };

    public updateGamepads() {
        const connectedGamepads = navigator.getGamepads ? navigator.getGamepads() : [];

        //takes all inputs from all gamepads
        for (let i = 0; i < connectedGamepads.length; i++) {
            const gp = connectedGamepads[i];
            if (gp) {
                this.gamepads[gp.index] = gp;

                //buttons
                gp.buttons.forEach((button, index) => {
                    this.controllerButtonsPressed[index] = button.pressed;
                });

                //axes
                this.controllerAxes = gp.axes.slice();
            }
        }
    }

    public isControllerButtonPressed(buttonIndex: number): boolean {
        return !!this.controllerButtonsPressed[buttonIndex];
    }

    public getControllerAxis(axisIndex: number): number {
        return this.controllerAxes[axisIndex] || 0;
    }

}

export function getMouseWorldPosition(mouseNDC: THREE.Vector2, camera: THREE.Camera): THREE.Vector3 {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouseNDC, camera);

    const planeY = 0;
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -planeY);

    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectionPoint);

    return intersectionPoint;
}
