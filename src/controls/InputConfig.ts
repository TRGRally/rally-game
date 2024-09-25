export const InputConfig = {
    keyboard: {
        moveForward: ['w', 'arrowup'],
        moveBackward: ['s', 'arrowdown'],
        moveLeft: ['a', 'arrowleft'],
        moveRight: ['d', 'arrowright'],
        shoot: [' '],
    },
    mouse: {
        shootButton: 0, //mouse1
    },
    controller: {
        moveAxis: { x: 0, y: 1 }, //leftstick
        rotateAxis: { x: 2, y: 3 }, //rightstick
        shootButton: 0, //A
    },
};