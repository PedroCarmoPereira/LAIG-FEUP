class Component extends CGFobject {

    constructor(scene, transformations, materials, textures, children){
        super(scene);
        this.scene = scene;
        this.transformations = transformations;
        this.materials = materials;
        this.textures = textures;
        this.children = children;
    }

    display(){
        for(let k = 0; k < this.children.length; k++){
            this.scene.pushMatrix();
            if(this.transformations)
                this.scene.multMatrix(this.transformations);
            this.materials[0].setTexture(this.textures[0]);
            this.materials[0].apply();
            this.children[k].display();
            this.scene.popMatrix();
        }
    }
}

