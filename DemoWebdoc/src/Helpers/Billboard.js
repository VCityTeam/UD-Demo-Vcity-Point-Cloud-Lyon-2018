import * as THREE from 'three';


export class BillBoard{
    constructor(scene, coord){
        this.coordinates = coord;
        this.scene = scene;
    }


    /// Visualize document in the city 3D model of UD-Viz
    VisualizeBillBoard() {
        var crateTexture = THREE.ImageUtils.loadTexture( 'assets/img/logo-liris.png' );

        var crateMaterial = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false, color: 0xff0000 } );
        var sprite2 = new THREE.Sprite( crateMaterial );
        sprite2.position.set( 50, 50, 0);
        sprite2.scale.set( 64, 64, 1.0 ); // imageWidth, imageHeight
        console.log("je crée le billboard");
        return sprite2;
    }

}