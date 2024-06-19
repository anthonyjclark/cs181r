import '../css/main.css';

import { WMRGraph } from '../lib/main';

function updateRotation( phi: number ) {

	console.log( phi );

}

function updateTranslation( x: number, y: number ) {

	console.log( x, y );

}

const appElement = document.getElementById( 'baseline' );

if ( appElement ) {

	new WMRGraph( 'baseline', updateRotation, updateTranslation );

}

const obstaclesElement = document.getElementById( 'obstacles' );

if ( obstaclesElement ) {

	const graphWithObstacles = new WMRGraph( 'obstacles', updateRotation, updateTranslation );

	// TODO: don't divide by 4
	const obstaclePoints = [
		[ 15 / 4, 5 / 4 ],
		[ 30 / 4, 5 / 4 ],
		[ 30 / 4, 35 / 4 ],
		[ 25 / 4, 35 / 4 ],
		[ 25 / 4, 10 / 4 ],
		[ 15 / 4, 10 / 4 ],
	];

	graphWithObstacles.addObstacle( obstaclePoints );

}
