class MySecurityCamera {

    constructor(scene, id, x1, x2, y1, y2, shader){
        this.scene = scene;
        this.rectangle = new MyRectangle(scene, id, x1, x2, y1, y2);
        this.shader = shader;
    }

    display(){
        this.scene.pushMatrix();
        this.rectangle.display();
        this.scene.setActiveShader(this.shader);
        this.scene.popMatrix();
    }
}