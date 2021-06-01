import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import MinecraftPlayer from "./minecraft/player/MinecraftPayer.js";
import cors from "cors";

class Main {
    constructor() {
        this.expressApp = express();
        this.server = http.createServer(this.expressApp);
        this.io = new SocketServer(this.server, {
            path: "/player",
        });
        this.connectedPlayer = [];
        this.#startServers();
    }

    #startServers() {
        this.expressApp.use(express.json());
        this.expressApp.use(cors());
        this.expressApp.get("/", (req, res) => {
            res.json({
                success: "hello world",
            });
        });

        this.io.on("connection", (socket) => {
            console.log("a user connected");
            this.connectedPlayer.push({
                username: socket.handshake.query.username,
                player: new MinecraftPlayer({
                    host: "192.168.0.22",
                    username: "testUser",
                    socket,
                }),
            });

            socket.on("disconect", () => {
                const player = this.connectedPlayer.find(
                    (p) => p.username == socket.handshake.query.username
                );
                player.disconect();
            });
        });

        this.server.listen(1234, () => {
            console.log("listening on *:1234");
        });
    }
}

const instance = new Main();
