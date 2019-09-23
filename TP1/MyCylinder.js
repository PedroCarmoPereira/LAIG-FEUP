class MyCylinder extends CGFobject {

    constructor(scene, id, slices, stacks, height, r1, r2) {
        super(scene);
        this.id = id;
        this.r1 = r1;
        this.r2 = r2;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        console.log( "Stackerino = " + this.stacks);
        this.initBuffers();
    };

    initBuffers(){

	    this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var angle = 2*Math.PI/this.slices;
        let r1 = this.r1;
        let r2 = this.r2;
        let variancia = (r2 - r1)/this.stacks;

        for(let j = 0; j <= this.stacks; j++){
            for(let i= 0; i < this.slices; i++){
                
                this.vertices.push(r1*Math.cos(angle * i), r1*Math.sin(angle * i), this.height * j*1/this.stacks);

                this.normals.push(Math.cos(angle * i), Math.sin(angle * i), 0);

                this.texCoords.push(i/this.slices, j/this.stacks);
          }
        r1 += variancia;
        }

        var numPontos = this.slices * this.stacks;

        for(let i = 0; i < numPontos; i++){
            if((i+1)%this.slices==0){

                this.indices.push(i,i+1, i+this.slices);
                this.indices.push(i+this.slices, i+1, i);

                this.indices.push(i,i+1-this.slices, i+1);
                this.indices.push(i+1,i+1-this.slices, i);
            }
            else {

                this.indices.push(i, i + 1, i + 1 + this.slices);
                this.indices.push(i + 1 + this.slices, i + 1, i);

                this.indices.push(i, i + 1 + this.slices, i + this.slices);
                this.indices.push(i + this.slices, i + 1 + this.slices, i);
            }  
        }

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};


}