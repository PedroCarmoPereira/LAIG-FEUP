class MySecurityCamera {

    constructor(scene, id, x1, x2, y1, y2){
        this.scene = scene;
        this.rectangle = new MyRectangle(scene, id, x1, x2, y1, y2);
        this.shader = new CGFshader(this.scene.gl,"shaders/rectangle.vert", "shaders/rectangle.frag");
        this.shader.setUniformsValues({ uSamplerTex: 1 });
    }

    display(){
        this.scene.setActiveShader(this.shader);
        this.scene.texrtt.bind(0);
        this.rectangle.display();
        this.scene.texrtt.unbind(0);
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    update(time){
        this.shader.setUniformsValues({time: time / 200 % 1000});
    }
}