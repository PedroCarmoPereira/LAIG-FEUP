class GamePiece extends CGFobject {
    constructor(scene, texture, coords, id) {
        super(scene);
        this.gamepiece = new Piece(scene, texture);
        this.id = id;
        this.coords = coords;
        this.varcoords = [0,0,0];
        this.animation = null;
        this.transformation = mat4.create();
        this.transformation = mat4.translate(this.transformation, this.transformation, this.coords); 
        this.baseTransformation = mat4.create();
        this.baseTransformation = mat4.translate(this.baseTransformation, this.baseTransformation, [0,0,0]); 
        this.startTime = 0;
        this.then = 0;
        this.check = false;
    }

    addAnimation(x, y, z, endTime) {
        this.endTime = endTime;
        this.x = x;
        this.y = y;
        this.z = z;
        this.animation = [(x - this.coords[0]) /endTime, (y+1.5 - this.coords[1]) /endTime, (z - this.coords[2])/endTime];
    }

    update(now){
        if(this.animation != null){
            now *= 0.001;
            if (this.then == 0) this.then = now;
            var deltaTime = now - this.then;
            this.then = now;
            this.startTime += deltaTime;
            if(this.startTime < this.endTime/2){
                this.coords[0] += this.animation[0] * deltaTime;
                this.coords[1] += this.animation[1] * deltaTime;
                this.coords[2] += this.animation[2] * deltaTime;
            }
            else if(this.startTime >= this.endTime/2 && this.startTime <= this.endTime){
                if(this.check == false){
                    this.animation = [(this.x - this.coords[0])/this.endTime*2 , (this.y - this.coords[1])/this.endTime*2, (this.z - this.coords[2])/this.endTime*2];
                    this.check = true;
                }
                this.coords[0] += this.animation[0] * deltaTime;
                this.coords[1] += this.animation[1] * deltaTime;
                this.coords[2] += this.animation[2] * deltaTime;
            }
            else if(this.startTime > this.endTime){
                this.animation = null;
                this.startTime = 0;
                this.then = 0;
                this.check = false;
            }
        }
    }

    apply() {
        this.transformation = mat4.translate(this.transformation, this.baseTransformation, this.coords) 
    }

    display() {

        this.apply();

        this.scene.pushMatrix();
        this.scene.multMatrix(this.transformation);
        this.scene.registerForPick(this.id, this);
        this.gamepiece.display();
        this.scene.popMatrix();
    }
}