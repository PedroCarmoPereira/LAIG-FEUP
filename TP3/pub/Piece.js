class Piece extends CGFobject {
    constructor(scene, texture) {
        super(scene);
        this.texture = new CGFtexture(this.scene, texture);
        this.rectangleTop = new MyRectangle(scene, 0, -0.5, 0.5, -0.5, 0.5);
        this.rectangleBot = new MyRectangle(scene, 1, -0.5, 0.5, -0.5, 0.5);
        this.rectangleSide1 = new MyRectangle(scene, 2, -0.5, 0.5, -0.2, 0.2);
        this.rectangleSide2 = new MyRectangle(scene, 3, -0.5, 0.5, -0.2, 0.2);
        this.rectangleSide3 = new MyRectangle(scene, 4, -0.5, 0.5, -0.2, 0.2);
        this.rectangleSide4 = new MyRectangle(scene, 5, -0.5, 0.5, -0.2, 0.2);
    }
    display() {
        this.scene.pushMatrix();
        this.rectangleSide1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1);
        this.rectangleSide2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0.5);
        this.scene.rotate(90*Math.PI/180, 0, 1, 0);
        this.rectangleSide3.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0.5);
        this.scene.rotate(90*Math.PI/180, 0, 1, 0);
        this.rectangleSide4.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0.2,0.5);
        this.scene.rotate(90*Math.PI/180, 1, 0, 0);
        this.rectangleTop.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,-0.2,0.5);
        this.scene.rotate(90*Math.PI/180, 1, 0, 0);
        this.rectangleBot.display();
        this.scene.popMatrix();
    }
}