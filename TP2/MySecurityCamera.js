class MySecurityCamera {

    constructor(scene, id, x1, x2, y1, y2){
        this.scene = scene;
        this.rectangle = new MyRectangle(scene, id, x1, x2, y1, y2);
        this.shader = new CGFshader(this.scene.gl,"shaders/rectangle.vert", "shaders/rectangle.frag");
        this.shader.setUniformsValues({ uSamplerTex: 1 });
    }

    display(){
        this.scene.setActiveShader(this.shader);
        this.scene.texrtt.bind();
        this.rectangle.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}