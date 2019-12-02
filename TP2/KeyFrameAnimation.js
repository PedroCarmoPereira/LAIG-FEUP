class KeyFrameAnimation extends Animation{

    constructor(endTime, endProps){
        super();
        this.currentProps = new Props(0, 0, 0, 0, 0, 0, 1, 1, 1);
        this.endProps = endProps;
        this.startTime = 0;
        this.endTime = endTime;
        this.varProps = new Props((this.endProps.coords[0] - this.currentProps.coords[0])/(endTime),
                                  (this.endProps.coords[1] - this.currentProps.coords[1])/(endTime),
                                  (this.endProps.coords[2] - this.currentProps.coords[2])/(endTime),
                                  (this.endProps.angles[0] - this.currentProps.angles[0])/(endTime),
                                  (this.endProps.angles[1] - this.currentProps.angles[1])/(endTime),
                                  (this.endProps.angles[2] - this.currentProps.angles[2])/(endTime),
                                  (this.endProps.scales[0] - this.currentProps.scales[0])/(endTime),
                                  (this.endProps.scales[1] - this.currentProps.scales[1])/(endTime),
                                  (this.endProps.scales[2] - this.currentProps.scales[2])/(endTime)
                                );
        this.then = 0;  
        this.baseTransformation = mat4.create();
        this.baseTransformation = mat4.translate(this.baseTransformation, this.baseTransformation, [0,0,0]); 
        this.baseTransformation = mat4.rotateX(this.baseTransformation, this.baseTransformation, 0);
        this.baseTransformation = mat4.rotateY(this.baseTransformation, this.baseTransformation, 0);
        this.baseTransformation = mat4.rotateZ(this.baseTransformation, this.baseTransformation, 0);
        this.baseTransformation = mat4.scale(this.baseTransformation, this.baseTransformation, [1,1,1]); 
        this.done = false;
    }
    

    update(now){
        now *= 0.001;
        if (this.then == 0) this.then = now;
        var deltaTime = now - this.then;
        this.then = now;
        this.startTime += deltaTime;
        if(this.startTime < this.endTime){
            this.currentProps.coords[0] += this.varProps.coords[0] * deltaTime;
            this.currentProps.coords[1] += this.varProps.coords[1] * deltaTime;
            this.currentProps.coords[2] += this.varProps.coords[2] * deltaTime;

            this.currentProps.angles[0] += this.varProps.angles[0] * deltaTime;
            this.currentProps.angles[1] += this.varProps.angles[1] * deltaTime;
            this.currentProps.angles[2] += this.varProps.angles[2] * deltaTime;

            this.currentProps.scales[0] += this.varProps.scales[0] * deltaTime;
            this.currentProps.scales[1] += this.varProps.scales[1] * deltaTime;
            this.currentProps.scales[2] += this.varProps.scales[2] * deltaTime;

        }
    }
    
    apply(component){
        if (this.startTime < this.endTime){
            component.transformations = mat4.translate(component.transformations, this.baseTransformation, this.currentProps.coords);
            component.transformations = mat4.rotateX(component.transformations, component.transformations, this.currentProps.angles[0]*Math.PI/180);
            component.transformations = mat4.rotateY(component.transformations, component.transformations, this.currentProps.angles[1]*Math.PI/180);
            component.transformations = mat4.rotateZ(component.transformations, component.transformations, this.currentProps.angles[2]*Math.PI/180);
            component.transformations = mat4.scale(component.transformations, component.transformations, this.currentProps.scales);
        }

        else this.done = true;
    }

    updateProps(){
        this.varProps = new Props((this.endProps.coords[0] - this.currentProps.coords[0])/(this.endTime),
                                  (this.endProps.coords[1] - this.currentProps.coords[1])/(this.endTime),
                                  (this.endProps.coords[2] - this.currentProps.coords[2])/(this.endTime),
                                  (this.endProps.angles[0] - this.currentProps.angles[0])/(this.endTime),
                                  (this.endProps.angles[1] - this.currentProps.angles[1])/(this.endTime),
                                  (this.endProps.angles[2] - this.currentProps.angles[2])/(this.endTime),
                                  (this.endProps.scales[0] - this.currentProps.scales[0])/(this.endTime),
                                  (this.endProps.scales[1] - this.currentProps.scales[1])/(this.endTime),
                                  (this.endProps.scales[2] - this.currentProps.scales[2])/(this.endTime)
                                );                   
    }
}