class Piece extends CGFobject {
    constructor(scene, texture) {
        super(scene);
        this.rectangleTop = new MyRectangle(scene, 0, -0.3, 0.3, -0.3, 0.3);
        this.rectangleBot = new MyRectangle(scene, 1, -0.3, 0.3, -0.3, 0.3);
        this.rectangleSide1 = new MyRectangle(scene, 2, -0.3, 0.3, -0.2, 0.2);
        this.rectangleSide2 = new MyRectangle(scene, 3, -0.3, 0.3, -0.2, 0.2);
        this.rectangleSide3 = new MyRectangle(scene, 4, -0.3, 0.3, -0.2, 0.2);
        this.rectangleSide4 = new MyRectangle(scene, 5, -0.3, 0.3, -0.2, 0.2);
        this.material = new CGFappearance(scene);
        this.material.setAmbient(0.3, 0.3, 0.3, 1);
        this.material.setDiffuse(0.2, 0.2, 0.2, 1);
        this.material.setSpecular(0.2, 0.2, 0.2, 1);
        this.material.setShininess(0.2);
        this.material.loadTexture(texture);
        this.material.setTextureWrap('REPEAT', 'REPEAT');
    }

    changeTexture(texture) {
        this.material.loadTexture(texture);
    }
    
    display() {
        this.scene.pushMatrix();
        this.material.apply();
        this.rectangleSide1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.6);
        this.material.apply();
        this.rectangleSide2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.3, 0, 0.3);
        this.scene.rotate(90*Math.PI/180, 0, 1, 0);
        this.material.apply();
        this.rectangleSide3.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.3, 0, 0.3);
        this.scene.rotate(90*Math.PI/180, 0, 1, 0);
        this.material.apply();
        this.rectangleSide4.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0.2,0.3);
        this.scene.rotate(90*Math.PI/180, 1, 0, 0);
        this.material.apply();
        this.rectangleTop.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,-0.2,0.3);
        this.scene.rotate(90*Math.PI/180, 1, 0, 0);
        this.material.apply();
        this.rectangleBot.display();
        this.scene.popMatrix();
    }
}