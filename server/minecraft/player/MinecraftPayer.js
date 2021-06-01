import mc from "minecraft-protocol";

export default class MinecraftPlayer {
    constructor({ host, username, password, port, socket }) {
        this.player = mc.createClient({
            host,
            port,
            username,
            password,
        });
        this.socket = socket;
        this.registerSockets();
    }

    disconect() {
        this.player.end("");
    }

    registerSockets() {
        //player connected to the server
        this.player.on("success", (packet) => {
            console.log(packet);
        });
        this.player.on("disconnect", (packet) => {
            console.log(packet);
        });
        this.player.on("map_chunk_bulk", (packet) => {
            this.socket.emit("map_chunk_bulk", packet);
        });

        this.player.on("map_chunk", (packet) => {
            this.socket.emit("map_chunk", packet);
        });
        this.player.on("chat", (packet) => {
            // Listen for chat messages and echo them back.
            var jsonMsg = JSON.parse(packet.message);
            console.log(jsonMsg);
            if (
                jsonMsg.translate == "chat.type.announcement" ||
                jsonMsg.translate == "chat.type.text"
            ) {
                var username = jsonMsg.with[0].text;
                var msg = jsonMsg.with[1];
                if (username === this.player.username) return;
                this.player.write("chat", { message: msg.text });
            }
        });
    }
}
