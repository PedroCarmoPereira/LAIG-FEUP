class Line extends CGFobject {
    constructor(scene, texture1, texture2, y) {
        super(scene);
        this.y = y;
        this.piece0 = new BoardPiece(scene, texture1);
        this.piece1 = new BoardPiece(scene, texture2);
        this.piece2 = new BoardPiece(scene, texture1);
        this.piece3 = new BoardPiece(scene, texture2);
        this.piece4 = new BoardPiece(scene, texture1);
        this.piece5 = new BoardPiece(scene, texture2);
    }
    display() {
        this.scene.pushMatrix();
        this.scene.registerForPick(1 + '' + this.y, this.piece0);
        this.piece0.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,1);
        this.scene.registerForPick(2 + '' + this.y, this.piece1);
        this.piece1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,2);
        this.scene.registerForPick(3 + '' + this.y, this.piece2);
        this.piece2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,3);
        this.scene.registerForPick(4 + '' + this.y, this.piece3);
        this.piece3.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,4);
        this.scene.registerForPick(5 + '' + this.y, this.piece4);
        this.piece4.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,5);
        this.scene.registerForPick(6 + '' + this.y, this.piece5);
        this.piece5.display();
        this.scene.popMatrix();
    }
}