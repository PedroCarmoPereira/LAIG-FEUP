function isPrimitive(obj){
    if (obj instanceof MyRectangle || obj instanceof MyCylinder || obj instanceof MySphere
        || obj instanceof MyTorus || obj instanceof MyTriangle ) return true;

    return false;
}

class Component extends CGFobject {

    constructor(scene, name, id, transformations, materials, textures, children, coords, animations){
        super(scene);
        this.scene = scene;
        this.name = name;
        this.transformations = transformations;
        this.materials = materials;
        this.textures = textures;
        this.children = children;
        this.coords = coords;
        this.anims = animations;
        if(animations == undefined) this.anims = [];
        this.ai = 0;
        this.id = id;
        if(!this.transformations) this.transformations = mat4.create();
    }

    display(mat, tex){
        
        if (this.ai < this.anims.length){
            if (!this.anims[this.ai].done) this.anims[this.ai].apply(this);
            else {
                this.ai++;
                if (this.ai < this.anims.length){
                    this.anims[this.ai].currentProps = this.anims[this.ai - 1].currentProps;
                    this.anims[this.ai].updateProps();
                }
            }
        }
        
        
        
        for(let k = 0; k < this.children.length; k++){
            this.scene.pushMatrix();
            if(this.transformations)
            this.scene.multMatrix(this.transformations);

            var matIndex = this.scene.matCnt % this.materials.length;
            if(this.materials[matIndex] != 'inherit'){   
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
            }
                
            if (!( this.children[k] instanceof KeyFrameAnimation) && this.children[k] != undefined)this.children[k].display(this.materials, this.textures);
            this.scene.popMatrix();
        }
    }
}

