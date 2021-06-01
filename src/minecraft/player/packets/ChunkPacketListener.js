import primarineChunk from "prismarine-chunk";
import {
    BoxBufferGeometry,
    BufferGeometry,
    MeshBasicMaterial,
    Mesh,
} from "three";
import Vec3 from "vec3";

export default class ChunkPacketListener {
    constructor(player, loadedChunks, scene) {
        this.player = player;
        this.scene = scene;
        this.chunkConstructor = primarineChunk("1.16");
        this.loadedChunks = loadedChunks;
        this.chunkGeometries = new ChunkGeometries();
        this.material = new MeshBasicMaterial({ color: "red" });
        this.init();
    }

    renderChunk(chunk) {
        if (!chunk) {
            return null;
        }
        if (chunk.rendered) {
            console.log("chunk aready added to the scene");
            return null;
        }

        const chunkGeometry = new BufferGeometry();

        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                for (let y = 0; y < 256; y++) {
                    const block = chunk.getBlock(new Vec3(x, y, z));
                    if (block.type == 0) {
                        //air block
                        console.log("airBlock");
                        continue;
                    }
                    chunkGeometry.merge(
                        this.chunkGeometries.getBlockGeometry(
                            block.type,
                            x,
                            y,
                            z
                        )
                    );
                }
            }
        }

        const chunkMesh = new Mesh(chunkGeometry, this.material);
        this.scene.add(chunkMesh);
    }

    init() {
        this.player.on("map_chunk", (packet) => {
            const chunk = new this.chunkConstructor();
            chunk.load(Buffer.from(packet.chunkData), packet.bitMap);
            this.loadedChunks.push({
                x: packet.x,
                z: packet.z,
                rendered: false,
                chunk,
            });
        });
        this.player.on("map_chunk_bulk", (packet) => {
            console.log(packet);
        });
    }
}

class ChunkGeometries {
    constructor() {
        this.blockGeometry = new BoxBufferGeometry(1, 1, 1);
    }

    getBlockGeometry(type, x, y, z) {
        return this.blockGeometry.clone().translate(x, y, z);
    }
}
