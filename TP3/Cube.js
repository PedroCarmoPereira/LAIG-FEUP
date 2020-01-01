class Cube extends CGFobject {
    constructor(scene, texture, x, y) {
        super(scene);
        this.texture = new CGFtexture(this.scene, texture);
        this.x = x;
        this.y = y;
        this.rectangleTop = new MyRectangle(scene, 0, -x, x, -x, x);
        this.rectangleBot = new MyRectangle(scene, 1, -x, x, -x, x);
        this.rectangleSide1 = new MyRectangle(scene, 2, -x, x, -y, y);
        this.rectangleSide2 = new MyRectangle(scene, 3, -x, x, -y, y);
        this.rectangleSide3 = new MyRectangle(scene, 4, -x, x, -y, y);
        this.rectangleSide4 = new MyRectangle(scene, 5, -x, x, -y, y);
    }
    display() {
        this.scene.pushMatrix();
        this.rectangleSide1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.x*2);
        this.rectangleSide2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-this.x, 0, this.x);
        this.scene.rotate(90*Math.PI/180, 0, 1, 0);
        this.rectangleSide3.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.x, 0, this.x);
        this.scene.rotate(90*Math.PI/180, 0, 1, 0);
        this.rectangleSide4.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,this.y,this.x);
        this.scene.rotate(90*Math.PI/180, 1, 0, 0);
        this.rectangleTop.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,-this.y,this.x);
        this.scene.rotate(90*Math.PI/180, 1, 0, 0);
        this.rectangleBot.display();
        this.scene.popMatrix();
    }
}