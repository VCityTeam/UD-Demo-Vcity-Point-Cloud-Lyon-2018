import * as THREE from 'three';


export class BillBoard{
    constructor(scene, coord){
        this.coordinates = coord;
        this.scene = scene;
    }


    /// Visualize document in the city 3D model of UD-Viz
    VisualizeBillBoard() {
        var lirisTexture = THREE.ImageUtils.loadTexture( 'assets/img/logo-liris.png' );
        var lirisMaterial = new THREE.SpriteMaterial( { map: lirisTexture, useScreenCoordinates: false, color: 0xff0000 } );
        var sprite2 = new THREE.Sprite( lirisMaterial );
        sprite2.position.set( 50, 50, 0);
        sprite2.scale.set( 64, 64, 1.0 ); // imageWidth, imageHeight
        return sprite2;
    }

    VisualizeBillBoardOnSideOFScreen( texture ) {
        const material = new THREE.SpriteMaterial( {map: texture} );
        const width = material.map.image.width;
		const height = material.map.image.height;

        let spriteTR = new THREE.Sprite( material );
				spriteTR.center.set( 1.0, 1.0 );
				spriteTR.scale.set( width, height, 1 );
				sceneOrtho.add( spriteTR );
        return sprite;
    }
}