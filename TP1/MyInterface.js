/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();
        //console.log("IDS: " + this.scene.viewIDs);
        //        this.gui.add(this.scene, 'selectedObject', this.scene.objectIDs).name('Selected Object').onChange(this.scene.updateObjectComplexity.bind(this.scene))
        // add a group of controls (and open/expand by defult)

        this.initKeys();
        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    initCameras(){
        this.gui.add(this.scene, 'currCameraID', this.scene.viewIDs).name('Selected Camera').onChange(this.scene.updateCamera.bind(this.scene));
    }

    initLights(){
        var f = this.gui.addFolder('Lights');
        f.open();
        for(let i = 0; i < this.scene.numLights; i++){
            this.scene.setLights[i] = this.scene.lights[i].enabled;
            f.add(this.scene.setLights, i).name("Light " + i + " Enabled");
        }
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}