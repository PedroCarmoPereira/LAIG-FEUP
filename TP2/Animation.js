class Animation{

    update(){
        var transfMatrix = mat4.create();
        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
        transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, angle*Math.PI/180);
        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
    }

    apply(){
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transformation);
        this.scene.popMatrix();
    }
}