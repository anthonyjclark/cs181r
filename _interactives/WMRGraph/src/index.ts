import '../css/main.css';

import { WMRGraph } from '../lib/main';

function updateRotation( phi: number ) {

	console.log( phi );

}

function updateTranslation( x: number, y: number ) {

	console.log( x, y );

}

new WMRGraph( 'app', updateRotation, updateTranslation );
