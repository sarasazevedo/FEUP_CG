import { CGFobject, CGFscene } from "../lib/CGF.js";
import { MyDiamond } from "./MyDiamond.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";

export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.diamond = new MyDiamond(scene);
        this.triangle = new MyTriangle(scene);
        this.parallelogram = new MyParallelogram(scene);
        this.triangleSmall = new MyTriangleSmall(scene);
        this.triangleBig = new MyTriangleBig(scene);
    }

    display() {
        const deg2rad = Math.PI / 180;

        this.scene.pushMatrix();

        // Translação para centralizar o Tangram
        this.scene.translate(0, -1.4, 0); // Ajuste este valor conforme necessário

        // Parallelogram
        this.scene.pushMatrix();
        this.scene.translate(1.43, 0, 0);
        this.scene.rotate(45 * deg2rad, 0, 0, 1);
        this.scene.scale(1, -1, 1);
        this.scene.setColor(1, 1, 0, 1);
        this.parallelogram.display();
        this.scene.popMatrix();

        // Diamond
        this.scene.pushMatrix();
        this.scene.translate(-1.4, 1, 0);
        this.scene.setColor(0, 1, 0, 1);
        this.diamond.display();
        this.scene.popMatrix();

        // Triangle
        this.scene.pushMatrix();
        this.scene.translate(-2, 3.98, 0);
        this.scene.rotate(45 * deg2rad, 0, 0, 1);
        this.scene.setColor(1, 0.5, 1, 1);
        this.triangle.display();
        this.scene.popMatrix();

        // Small Triangle 1
        this.scene.pushMatrix();
        this.scene.rotate(180 * deg2rad, 0, 0, 1);
        this.scene.translate(0.4, -2, 0);
        this.scene.setColor(0.5, 0, 0.5, 1);
        this.triangleSmall.display();
        this.scene.popMatrix();

        // Big Triangle 1
        this.scene.pushMatrix();
        this.scene.rotate(-135 * deg2rad, 0, 0, 1);
        this.scene.translate(-1, -1, 0);
        this.scene.setColor(0, 0.5, 1, 1);
        this.triangleBig.display();
        this.scene.popMatrix();

        // Big Triangle 2
        this.scene.pushMatrix();
        this.scene.translate(2.83, 1.4, 0);
        this.scene.rotate(45 * deg2rad, 0, 0, 1);
        this.scene.setColor(1, 0.5, 0, 1);
        this.triangleBig.display();
        this.scene.popMatrix();

        // Small Triangle 2
        this.scene.pushMatrix();
        this.scene.scale(0.7, 0.7, 0.7);
        this.scene.translate(-3.42, 2.82, 0);
        this.scene.rotate(-45 * deg2rad, 0, 0, 1);
        this.scene.rotate(180 * deg2rad, 0, 0, 1);
        this.scene.setColor(1, 0, 0, 1);
        this.triangle.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}