class MySphere extends CGFobject {

    constructor(scene, id, slices, stacks, r1) {
        super(scene);
        this.id = id;
        this.r1 = r1;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    };

    initBuffers(){

	    this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var theta = 2*Math.PI/this.slices;
        var phi = Math.PI/this.stacks;
        let r1 = this.r1;

        for(let j = 0; j <= this.stacks; j++){
            for(let i= 0; i < this.slices; i++){
                
                this.vertices.push(r1*Math.cos(theta*i)*Math.sin(phi*j), r1*Math.sin(phi*j)*Math.sin(theta*i), r1*Math.cos(phi*j));

                this.normals.push(Math.cos(theta*i)*Math.sin(phi*j), Math.sin(phi*j)*Math.sin(theta*i), Math.cos(phi*j));

                this.texCoords.push(i/this.slices, j/this.stacks);
          }
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