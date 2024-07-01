import '../css/main.css';

import { WMRGraph, WMRGraphObstacle } from '../lib/main';

function updateRotation( phi: number ) {

	console.log( phi );

}

function updateTranslation( x: number, y: number ) {

	console.log( x, y );

}

const appElement = document.getElementById( 'app' );

if ( appElement ) {

	new WMRGraph( 'app', updateRotation, updateTranslation );

}

const obstaclesElement = document.getElementById( 'obstacles' );

if ( obstaclesElement ) {

	new WMRGraphObstacle( 'obstacles', updateRotation, updateTranslation );

}
