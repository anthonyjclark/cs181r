import '../css/main.css';

import { WMRGraph, WMRGraphObstacle, DifferentialDriveSimulation } from '../lib/main';

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

const feedbackElement = document.getElementById( 'feedback' );

if ( feedbackElement ) {

	new DifferentialDriveSimulation( 'feedback', updateRotation, updateTranslation );

}
