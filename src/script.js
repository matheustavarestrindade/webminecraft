import { Buffer } from "buffer/"; // note: the trailing slash is important!
import "./style.css";
import {
    Clock,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import MinecraftPlayer from "./minecraft/player/MinecraftPlayer";
window.Buffer = Buffer;

class OnlineMinecraft {
    constructor() {
        this.setupDebug();
        this.setupTextures();
        this.player = new MinecraftPlayer(this.scene);
    }

    tick() {
        /**
         * Animate
         */
        const elapsedTime = this.clock.getElapsedTime();

        // Update controls
        this.controls.update();
        if (this.player) this.player.tick();
        // Render
        this.renderer.render(this.scene, this.camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(() => this.tick());
    }

    setupScene() {
        this.canvas = document.querySelector("canvas.webgl");
        this.scene = new Scene();

        /**
         * Sizes
         */
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        window.addEventListener("resize", () => {
            // Update sizes
            this.sizes.width = window.innerWidth;
            this.sizes.height = window.innerHeight;

            // Update camera
            this.camera.aspect = this.sizes.width / this.sizes.height;
            this.camera.updateProjectionMatrix();

            // Update renderer
            this.renderer.setSize(this.sizes.width, this.sizes.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        /**
         * Camera
         */
        // Base camera
        this.camera = new PerspectiveCamera(
            75,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        );
        this.camera.position.set(0.25, -0.25, 1);
        this.scene.add(this.camera);

        // Controls
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;

        /**
         * Renderer
         */
        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
        });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.clock = new Clock();
        this.tick();
    }

    setupTextures() {
        /**
         * Textures
         */
        this.textureLoader = new TextureLoader();

        /*
        
            After loading textures setup the scene

        */
        this.setupScene();
    }

    setupDebug() {
        /**
         * DAT.GUI debug panel
         */
        this.gui = new dat.GUI();
    }
}

const instance = new OnlineMinecraft();
