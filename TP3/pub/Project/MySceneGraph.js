var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
        //this.cylinder = new MyCylinder(this.scene, 5, 50, 50, 2, 1, 1);
        //this.cylinder = new cylinder2(this.scene, 50, 50, 4, 2, 2);
        this.board = new Board(this.scene);
        this.material = new CGFappearance(scene);
        this.material.setAmbient(0.5, 0.5, 0.5, 1);
        this.material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.material.setSpecular(0.2, 0.2, 0.2, 1);
        this.material.setShininess(0.2);
        this.material.setTextureWrap('REPEAT', 'REPEAT');
        this.message = new MyRectangle(this.scene, 9, -3, 3, -3, 3);
        this.message2 = new MyRectangle(this.scene, 9, -3, 3, -3, 3);
        this.win = false;
        this.gamepieces = [];
        for(let i = 0; i < 36; i++){
            if(i < 18){
                this.gamepieces[i] = new GamePiece(this.scene, 'textures/gamepiece1.jpg', [i*1- (Math.floor(i/6)*6),0,-2 - (Math.floor(i/6))], 100+i);
            }
            else if(i >= 18){
                this.gamepieces[i] = new GamePiece(this.scene, 'textures/gamepiece2.jpg', [(i-18)*1 - (Math.floor((i-18)/6)*6),0,8 + (Math.floor((i-18)/6))], 100+i);
            }

        }
        this.scene.setPickEnabled(true);
    }


    xmlUpdate(filename) {
        // Stored just for displaying in the interface and knowing the currently loaded scene
        this.filename = filename;
        this.nodes = [];

        // File reading 
        this.reader = new CGFXMLreader();
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1) return "tag <animations> missing";
        
        else{
            if (index != ANIMATIONS_INDEX) this.onXMLMinorError("tag <animations> out of order");
            //Parse primitives block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;

        }


        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }
        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        var children = viewsNode.children;
        
        var defaultView = this.reader.getString(viewsNode, "default");
        
        this.scene.views = [];

        var grandChildren = [];
        for (var i = 0; i < children.length; i++) {

            var cameraType = false; // FALSE = perspective, TRUE = ortho
            if (children[i].nodeName != "perspective") {
                if (children[i].nodeName != 'ortho') {
                    this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                    continue;
                }

                cameraType = true;
            }

            // Get id of the current camera.
            var cameraId = this.reader.getString(children[i], 'id');
            if (cameraId == null)
                return "no ID defined for camera";

            // Checks for repeated IDs.
            if (this.scene.views[cameraId] != null)
                return "ID must be unique for each camera (conflict: ID = " + cameraId + ")";

            this.scene.viewIDs.push(cameraId);
            grandChildren = children[i].children;
        
            if(!cameraType){
                let near, far, angle;
                near = this.reader.getFloat(children[i], 'near');
                far = this.reader.getFloat(children[i], 'far');
                angle = this.reader.getFloat(children[i], 'angle');

                let x1, x2, y1, y2, z1, z2;

                x1 = this.reader.getFloat(grandChildren[0], 'x');
                y1 = this.reader.getFloat(grandChildren[0], 'y');
                z1 = this.reader.getFloat(grandChildren[0], 'z');

                x2 = this.reader.getFloat(grandChildren[1], 'x');
                y2 = this.reader.getFloat(grandChildren[1], 'y');
                z2 = this.reader.getFloat(grandChildren[1], 'z');

                this.scene.views[cameraId] = new CGFcamera(angle, near, far, vec3.fromValues(x1, y1, z1), vec3.fromValues(x2, y2, z2));
            }

            else {
                let near, far, left, right, top, bottom;
                near = this.reader.getFloat(children[i], 'near');
                far = this.reader.getFloat(children[i], 'far');
                left = this.reader.getFloat(children[i], 'left');
                right = this.reader.getFloat(children[i], 'right');
                top = this.reader.getFloat(children[i], 'top');
                bottom = this.reader.getFloat(children[i], 'bottom');

                let fx, fy, fz, tx, ty, tz, ux, uy, uz;
                fx = this.reader.getFloat(grandChildren[0], 'x');
                fy = this.reader.getFloat(grandChildren[0], 'y');
                fz = this.reader.getFloat(grandChildren[0], 'z');

                tx = this.reader.getFloat(grandChildren[1], 'x');
                ty = this.reader.getFloat(grandChildren[1], 'y');
                tz = this.reader.getFloat(grandChildren[1], 'z');
                
                if (grandChildren[2] != undefined && grandChildren[2] != null){
                    ux = this.reader.getFloat(grandChildren[2], 'x');
                    uy = this.reader.getFloat(grandChildren[2], 'y');
                    uz = this.reader.getFloat(grandChildren[2], 'z');
                }
                
                else { ux = 0; uy = 1; uz = 0; }

                this.scene.views[cameraId] = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(fx, fy, fz), vec3.fromValues(tx, ty, tz), vec3.fromValues(ux, uy, uz));

            }
        }
        this.scene.camera = this.scene.views[defaultView];
        this.scene.currCameraID = defaultView;
        this.scene.currSecCamID = defaultView;
        this.scene.securityView = this.scene.views[defaultView];
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        this.scene.numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            this.scene.numLights++;
        }

        if (this.scene.numLights == 0)
            return "at least one light must be defined";
        else if (this.scene.numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        console.log("Num lights: " + this.scene.numLights);
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        
        var children = texturesNode.children;
        this.textures = [];
        for(var i = 0; i < children.length; i++){
            if (children[i].nodeName != "texture"){
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            
            var textureID = this.reader.getString(children[i], "id");
            if(textureID == null) return "no ID defined for texture";
            
            if (this.textures[textureID] != null)
            return "ID must be unique for each texture (conflict: ID = " + textureID + ")";
            
            var textLocal = this.reader.getString(children[i], "file");
            
            this.textures[textureID] = new CGFtexture(this.scene, textLocal);

        }

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];
        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            grandChildren = children[i].children;

            var shininess = this.reader.getFloat(children[i], "shininess");
            
        
            var e, a, d, s;
            e = this.parseColor(grandChildren[0], "material");
            if (!Array.isArray(e)) return e;

            a = this.parseColor(grandChildren[1], "material");
            if (!Array.isArray(a)) return a;

            d = this.parseColor(grandChildren[2], "material");
            if (!Array.isArray(d)) return d;

            s = this.parseColor(grandChildren[3], "material");
            if (!Array.isArray(s)) return s;


            this.materials[materialID] = new CGFappearance(this.scene);
            this.materials[materialID].setAmbient(a[0], a[1], a[2], a[3]);
            this.materials[materialID].setDiffuse(d[0], d[1], d[2], d[3]);
            this.materials[materialID].setSpecular(s[0], s[1], s[2], s[3]);
            this.materials[materialID].setEmission(e[0], e[1], e[2], e[3]);
            this.materials[materialID].setShininess(shininess);
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':                        
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                        if(!Array.isArray(coordinates)) return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        var axis, angle;
                        axis = this.reader.getString(grandChildren[j], "axis");
                        angle = this.reader.getFloat(grandChildren[j], "angle");

                        switch(axis){
                            case 'x':
                                transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, angle);
                                break;
                            case 'y':
                                transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, angle);
                                break;
                            case 'z':
                                transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, angle);
                                break;

                        }

                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for primitive";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'patch' && grandChildren[0].nodeName != 'plane'
                    && grandChildren[0].nodeName != 'cylinder2' )) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus, patch, plane or cylinder2)";
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }

            else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;    

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;
                    
                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;    

                var tri = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);

                this.primitives[primitiveId] = tri;
            }

            else if (primitiveType == 'cylinder'){
                
                //slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices))) return "unable to parse slices of the primitive for ID = " + primitiveId;

                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks))) return "unable to parse stacks of the primitive for ID = " + primitiveId;

                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height))) return "unable to parse height of the primitive for ID = " + primitiveId;

                //r1
                var r1 = this.reader.getFloat(grandChildren[0], 'base');
                if (!(r1 != null && !isNaN(r1)))
                    return "unable to parse base of the primitive for ID = " + primitiveId;

                // r2
                var r2 = this.reader.getFloat(grandChildren[0], 'top');
                if (!(r2 != null && !isNaN(r2)))
                    return "unable to parse r2 of the primitive for ID = " + primitiveId;
                
                var cyl = new MyCylinder(this.scene, primitiveId, slices, stacks, height,  r1, r2);
                this.primitives[primitiveId] = cyl;
                
            }

            else if (primitiveType == 'sphere'){
                //slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices))) return "unable to parse slices of the primitive for ID = " + primitiveId;

                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks))) return "unable to parse stacks of the primitive for ID = " + primitiveId;

                var r1 = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(r1 != null && !isNaN(r1)))
                    return "unable to parse radius of the primitive for ID = " + primitiveId;

                var sp = new MySphere(this.scene, primitiveId, slices, stacks, r1);
                this.primitives[primitiveId] = sp;
            }

            else if (primitiveType == 'torus'){
                //slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices))) return "unable to parse slices of the primitive for ID = " + primitiveId;

                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops))) return "unable to parse loops of the primitive for ID = " + primitiveId;

                var r1 = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(r1 != null && !isNaN(r1)))
                    return "unable to parse outer of the primitive for ID = " + primitiveId;

                var r2 = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(r2 != null && !isNaN(r2)))
                    return "unable to parse inner of the primitive for ID = " + primitiveId;    

                var tor = new MyTorus(this.scene, primitiveId, slices, loops, r1, r2);
                this.primitives[primitiveId] = tor;
            }

            else if (primitiveType == 'plane'){
                var U = this.reader.getFloat(grandChildren[0], 'npartsU');
                var V = this.reader.getFloat(grandChildren[0], 'npartsV');

                var plane = new Plane(this.scene, U, V);
                this.primitives[primitiveId] = plane;
            }
            
            else if (primitiveType == 'patch'){
                var U = this.reader.getFloat(grandChildren[0], 'npartsU');
                var V = this.reader.getFloat(grandChildren[0], 'npartsV');

                var degU = this.reader.getFloat(grandChildren[0], 'npointsU');
                var degV = this.reader.getFloat(grandChildren[0], 'npointsV');

                var controlPointNode = grandChildren[0].children;
                var controlPoints = [];
                var control = [];
                for (let i = 0; i <= degU; i++) {
                    for(let j = 0; j <= degV; j++){
                        let controlPoint = [];
                        controlPoint[0] = this.reader.getFloat(controlPointNode[j+i*(degV+1)], 'xx');
                        controlPoint[1] = this.reader.getFloat(controlPointNode[j+i*(degV+1)], 'yy');
                        controlPoint[2] = this.reader.getFloat(controlPointNode[j+i*(degV+1)], 'zz');
                        controlPoint[3] = 1;
                        controlPoints.push(controlPoint);
                    }
                        control.push(controlPoints);
                        controlPoints = [];
                    }
                var patch = new Patch(this.scene, U, V, degU, degV, control);
                this.primitives[primitiveId] = patch;

            }

            else if (primitiveType == 'cylinder2'){
                //(scene, slices, stacks, height, r1, r2)
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                var base = this.reader.getFloat(grandChildren[0], 'base');
                var top = this.reader.getFloat(grandChildren[0], 'top');
                var height = this.reader.getFloat(grandChildren[0], 'height');

                var cyl = new cylinder2(this.scene, slices, stacks, height, base, top);
                this.primitives[primitiveId] = cyl;
            }

            else {
                console.warn("To do: Parse other primitives.");
            }
        }
        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];
        var componentTransf = [];
        var componentMat = [];
        var componentTex = [];
        var componentAnim = [];
        var componentChildren = [];
        var componentTexCoords = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        var id = 0;

        // Any number of components.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";


            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var texIndex = nodeNames.indexOf("texture");
            var animationIndex = nodeNames.indexOf("animationref");
            var childrenIndex = nodeNames.indexOf("children");
            // Transformations
            var transfMatrix = mat4.create();
            var transfVect = grandChildren[transformationIndex].children;
            for (let k = 0; k < transfVect.length; k++) {
                if(transfVect[k].nodeName == "transformationref"){
                    var transfID = this.reader.getString(transfVect[k], "id");
                    if (this.transformations[transfID] == undefined){
                        this.log("Referenced transformation " + transfID + " does not exist");
                        continue;
                    }

                    transfMatrix = this.transformations[transfID];
                }
                else if (transfVect[k].nodeName == "translate"){
                    var coordinates = this.parseCoordinates3D(transfVect[k], "translate transformation for ID " + componentID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                    transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                }
                else if (transfVect[k].nodeName == "rotate"){
                    var axis, angle;
                        axis = this.reader.getString(transfVect[k], "axis");
                        angle = this.reader.getFloat(transfVect[k], "angle");

                        switch(axis){
                            case 'x':
                                transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, angle*Math.PI/180);
                                break;
                            case 'y':
                                transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, angle*Math.PI/180);
                                break;
                            case 'z':
                                transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, angle*Math.PI/180);
                                break;

                        }
                }

                else if(transfVect[k].nodeName == "scale"){
                    var coordinates = this.parseCoordinates3D(transfVect[k], "scale transformation for ID " + componentID);
                    if(!Array.isArray(coordinates)) return coordinates;

                    transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                }

                else {
                    this.onXMLMinorError("Unexpected tag " + transfVect[k].nodeName);
                    continue;
                }

                componentTransf[componentID] = transfMatrix;
            }

            // Animations
            componentAnim[componentID] = [];
            if(animationIndex != -1) {
                if( grandChildren[animationIndex].nodeName == "animationref"){
                    var animId = this.reader.getString(grandChildren[animationIndex], "id");
                    componentAnim[componentID] = this.animations[animId];
                }
                else {
                    this.onXMLMinorError("Unexpected tag " + grandChildren[animationIndex].nodeName);
                    continue;
                }
            }
            
            // Materials

            componentMat[componentID] = [];
            var materialVect = grandChildren[materialsIndex].children;
            for (let k = 0; k < materialVect.length; k++) {
                if(materialVect[k].nodeName == "material"){
                    var materialID = this.reader.getString(materialVect[k], "id");
                        if(materialID == 'inherit'){
                            componentMat[componentID].push(materialID);
                        }
                        
                        else if (this.materials[materialID] == undefined){
                            this.log("Referenced material " + materialID + " does not exist");
                            continue;
                        }

                        else componentMat[componentID].push(this.materials[materialID]);
                }
            
                else {
                    this.onXMLMinorError("Unexpected tag " + materialVect[k].nodeName);
                    continue;
                }
            
            }
        // Texture
        
        //this.log( this.reader.getString(grandChildren[2], "id"));
        componentTex[componentID] = [];
        componentTexCoords[componentID] = [];
            if(grandChildren[texIndex].nodeName == "texture"){
                var textureID = this.reader.getString(grandChildren[texIndex], "id");
                var length_s = this.reader.getString(grandChildren[texIndex], "length_s");
                var length_t = this.reader.getString(grandChildren[texIndex], "length_t");
                componentTexCoords[componentID].push(length_s);
                componentTexCoords[componentID].push(length_t);
                if(textureID == 'inherit' || textureID == 'none'){
                    componentTex[componentID].push(textureID);
                }
                
                else if (this.textures[textureID] == undefined){
                    this.log("Referenced texture " + textureID + " does not exist");
                    continue;
                }
                
                else componentTex[componentID].push(this.textures[textureID]);
            }

                
            else {
                this.onXMLMinorError("Unexpected tag " + grandChildren[texIndex].nodeName);
                continue;
            }

            // Children
            componentChildren[componentID] = [];
            var childrenVect = grandChildren[childrenIndex].children;
            for (let k = 0; k < childrenVect.length; k++) {
                if(childrenVect[k].nodeName == "primitiveref"){
                    var childrenID = this.reader.getString(childrenVect[k], "id");
                        if (this.primitives[childrenID] == undefined){
                            this.log("Referenced primitive " + childrenID + " does not exist");
                            continue;
                        }
                    componentChildren[componentID].push(this.primitives[childrenID]);
                }

                else if(childrenVect[k].nodeName == "componentref"){
                    var childrenID = this.reader.getString(childrenVect[k], "id");
                    componentChildren[componentID].push(this.components[childrenID]);
                }
            
                else {
                    this.onXMLMinorError("Unexpected tag " + childrenVect[k].nodeName);
                    continue;
                }
            
            }
            
            this.components[componentID] = new Component(this.scene, componentID, id++, componentTransf[componentID], componentMat[componentID], componentTex[componentID], componentChildren[componentID], componentTexCoords[componentID], componentAnim[componentID]);
            
        }
    }

    parseAnimations(animationsNode){
        var children = animationsNode.children;
        this.animations = [];
        var grandChildren = [];
        var greatGrandChildren = [];
        var keyframes;
        var lastinst = -1;
        var tempId;
        for(let i = 0; i < children.length; i++){
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current animation.
            var animationId = this.reader.getString(children[i], 'id');
            if (animationId == null)
                return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.animations[animationId] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationId + ")";

            grandChildren = children[i].children;

            let kf_test = false;
            keyframes = [];            
            for(let j = 0; j < grandChildren.length; j++){

                if (grandChildren[j].nodeName != "keyframe") {
                    this.onXMLMinorError("unknown tag <" + grandChildren[i].nodeName + ">");
                    continue;
                }
                
                var instant = this.reader.getFloat(grandChildren[j], "instant");
                greatGrandChildren = grandChildren[j].children;
                kf_test = true;
                var x = 0, y = 0, z = 0, ax = 0, ay = 0, az = 0, sx = 1, sy = 1, sz = 1;
                for(let k = 0; k < greatGrandChildren.length; k++){
                    switch (greatGrandChildren[k].nodeName) {
                        case 'translate':
                            var coordinates = this.parseCoordinates3D(greatGrandChildren[k], "translate transformation for ID " + animationId);
                            if (!Array.isArray(coordinates))
                                return coordinates;
    
                            x = coordinates[0];
                            y = coordinates[1];
                            z = coordinates[2];
                            break;
                        case 'scale':                        
                            var coordinates = this.parseCoordinates3D(greatGrandChildren[k], "scale transformation for ID " + animationId);
                            if(!Array.isArray(coordinates)) return coordinates;
                            sx = coordinates[0];
                            sy = coordinates[1];
                            sz = coordinates[2];
                            break;
                        case 'rotate':
                            ax = this.reader.getFloat(greatGrandChildren[k], "angle_x");
                            ay = this.reader.getFloat(greatGrandChildren[k], "angle_y");
                            az = this.reader.getFloat(greatGrandChildren[k], "angle_y");
                            break;
                    }
                }

                var time;
                if(animationId == tempId){
                    time = instant - lastinst;
                    lastinst = instant;
                }
                else{
                    time = instant;
                    tempId = animationId;
                    lastinst = instant;
                }
                keyframes.push(new KeyFrameAnimation(time, new Props(x, y, z, ax, ay, az, sx, sy, sz)));
            }

            if (!kf_test) this.onXMLMinorError("<keyframe> tag missing");
            this.animations[animationId] = keyframes;
        }
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.scene.logPicking();
        this.scene.clearPickRegistration();
        this.scene.pushMatrix();
        this.scene.translate(2.5, 3, 5);
        this.board.display();   
        for(let i = 0; i < 36; i++) this.gamepieces[i].display();
        this.scene.popMatrix();
        this.components[this.idRoot].display(this.components[this.idRoot].materials);

        if(this.win){
            this.scene.translate(5, 8, 8.1);
            this.material.apply();
            this.message.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(5, 8, 8);
            this.scene.rotate(180*Math.PI/180, 0, 1, 0);
            this.material.apply();
            this.message2.display();
        }

        //this.components[this.idRoot].display(this.components[this.idRoot].materials);
        //this.primitives['demoPatch'].display();
    }
}