class cylinder2 extends CGFobject {

    constructor(scene, slices, stacks, height, r1, r2) {
        super(scene);
        this.scene = scene;
        this.stacks = stacks;
        this.slices = slices;
        this.height = height;
        this.r1 = r1;
        this.r2 = r2;
        this.initBuffers();
    };

    initBuffers(){
        console.log(this.height);
        var nurbsSurface = new CGFnurbsSurface(3, 1, [
            [
                [-this.r2, 0.0, 0.0, 1 ],
                [-this.r1,  this.height, 0.0, 1 ] 
            ],

            [ 
                [ -this.r2, 0.0, this.r2*1.4, 1 ],
                [ -this.r1,  this.height, this.r1*1.4, 1 ]							 
            ],

            [ 
                [ this.r2, 0.0, this.r2*1.4, 1 ],
                [ this.r1,  this.height, this.r1*1.4, 1 ]							 
            ],
           
            [
                [ this.r2, 0.0, 0.0, 1 ],
                [ this.r1, this.height, 0.0, 1 ]							 
            ]
        ]);

        this.obj1 = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface);

        var nurbsSurface = new CGFnurbsSurface(3, 1, [
            [
                [-this.r2, 0.0, 0.0, 1 ],
                [-this.r1,  this.height, 0.0, 1 ], 
            ],

            [ 
                [ -this.r2, 0.0, -this.r2*1.4, 1 ],
                [ -this.r1,  this.height, -this.r1*1.4, 1 ],							 
            ],

            [ 
                [ this.r2, 0.0, -this.r2*1.4, 1 ],
                [ this.r1,  this.height, -this.r1*1.4, 1 ],							 
            ],
           
            [
                [ this.r2, 0.0, 0.0, 1 ],
                [ this.r1,  this.height, 0.0, 1 ],							 
            ]
        ]);

        this.obj2 = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface);
    }

    display(){
        this.obj1.display();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.obj1.display();
        this.scene.popMatrix();
        
        this.obj2.display();
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.obj2.display();
        this.scene.popMatrix();
        
    }


}