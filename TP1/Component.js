function isPrimitive(obj){
    if (obj instanceof MyRectangle || obj instanceof MyCylinder || obj instanceof MySphere
        || obj instanceof MyTorus || obj instanceof MyTriangle) return true;

    return false;
}

class Component extends CGFobject {

    constructor(scene, transformations, materials, textures){
        super(scene);
        this.scene = scene;
        this.transformations = transformations;
        this.materials = materials;
        this.textures = textures;
    }

    setParent(parent){
        this.parent = parent;
    }

    setChildren(children){
        this.children = children;
    }

    display(){
        for(let k = 0; k < this.children.length; k++){
            this.scene.pushMatrix();
            if(this.transformations)
                this.scene.multMatrix(this.transformations);

            if(this.textures == 'inherit'){  
                this.textures = this.parent;
                for(let k = 0; k < this.children.length; k++){
                    if(!isPrimitive(this.children[k]))
                        this.children[k].setParent(this.textures);
                }
                if(this.textures != 'none')
                    this.materials[0].setTexture(this.textures[0]); 
            } 

            if(this.textures != 'none')
                this.materials[0].setTexture(this.textures[0]);    
            this.materials[0].apply();
            this.children[k].display();
            this.scene.popMatrix();
        }
    }
}

