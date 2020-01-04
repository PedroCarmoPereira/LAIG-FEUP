class Patch extends CGFobject {

    constructor(scene, U, V, degreeU, degreeV, controlvertexes) {
        super(scene);
        this.scene = scene;
        this.U = U;
        this.V = V;
        this.degreeU = degreeU;
        this.degreeV = degreeV;
        this.controlvertexes = controlvertexes;
        this.initBuffers();
    };

    initBuffers(){

        var nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.controlvertexes);

        this.obj = new CGFnurbsObject(this.scene, this.U, this.V, nurbsSurface);
    }

    display(){
        this.obj.display();
    }


}