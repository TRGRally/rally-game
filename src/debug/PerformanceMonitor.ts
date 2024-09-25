// src/debug/PerformanceMonitor.ts
import Stats from 'stats.js';

export class PerformanceMonitor {
    private stats: Stats;

    constructor() {
        this.stats = new Stats();
        this.stats.showPanel(0);

        this.stats.dom.style.position = 'absolute';
        this.stats.dom.style.left = '0px';
        this.stats.dom.style.top = '0px';

        document.body.appendChild(this.stats.dom);
    }

    begin() {
        this.stats.begin();
    }

    end() {
        this.stats.end();
    }
}
