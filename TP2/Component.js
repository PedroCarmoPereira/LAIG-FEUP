function isPrimitive(obj){
    /*if (obj instanceof MyRectangle || obj instanceof MyCylinder || obj instanceof MySphere
        || obj instanceof MyTorus || obj instanceof MyTriangle) return true;

    return false;*/
}

class Component extends CGFobject {

    constructor(scene, transformations, materials, textures, children, coords){
        super(scene);
        this.scene = scene;
        this.transformations = transformations;
        this.materials = materials;
        this.textures = textures;
        this.children = children;
        this.coords = coords;
    }

    display(mat, tex){
        for(let k = 0; k < this.children.length; k++){
            this.scene.pushMatrix();
            if(this.transformations)
                this.scene.multMatrix(this.transformations);
            
            if(isPrimitive(this.children[k]))
                this.children[k].updateTexCoords(this.coords[0], this.coords[1]);

            //var matIndex = this.scene.matCnt % this.materials.length;
            /*if(this.materials[matIndex] != 'inherit'){   
                if(this.textures == 'none'){
                    this.materials[matIndex].setTexture();
                } 
                
                else if(this.textures == 'inherit'){
                    this.textures = tex;
                }

                else if(this.textures != 'inherit') 
                    this.materials[matIndex].setTexture(this.textures[0]); 
            
                    this.materials[matIndex].apply();
            }

            else if(this.materials[matIndex] == 'inherit'){
                this.materials = mat;
                if(this.textures == 'none'){
                    this.materials[matIndex].setTexture();
                }  

                else if(this.textures == 'inherit'){
                    this.textures = tex;
                }

                else if(this.textures != 'inherit') 
                    this.materials[matIndex].setTexture(this.textures[0]); 
            
                if(this.materials != 'inherit')
                    this.materials[matIndex].apply();  
            }*/
                
            this.children[k].display(this.materials, this.textures);
            this.scene.popMatrix();
        }
    }
}

