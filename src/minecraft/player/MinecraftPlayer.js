import { io } from "socket.io-client";
import ChunkPacketListener from "./packets/ChunkPacketListener.js";

export default class MinecraftPlayer {
    constructor(scene) {
        this.scene = scene;
        this.player = io("ws://localhost:1234", {
            reconnectionDelayMax: 10000,
            path: "/player",
            auth: {
                token: "123",
            },
            query: {
                username: "testUser",
            },
        });
        this.player.connect();
        this.loadedChunks = [];

        console.log("player has ben inited");
        this.initPacketListeners();
    }

    tick() {}

    initPacketListeners() {
        this.chunkPacketListener = new ChunkPacketListener(
            this.player,
            this.loadedChunks,
            this.scene
        );
    }
}
