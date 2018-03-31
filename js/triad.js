/**
 * Created by sourov on 30-Mar-18.
 */


function Triad(parent) {


    let self = this;

    let positionPerAxis = 14;
    let totalAxisCount = 3;
    let componentPerPosition = 3;
    let componentPerMeshid = 1;
    let trianglePerAxis = 20;
    let componentPerTriangle = 3;

    self.triadObject = new THREE.Object3D();
    self.triadObject.add(createTriad());
    self.triadObject.position.set(0, 0, 0);
    parent.add(self.triadObject);

    function createTriad() {
        let geometry = createTriadGeometry();
        let material = createTriadMaterial();

        let triadMesh = new THREE.Mesh(geometry, material);
        triadMesh.name = 'Triad';
        return triadMesh;
    }

    function createTriadMaterial() {
        let material = new THREE.MeshPhongMaterial({
            vertexColors: THREE.VertexColors,
            shininess: 0.1,
            specular: 0x111111,
            side: THREE.DoubleSide
        });

        return material;
    }

    function createTriadGeometry() {
        let geometry = new THREE.BufferGeometry();

        let positionArray = getTriadPositionArray();
        let colorArray = getTriadColorArray();
        let indexArray = getTriadIndexArray();

        geometry.addAttribute('position', new THREE.BufferAttribute(positionArray, 3));
        geometry.addAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        geometry.setIndex(new THREE.BufferAttribute(indexArray, 1));
        geometry.computeVertexNormals();

        return geometry;
    }

    function getPositionArraySize() {
        return positionPerAxis * totalAxisCount * componentPerPosition;
    }

    function getTriadPositionArray() {

        let positionArray = new Float32Array(getPositionArraySize());

        fillXAxisPositions(positionArray);
        fillYAxisPositions(positionArray);
        fillZAxisPositions(positionArray);


        return positionArray;

    }

    function fillXAxisPositions(positionArray) {
        fillAxisPositions(positionArray, 0);
    }

    function fillYAxisPositions(positionArray) {
        let rotationMatrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3().set(0, 0, 1), THREE.Math.degToRad(90));
        fillAxisPositions(positionArray, positionPerAxis * componentPerPosition, rotationMatrix);
    }

    function fillZAxisPositions(positionArray) {
        let rotationMatrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3().set(0, 0, 1), THREE.Math.degToRad(-90));
        rotationMatrix.multiply(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3().set(0, 1, 0), THREE.Math.degToRad(-90)));
        fillAxisPositions(positionArray, 2 * positionPerAxis * componentPerPosition, rotationMatrix);
    }

    function fillAxisPositions(positionArray, start, transformationMatrix) {
        let allPositions = [];

        let templatePositions = getPositionArrayTemplate();
        let mirroredPositions = getMirrorAlongXAxis(templatePositions);

        templatePositions.forEach(function(position) {
            allPositions.push(position);
        });

        mirroredPositions.forEach(function(position) {
            allPositions.push(position);
        });

        for (let i = start, count = 0; count < allPositions.length; i += 3, count++ ) {

            let position = allPositions[count];

            if (transformationMatrix)
                position.applyMatrix4(transformationMatrix);

            positionArray[i + 0] = position.x;
            positionArray[i + 1] = position.y;
            positionArray[i + 2] = position.z;
        }
    }

    function getPositionArrayTemplate() {
        let positionArrayTemplate = [];

        // tail
        positionArrayTemplate.push(new THREE.Vector3(0, 1, 0.5));
        positionArrayTemplate.push(new THREE.Vector3(10, 1, 0.5));
        positionArrayTemplate.push(new THREE.Vector3(10, -1, 0.5));
        positionArrayTemplate.push(new THREE.Vector3(0, -1, 0.5));

        // head
        positionArrayTemplate.push(new THREE.Vector3(10, 1.5, 0.8));
        positionArrayTemplate.push(new THREE.Vector3(15, 0, 0.8));
        positionArrayTemplate.push(new THREE.Vector3(10, -1.5, 0.8));

        return positionArrayTemplate;
    }

    function getMirrorAlongXAxis(positionArray) {
        let mirroredPositionArray = [];

        positionArray.forEach(function(position) {
            mirroredPositionArray.push(new THREE.Vector3().set(position.x, position.y, position.z * -1));
        });

        return mirroredPositionArray;
    }

    function getTriadColorArray() {
        let colorArray = new Float32Array(getPositionArraySize());

        fillXAxisColors(colorArray);
        fillYAxisColors(colorArray);
        fillZAxisColors(colorArray);

        return colorArray;
    }

    function fillXAxisColors(colorArray) {
        // Red for X axis
        for (let i = 0; i < positionPerAxis * componentPerPosition; i += 3) {
            colorArray[i + 0] = 1.0;
            colorArray[i + 1] = 0.0;
            colorArray[i + 2] = 0.0;
        }
    }

    function fillYAxisColors(colorArray) {
        // Blue for Y axis
        for (let i = positionPerAxis * componentPerPosition; i < 2 * positionPerAxis * componentPerPosition; i += 3) {
            colorArray[i + 0] = 0.0;
            colorArray[i + 1] = 0.0;
            colorArray[i + 2] = 1.0;
        }
    }

    function fillZAxisColors(colorArray) {
        // Red for Z axis
        for (let i = 2 * positionPerAxis * componentPerPosition; i < 3 * positionPerAxis * componentPerPosition; i += 3) {
            colorArray[i + 0] = 0.0;
            colorArray[i + 1] = 1.0;
            colorArray[i + 2] = 0.0;
        }
    }

    function getTriadIndexArray() {
        let indexArray = new Uint16Array(getIndexArraySize());

        fillXAxisIndexArray(indexArray);
        fillYAxisIndexArray(indexArray);
        fillZAxisIndexArray(indexArray);

        return indexArray;
    }

    function getIndexArraySize() {
        return totalAxisCount * trianglePerAxis * componentPerTriangle;
    }

    function fillXAxisIndexArray(indexArray) {
        let indexArrayTemplate = getIndexArrayTemplate();

        fillIndexArrayFromTemplate(indexArray, indexArrayTemplate, 0, trianglePerAxis * componentPerTriangle, 0);
    }

    function fillYAxisIndexArray(indexArray) {
        let indexArrayTemplate = getIndexArrayTemplate();

        fillIndexArrayFromTemplate(indexArray, indexArrayTemplate, trianglePerAxis * componentPerTriangle, 2 * trianglePerAxis * componentPerTriangle, positionPerAxis);
    }

    function fillZAxisIndexArray(indexArray) {
        let indexArrayTemplate = getIndexArrayTemplate();

        fillIndexArrayFromTemplate(indexArray, indexArrayTemplate, 2 * trianglePerAxis * componentPerTriangle, 3 * trianglePerAxis * componentPerTriangle, 2 * positionPerAxis);
    }

    function fillIndexArrayFromTemplate(indexArray, indexArrayTemplate, start, end, offset) {
        for (let i = start; i < end; i++)
            indexArray[i] = indexArrayTemplate[i - start] + offset;
    }

    function getIndexArrayTemplate() {
        let indexArrayTemplate = [];

        indexArrayTemplate.push(0);
        indexArrayTemplate.push(3);
        indexArrayTemplate.push(1);

        indexArrayTemplate.push(1);
        indexArrayTemplate.push(3);
        indexArrayTemplate.push(2);

        indexArrayTemplate.push(4);
        indexArrayTemplate.push(6);
        indexArrayTemplate.push(5);

        indexArrayTemplate.push(7);
        indexArrayTemplate.push(8);
        indexArrayTemplate.push(10);

        indexArrayTemplate.push(8);
        indexArrayTemplate.push(10);
        indexArrayTemplate.push(9);

        indexArrayTemplate.push(0);
        indexArrayTemplate.push(7);
        indexArrayTemplate.push(3);

        indexArrayTemplate.push(7);
        indexArrayTemplate.push(10);
        indexArrayTemplate.push(3);

        indexArrayTemplate.push(1);
        indexArrayTemplate.push(2);
        indexArrayTemplate.push(8);

        indexArrayTemplate.push(8);
        indexArrayTemplate.push(2);
        indexArrayTemplate.push(9);

        indexArrayTemplate.push(0);
        indexArrayTemplate.push(1);
        indexArrayTemplate.push(8);

        indexArrayTemplate.push(0);
        indexArrayTemplate.push(8);
        indexArrayTemplate.push(7);

        indexArrayTemplate.push(10);
        indexArrayTemplate.push(9);
        indexArrayTemplate.push(3);

        indexArrayTemplate.push(9);
        indexArrayTemplate.push(2);
        indexArrayTemplate.push(3);

        indexArrayTemplate.push(4);
        indexArrayTemplate.push(13);
        indexArrayTemplate.push(11);

        indexArrayTemplate.push(4);
        indexArrayTemplate.push(6);
        indexArrayTemplate.push(13);

        indexArrayTemplate.push(4);
        indexArrayTemplate.push(5);
        indexArrayTemplate.push(12);

        indexArrayTemplate.push(4);
        indexArrayTemplate.push(12);
        indexArrayTemplate.push(11);

        indexArrayTemplate.push(5);
        indexArrayTemplate.push(6);
        indexArrayTemplate.push(13);

        indexArrayTemplate.push(5);
        indexArrayTemplate.push(13);
        indexArrayTemplate.push(12);

        indexArrayTemplate.push(11);
        indexArrayTemplate.push(12);
        indexArrayTemplate.push(13);

        return indexArrayTemplate;
    }

}

Triad.prototype = {

};