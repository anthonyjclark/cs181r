import '../css/main.css';

import { WMRGraph } from '../lib/main';

const ADD_OBSTACLES = false;
const ADD_CONTROLS = true;

function updateRotation( phi: number ) {

	console.log( phi );

}

function updateTranslation( x: number, y: number ) {

	console.log( x, y );

}

const wmr = new WMRGraph( 'app', updateRotation, updateTranslation );

if ( ADD_OBSTACLES ) {

	// TODO: don't divide by 4
	const obstaclePoints = [
		[ 15 / 4, 5 / 4 ],
		[ 30 / 4, 5 / 4 ],
		[ 30 / 4, 35 / 4 ],
		[ 25 / 4, 35 / 4 ],
		[ 25 / 4, 10 / 4 ],
		[ 15 / 4, 10 / 4 ],
	];

	wmr.addObstacle( obstaclePoints );

}

if ( ADD_CONTROLS ) {

	const controls = wmr.addControls();

	const e = document.querySelector<HTMLDivElement>( '#app' );
	e?.parentElement?.insertBefore( controls, e.nextSibling );

}
