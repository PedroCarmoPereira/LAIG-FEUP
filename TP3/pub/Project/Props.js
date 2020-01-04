class Props {
    constructor (x, y, z, angleX, angleY, angleZ, scaleX, scaleY, scaleZ) {
        this.coords = [];
        this.coords.push(...[x, y, z]);
        this.angles = [];
        this.angles.push(...[angleX, angleY, angleZ]);
        this.scales = [];
        this.scales.push(...[scaleX, scaleY, scaleZ]);
    }
}