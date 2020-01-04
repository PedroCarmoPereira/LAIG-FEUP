class Plane extends CGFobject {

    constructor(scene, U, V) {
        super(scene);
        this.scene = scene;
        this.U = U;
        this.V = V;
        this.initBuffers();
    };

    initBuffers(){

        var nurbsSurface = new CGFnurbsSurface(1, 1, [[[-1.0, -1.0, 0.0, 1 ],[-1.0,  1.0, 0.0, 1 ]], [[ 1.0, -1.0, 0.0, 1 ],[ 1.0,  1.0, 0.0, 1 ]]]);

        this.obj = new CGFnurbsObject(this.scene, this.U, this.V, nurbsSurface);
    }

    display(){
        this.obj.display();
    }


}