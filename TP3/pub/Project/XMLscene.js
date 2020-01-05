var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.currSecCamID = "";
        this.modes = 0;
        this.undo = false;
        this.redwins = 0;
        this.bluewins = 0;
        this.timer = 0;
        this.movies = false;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;
        this.matCnt = 0;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.viewIDs = [];
        this.viewIDs.push(this.currCameraID);
        this.modes = [0, 1, 2, 3, 4, 5];
        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);
        this.setLights = [];

        this.texrtt = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);
        this.securityCam = new MySecurityCamera(this, -1, 0.5, 1, -1, -0.5);
        this.gamepiece = null;
        this.boardpiece = null;
        this.gamepieceId = null;
        this.boardpieceId = null;
        this.round = 0;
        this.time = 0;
        this.time2 = 0;
        this.time3 = 0;
        this.undoMove = [];
        this.currAngleCam = 0;
        this.movie = [];
        this.movieCount = 0;
        this.value1;
        this.value2;
        this.value3;
        this.value4;
        this.value5;
        this.time4 = 0;
        this.counter = 0;
        this.sceneID = "scene1.xml";
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    updateCamera(){
        if(this.camera != this.views[this.currCameraID]){
            if(this.currAngleCam < Math.PI){
                this.camera.orbit(CGFcameraAxis.y, Math.PI / 50);
                this.currAngleCam += Math.PI/50;
            }
            else {
                this.currAngleCam = 0;
                this.camera.orbit(CGFcameraAxis.y, Math.PI);
                this.camera = this.views[this.currCameraID];
                this.interface.setActiveCamera(this.camera);
            }
        }
    }

    updateSecurityCamera(){
        this.securityView = this.views[this.currSecCamID];
    }

    changeMode(){
        document.getElementById("gametype").value = this.modes;
    }

    undoo() {
        if(this.undo != 0){
            this.undo = false;
            if(this.undoMove.length != 0 && document.getElementById("undo").disabled == false){
                if(this.undoMove[0] == 'Move'){
                    this.undoMove[1].undo(this.undoMove[2]);
                    this.round --;
                    undo();
                }
                else if(this.undoMove[0] == 'Texture' && document.getElementById("undo").disabled == false){
                    this.undoMove[1].changeTexture(this.undoMove[2]);
                    this.round --;
                    undo();
                }
            }
        }
    }

    moviess() {
        if(this.movies != 0){
        for(let i = 0; i < 36; i++){
            this.gamepiece = null;
            this.boardpieceId = null;
            message = null;
            botmoves = '[]';
            this.time2 = 0;
            if(i < 18){
                this.graph.gamepieces[i].reset2([i*1- (Math.floor(i/6)*6),0,-2 - (Math.floor(i/6))]);
            }
            else if(i >= 18){
                this.graph.gamepieces[i].reset2([(i-18)*1 - (Math.floor((i-18)/6)*6),0,8 + (Math.floor((i-18)/6))]);
            }
            this.timer = 0;
        }
    }
    }

    update(t){
        for(var comp in this.graph.components){
            if (this.graph.components[comp].ai < this.graph.components[comp].anims.length)
            this.graph.components[comp].anims[this.graph.components[comp].ai].update(t);
        }
        this.securityCam.update(t);
        for(let i = 0; i < 36; i++){
            this.graph.gamepieces[i].update(t);
        }
        if((this.modes == 3 || this.modes == 4 || this.modes == 5) && botmoves == '[]'){
            if(this.time == 0){
                this.time = t;
            }
            if(this.time+3000 < t){
                makeRequest();
                this.time = t;
            }
        }
        if(this.graph.win == true){
            this.timer = 0;
            if(this.time2 == 0){
                this.time2 = t;
            }
            if(t - this.time2 > 10000){
                this.graph.win = false;
                for(let i = 0; i < 36; i++){
                    this.round = 0;
                    this.gamepiece = null;
                    this.boardpieceId = null;
                    message = null;
                    botmoves = '[]';
                    this.time2 = 0;
                    if(i < 18){
                        this.graph.gamepieces[i].reset([i*1- (Math.floor(i/6)*6),0,-2 - (Math.floor(i/6))]);
                    }
                    else if(i >= 18){
                        this.graph.gamepieces[i].reset([(i-18)*1 - (Math.floor((i-18)/6)*6),0,8 + (Math.floor((i-18)/6))]);
                    }
                    reset();
                    this.timer = 0;
                }
            }
        }
        if(this.time3 == 0){
            this.time3 = t;
        }
        else if(this.time3+1000 < t){
            this.timer++;
            this.time3 = t;
        }

        if(this.movies != 0){
            if(this.time4 == 0){
                this.time4 = t;
            }
            else if(this.time4+1000 < t){
                this.time4 = t;
                if(this.counter < this.movie.length){
                    if(this.movie[this.counter][0] == "Move"){
                        this.movie[this.counter][1].addAnimation(this.movie[this.counter][2], this.movie[this.counter][3], this.movie[this.counter][4], 3);
                    }
                    if(this.movie[this.counter][0] == "Texture"){
                        console.log("aaa");
                        this.movie[this.counter][1].changeTexture(this.movie[this.counter][2]);
                    } 
                    this.counter++;
                }
                else {
                    this.movies = false;
                    this.counter = 0;
                    this.time4 = 0;
                }
            }
        }
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);
        
        this.currCameraID = "blue";
       

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.sceneInited = true;

        this.interface.setActiveCamera(this.camera);
        
        this.interface.initLights();
        this.interface.initCameras();
        this.interface.initModes();
        this.interface.undo();
        this.interface.doMovie();
        this.interface.wins();
        this.interface.timer();
    }
    logPicking() {
        if (this.pickMode == false) {
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i = 0; i < this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj) {
						var customId = this.pickResults[i][1];
                        console.log("id " + customId + " object " + obj);
                        if(customId >= 100 && customId <= 136){
                            this.gamepiece = obj;
                            this.gamepieceId = customId;
                        }
                        else if((customId >= 11 && customId <= 16) || (customId >= 21 && customId <= 26) || (customId >= 31 && customId <= 36) || (customId >= 41 && customId <= 46) || (customId >= 51 && customId <= 56) || (customId >= 61 && customId <= 66)){
                            if(this.gamepiece != null){
                                this.boardpieceId = customId;
                                if(this.round == 0 && this.gamepiece.texture == 'textures/gamepiece1.jpg'){
                                    this.gamepiece = null;
                                    this.boardpieceId = null;
                                }
                    
                                else if(this.round == 1 && this.gamepiece.texture == 'textures/gamepiece2.jpg'){
                                    this.gamepiece = null;
                                    this.boardpieceId = null;
                                }
                    
                                else if(this.round != 0 && this.round != 1 && Math.floor((this.round-2)/2)%2 == 0 && this.gamepiece.texture == 'textures/gamepiece1.jpg'){
                                    this.gamepiece = null;
                                    this.boardpieceId = null;
                                }
                    
                                else if(this.round != 0 && this.round != 1 && Math.floor((this.round-2)/2)%2 != 0 && this.gamepiece.texture == 'textures/gamepiece2.jpg'){
                                    this.gamepiece = null;
                                    this.boardpieceId = null;
                                }
                                if(this.gamepiece != null){
                                    if(this.gamepiece.x == -1){
                                        document.getElementById("col").value = this.boardpieceId%10-1;
                                        document.getElementById("line").value = Math.floor(this.boardpieceId/10)-1; 
                                        makeRequest();
                                    }
                                }
                            }
                        }					
					}
				}
                this.pickResults.splice(0, this.pickResults.length);
			}
		}
	}

    /**
     * Displays the scene.
     */
    render(camera) {
        // ---- BEGIN Background, camera and axis setup

        this.camera = camera;
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.texrtt.bind(1);

        if(message != null && this.gamepiece != null && this.boardpieceId != null){
            if((message == 'Groovy Gary' || message == 'Blue Wins' || message == 'Red Wins') && this.gamepiece != null){
            if(this.gamepiece.x == -1){
                for(let i = 0; i < 36; i++){
                    if(this.graph.gamepieces[i].x == this.boardpieceId%10-1 && this.graph.gamepieces[i].y == Math.floor(this.boardpieceId/10)-1){
                        if(this.graph.gamepieces[i].texture == 'textures/gamepiece1.jpg'){
                            this.graph.gamepieces[i].gamepiece.changeTexture('textures/zombieblue.jpg');
                            this.undoMove[0] = 'Texture';
                            this.undoMove[1] = this.graph.gamepieces[i].gamepiece;
                            this.undoMove[2] = 'textures/gamepiece1.jpg';
                            this.value1 = "Texture";
                            this.value2 = this.graph.gamepieces[i].gamepiece;
                            this.value3 = 'textures/zombieblue.jpg';
                            this.movie.push([this.value1, this.value2, this.value3]);
                            this.gamepiece = null;
                            this.boardpieceId = null;
                            this.round++;
                            break;
                        }
                        else if(this.graph.gamepieces[i].texture == 'textures/gamepiece2.jpg'){  
                            this.graph.gamepieces[i].gamepiece.changeTexture('textures/zombiered.jpg');
                            this.undoMove[0] = 'Texture';
                            this.undoMove[1] = this.graph.gamepieces[i].gamepiece;
                            this.undoMove[2] = 'textures/gamepiece2.jpg';
                            this.value1 = "Texture";
                            this.value2 = this.graph.gamepieces[i].gamepiece;
                            this.value3 = 'textures/zombiered.jpg';
                            this.movie.push([this.value1, this.value2, this.value3]);
                            this.gamepiece = null;
                            this.boardpieceId = null;
                            this.round++;
                            break;
                        }
                    }
                }
                if(this.gamepiece != null){
                    this.undoMove[0] = 'Move';
                    this.undoMove[1] = this.gamepiece;
                    var undoaux = this.gamepieceId-100;
                    if(this.gamepiece.texture == 'textures/gamepiece1.jpg'){
                        this.undoMove[2] = [undoaux*1- (Math.floor(undoaux/6)*6),0,-2 - (Math.floor(undoaux/6))];
                    }
                    else if(this.gamepiece.texture == 'textures/gamepiece2.jpg'){
                        this.undoMove[2] = [(undoaux-18)*1 - (Math.floor((undoaux-18)/6)*6),0,8 + (Math.floor((undoaux-18)/6))];
                    }
                    this.value1 = "Move";
                    this.value2 = this.gamepiece;
                    this.value3 = this.boardpieceId%10-1;
                    this.value4 = 0.4;
                    this.value5 = Math.floor(this.boardpieceId/10)-0.75;
                    this.movie.push([this.value1, this.value2, this.value3, this.value4, this.value5]);
                    this.gamepiece.x = this.boardpieceId%10-1;
                    this.gamepiece.y = Math.floor(this.boardpieceId/10)-1;
                    this.gamepiece.addAnimation(this.boardpieceId%10-1,0.4, Math.floor(this.boardpieceId/10)-0.75,3);
                    this.gamepiece = null;
                    this.boardpieceId = null;
                    this.round++;
                }
            }
        }
        if(message == 'Blue Wins'){
            this.bluewins++;
            this.graph.win = true;
            this.graph.material.loadTexture('textures/bluewins.jpg');
        }
        else if(message == 'Red Wins'){
            this.redwins++;
            this.graph.win = true;
            this.graph.material.loadTexture('textures/redwins.jpg');
        }
        message = null;
        }

        if(botmoves != '[]'){
            if((this.modes == 1 || this.modes == 2) && (this.round == 1 || Math.floor((this.round-2)/2)%2 != 0)){
                for(let j = 1; j < botmoves.length; j = j+4){
                    for(let i = 0; i < 36; i++){
                        for(let i = 0; i < 36; i++){
                            if(this.graph.gamepieces[i].x == -1 && this.graph.gamepieces[i].y == -1 && this.graph.gamepieces[i].texture == 'textures/gamepiece1.jpg'){
                                this.gamepiece = this.graph.gamepieces[i];
                                break;
                            }
                        }
                        if(this.graph.gamepieces[i].x == botmoves[j] && this.graph.gamepieces[i].y == botmoves[j+2]){
                            if(this.graph.gamepieces[i].texture == 'textures/gamepiece1.jpg'){
                                this.graph.gamepieces[i].gamepiece.changeTexture('textures/zombieblue.jpg');
                                this.gamepiece = null;
                                this.boardpieceId = null;
                                this.round++;
                                break;
                            }
                            else if(this.graph.gamepieces[i].texture == 'textures/gamepiece2.jpg'){  
                                this.graph.gamepieces[i].gamepiece.changeTexture('textures/zombiered.jpg');
                                this.gamepiece = null;
                                this.boardpieceId = null;
                                this.round++;
                                break;
                            }
                        }
                    }
                    if(this.gamepiece != null){
                        this.gamepiece.x = botmoves[j];
                        this.gamepiece.y = botmoves[j+2];
                        this.gamepiece.addAnimation(parseInt(botmoves[j]),0.4, parseInt(botmoves[j+2])+0.25,3);
                        this.gamepiece = null;
                        this.boardpieceId = null;
                        this.round++;
                    }
                }
                if(message == 'Blue Wins'){
                    this.bluewins++;
                    this.graph.win = true;
                    this.graph.material.loadTexture('textures/bluewins.jpg');
                }
                else if(message == 'Red Wins'){
                    this.redwins++;
                    this.graph.win = true;
                    this.graph.material.loadTexture('textures/redwins.jpg');
                }
                botmoves = '[]';
                message = null;
                }
                if(this.modes == 3 || this.modes == 4 || this.modes == 5){
                    if(this.round == 0){
                        for(let j = 1; j < botmoves.length; j = j+4){
                            if(j == 5){
                                for(let i = 0; i < 36; i++){
                                    if(this.graph.gamepieces[i].x == -1 && this.graph.gamepieces[i].y == -1 && this.graph.gamepieces[i].texture == 'textures/gamepiece1.jpg'){
                                            this.gamepiece = this.graph.gamepieces[i];
                                        break;
                                    }
                                }
                            }
                            if(j == 1){
                                for(let i = 0; i < 36; i++){
                                    if(this.graph.gamepieces[i].x == -1 && this.graph.gamepieces[i].y == -1 && this.graph.gamepieces[i].texture == 'textures/gamepiece2.jpg'){
                                            this.gamepiece = this.graph.gamepieces[i];
                                        break;
                                    }
                                }
                            }
                                
                            if(this.gamepiece != null){
                                this.gamepiece.x = botmoves[j];
                                this.gamepiece.y = botmoves[j+2];
                                this.gamepiece.addAnimation(parseInt(botmoves[j]),0.4, parseInt(botmoves[j+2])+0.25,3);
                                this.gamepiece = null;
                                this.boardpieceId = null;
                                this.round++;
                            }
                            
                        }
                    }

                    else if(Math.floor((this.round-2)/2)%2 != 0){
                        for(let j = 1; j < botmoves.length; j = j+4){
                            for(let i = 0; i < 36; i++){
                                for(let i = 0; i < 36; i++){
                                    if(this.graph.gamepieces[i].x == -1 && this.graph.gamepieces[i].y == -1 && this.graph.gamepieces[i].texture == 'textures/gamepiece1.jpg'){
                                        this.gamepiece = this.graph.gamepieces[i];
                                        break;
                                    }
                                }
                                if(this.graph.gamepieces[i].x == botmoves[j] && this.graph.gamepieces[i].y == botmoves[j+2]){
                                    if(this.graph.gamepieces[i].texture == 'textures/gamepiece1.jpg'){
                                        this.graph.gamepieces[i].gamepiece.changeTexture('textures/zombieblue.jpg');
                                        this.gamepiece = null;
                                        this.boardpieceId = null;
                                        this.round++;
                                        break;
                                    }
                                    else if(this.graph.gamepieces[i].texture == 'textures/gamepiece2.jpg'){  
                                        this.graph.gamepieces[i].gamepiece.changeTexture('textures/zombiered.jpg');
                                        this.gamepiece = null;
                                        this.boardpieceId = null;
                                        this.round++;
                                        break;
                                    }
                                }
                            }
                            if(this.gamepiece != null){
                                this.gamepiece.x = botmoves[j];
                                this.gamepiece.y = botmoves[j+2];
                                this.gamepiece.addAnimation(parseInt(botmoves[j]),0.4, parseInt(botmoves[j+2])+0.25,3);
                                this.gamepiece = null;
                                this.boardpieceId = null;
                                this.round++;
                            }
                        }
                    }

                    else if(Math.floor((this.round-2)/2)%2 == 0){
                        for(let j = 1; j < botmoves.length; j = j+4){
                            for(let i = 0; i < 36; i++){
                                for(let i = 0; i < 36; i++){
                                    if(this.graph.gamepieces[i].x == -1 && this.graph.gamepieces[i].y == -1 && this.graph.gamepieces[i].texture == 'textures/gamepiece2.jpg'){
                                        this.gamepiece = this.graph.gamepieces[i];
                                        break;
                                    }
                                }
                                if(this.graph.gamepieces[i].x == botmoves[j] && this.graph.gamepieces[i].y == botmoves[j+2]){
                                    if(this.graph.gamepieces[i].texture == 'textures/gamepiece1.jpg'){
                                        this.graph.gamepieces[i].gamepiece.changeTexture('textures/zombieblue.jpg');
                                        this.gamepiece = null;
                                        this.boardpieceId = null;
                                        this.round++;
                                        break;
                                    }
                                    else if(this.graph.gamepieces[i].texture == 'textures/gamepiece2.jpg'){  
                                        this.graph.gamepieces[i].gamepiece.changeTexture('textures/zombiered.jpg');
                                        this.gamepiece = null;
                                        this.boardpieceId = null;
                                        this.round++;
                                        break;
                                    }
                                }
                            }
                            if(this.gamepiece != null){
                                this.gamepiece.x = botmoves[j];
                                this.gamepiece.y = botmoves[j+2];
                                this.gamepiece.addAnimation(parseInt(botmoves[j]),0.4, parseInt(botmoves[j+2])+0.25,3);
                                this.gamepiece = null;
                                this.boardpieceId = null;
                                this.round++;
                            }
                        }
                    }
                    if(message == 'Blue Wins'){
                        this.bluewins++;
                        this.graph.win = true;
                        this.graph.material.loadTexture('textures/bluewins.jpg');
                    }
                    else if(message == 'Red Wins'){
                        this.redwins++;
                        this.graph.win = true;
                        this.graph.material.loadTexture('textures/redwins.jpg');
                    }
                    botmoves = '[]';
                    message = null;
            
            }
            
                            
        }
        
        this.pushMatrix();
        this.axis.display();
        
        /*for (var i = 0; i < this.lights.length; i++) {
            //this.lights[i].setVisible(true);
            //this.lights[i].enable();
        }*/
        
        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();
            
            // Displays the scene (MySceneGraph function).
            this.graph.displayScene(this.shader);

            for(let i = 0; i < this.numLights; i++){
                if(this.setLights[i]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else{
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
            }
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    display(){
		this.texrtt.attachToFrameBuffer();
		//if (this.views != undefined) this.render(this.securityView);
        this.texrtt.detachFromFrameBuffer();
        if (this.views != undefined) this.updateCamera();
        this.render(this.camera);
        this.gl.disable(this.gl.DEPTH_TEST);
        //this.securityCam.display();
        this.gl.enable(this.gl.DEPTH_TEST);
	}
}