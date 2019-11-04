class cylinder2 extends CGFobject {

    constructor(scene, stacks, slices) {
        super(scene);
        this.scene = scene;
        this.stacks = stacks;
        this.slices = slices;
        this.initBuffers();
    };

    initBuffers(){

        var nurbsSurface = new CGFnurbsSurface(3, 1, [
            [
                [-1.0, -1.0, 0.0, 1 ],
                [-1.0,  1.0, 0.0, 1 ] 
            ],

            [ 
                [ -1.0, -1.0, 1.4, 1 ],
                [ -1.0,  1.0, 1.4, 1 ]							 
            ],

            [ 
                [ 1.0, -1.0, 1.4, 1 ],
                [ 1.0,  1.0, 1.4, 1 ]							 
            ],
           
            [
                [ 1.0, -1.0, 0.0, 1 ],
                [ 1.0,  1.0, 0.0, 1 ]							 
            ]
        ]);

        this.obj1 = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface);

        var nurbsSurface = new CGFnurbsSurface(3, 1, [
            [
                [-1.0, -1.0, 0.0, 1 ],
                [-1.0,  1.0, 0.0, 1 ], 
            ],

            [ 
                [ -1.0, -1.0, -1.4, 1 ],
                [ -1.0,  1.0, -1.4, 1 ],							 
            ],

            [ 
                [ 1.0, -1.0, -1.4, 1 ],
                [ 1.0,  1.0, -1.4, 1 ],							 
            ],
           
            [
                [ 1.0, -1.0, 0.0, 1 ],
                [ 1.0,  1.0, 0.0, 1 ],							 
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