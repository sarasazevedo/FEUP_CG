import { CGFobject, CGFscene, CGFappearance, CGFtexture } from "../lib/CGF.js";
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
        this.triangleSmall1 = new MyTriangleSmall(scene);
        this.triangleSmall2 = new MyTriangleSmall(scene);
        this.triangleBig1 = new MyTriangleBig(scene);
        this.triangleBig2 = new MyTriangleBig(scene);

        this.initMaterials();
    }

    initMaterials() {
        this.MytangramTexture = new CGFappearance(this.scene);
        this.MytangramTexture.setAmbient(1, 1, 1, 1);
        this.MytangramTexture.setDiffuse(1, 1, 1, 1);
        this.MytangramTexture.setSpecular(1, 1, 1, 1);
        this.MytangramTexture.setShininess(10.0);
        
        // Carregar e aplicar a textura
        this.tangramTexture = new CGFtexture(this.scene, 'images/tangram.png');
        this.MytangramTexture.setTexture(this.tangramTexture);
        this.MytangramTexture.setTextureWrap('REPEAT', 'REPEAT');


        //------ Textures


/*
        this.green = new CGFappearance(this.scene);
        this.green.setAmbient(0, 1, 0, 1);
        this.green.setDiffuse(0, 1, 0, 1);
        this.green.setSpecular(0, 1, 0, 1);
        this.green.setShininess(10.0);

        this.orange = new CGFappearance(this.scene);
        this.orange.setAmbient(1, 0.5, 0, 1);
        this.orange.setDiffuse(1, 0.5, 0, 1);
        this.orange.setSpecular(1, 0.5, 0, 1);
        this.orange.setShininess(10.0);

        this.blue = new CGFappearance(this.scene);
        this.blue.setAmbient(0, 0.5, 1, 1);
        this.blue.setDiffuse(0, 0.5, 1, 1);
        this.blue.setSpecular(0, 0.5, 1, 1);
        this.blue.setShininess(10.0);

        this.purple = new CGFappearance(this.scene);
        this.purple.setAmbient(0.5, 0, 0.5, 1);
        this.purple.setDiffuse(0.5, 0, 0.5, 1);
        this.purple.setSpecular(0.5, 0, 0.5, 1);
        this.purple.setShininess(10.0);

        this.yellow = new CGFappearance(this.scene);
        this.yellow.setAmbient(1, 1, 0, 1);
        this.yellow.setDiffuse(1, 1, 0, 1);
        this.yellow.setSpecular(1, 1, 0, 1);
        this.yellow.setShininess(10.0);

        this.red = new CGFappearance(this.scene);
        this.red.setAmbient(1, 0, 0, 1);
        this.red.setDiffuse(1, 0, 0, 1);
        this.red.setSpecular(1, 0, 0, 1);
        this.red.setShininess(10.0);

        this.pink = new CGFappearance(this.scene);
        this.pink.setAmbient(1, 0.5, 1, 1);
        this.pink.setDiffuse(1, 0.5, 1, 1);
        this.pink.setSpecular(1, 0.5, 1, 1);
        this.pink.setShininess(10.0);
        */
        
    }

    display() {
        const deg2rad = Math.PI / 180;

        this.scene.pushMatrix();


        // Parallelogram
        this.scene.pushMatrix();
        this.scene.translate(1.43, 0, 0);
        this.scene.rotate(45 * deg2rad, 0, 0, 1);
        this.scene.scale(1, -1, 1);
        this.MytangramTexture.apply();
        //this.yellow.apply();
        this.parallelogram.display();
        this.scene.popMatrix();

        // Diamond
        this.scene.pushMatrix();
        this.scene.translate(-1.4, 1, 0);
        //this.green.apply();
        this.MytangramTexture.apply();
        this.diamond.display();
        this.scene.popMatrix();

        // Triangle
        this.scene.pushMatrix();
        this.scene.translate(-2, 3.98, 0);
        this.scene.rotate(45 * deg2rad, 0, 0, 1);
        //this.pink.apply();
        this.triangle.changeTexCoords(false);
        this.MytangramTexture.apply();
        this.triangle.display();
        this.scene.popMatrix();

        // Small Triangle 1
        this.scene.pushMatrix();
        this.scene.rotate(180 * deg2rad, 0, 0, 1);
        this.scene.translate(0.4, -2, 0);
        //this.purple.apply();
        this.MytangramTexture.apply();
        this.triangleSmall1.display();
        this.scene.popMatrix();

        // Big Triangle 1
        this.scene.pushMatrix();
        this.scene.rotate(-135 * deg2rad, 0, 0, 1);
        this.scene.translate(-1, -1, 0);
        //this.blue.apply();
        this.MytangramTexture.apply();
        this.triangleBig1.changeTexCoords(false);
        this.triangleBig1.display();
        this.scene.popMatrix();

        // Big Triangle 2
        this.scene.pushMatrix();
        this.scene.translate(2.83, 1.4, 0);
        this.scene.rotate(45 * deg2rad, 0, 0, 1);
        //this.orange.apply();
        this.MytangramTexture.apply();
        this.triangleBig2.changeTexCoords(true);
        this.triangleBig2.display();
        this.scene.popMatrix();

        // Small Triangle 2
        this.scene.pushMatrix();
        this.scene.scale(0.7, 0.7, 0.7);
        this.scene.translate(-3.42, 2.82, 0);
        this.scene.rotate(-45 * deg2rad, 0, 0, 1);
        this.scene.rotate(180 * deg2rad, 0, 0, 1);
        this.MytangramTexture.apply();
        this.triangle.changeTexCoords(true);
        //this.red.apply();
        this.triangle.display();


        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}