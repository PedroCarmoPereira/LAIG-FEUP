class Board extends CGFobject {
    constructor(scene) {
        super(scene);
        this.line0 = new Line(scene, 'textures/piece1.jpg', 'textures/piece2.jpg', 1);
        this.line1 = new Line(scene, 'textures/piece2.jpg', 'textures/piece1.jpg', 2);
        this.line2 = new Line(scene, 'textures/piece1.jpg', 'textures/piece2.jpg', 3);
        this.line3 = new Line(scene, 'textures/piece2.jpg', 'textures/piece1.jpg', 4);
        this.line4 = new Line(scene, 'textures/piece1.jpg', 'textures/piece2.jpg', 5);
        this.line5 = new Line(scene, 'textures/piece2.jpg', 'textures/piece1.jpg', 6);
    }
    display() {
        this.scene.pushMatrix();
        this.line0.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1,0,0);
        this.line1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2,0,0);
        this.line2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(3,0,0);
        this.line3.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(4,0,0);
        this.line4.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(5,0,0);
        this.line5.display();
        this.scene.popMatrix();
    }
}