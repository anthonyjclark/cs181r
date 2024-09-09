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

	/*
		From Modern Robotics, page 546
			ϕ dot = r (ur - ul) / (2d)
			x dot = r (ur + ul) cos(𝜙) / 2
			y dot = r (ur + ul) sin(𝜙) / 2

			- r is the wheel radius (m)
			- ur is the right wheel angular velocity (rad/s)
			- ul is the left wheel angular velocity (rad/s)
			- 2d is the distance between the wheels (m)

		From Wheeled Mobile Robotics, page 21
			v = (vr + vl) / 2

			ϕ dot = ω = (vr - vl) / L
			x dot = v cos(𝜙) = (vr + vl) cos(ϕ) / 2
			y dot = v sin(𝜙) = (vr + vl) sin(ϕ) / 2

			- v is the linear velocity (m/s)
			- vr is the right wheel linear velocity (m/s)
			- vl is the left wheel linear velocity (m/s)
			- L is the distance between the wheels (m)

		Conversion
			vr = r ur
			vl = r ul
		*/

	// TODO: use correct values
	const r = 0.1;
	const d = 0.07;

	let ur = 20;
	let ul = 19.9;

	// TODO: simulate from t=0 to t=time on each call to update
	// TODO: add caching

	const simulate = ( time: number ): [number, number, number] => {

		let t = 0;

		let phi = 0;
		let x = 0;
		let y = 0;

		let xdot = r * ( ur + ul ) * Math.cos( 0 ) / 2;
		let ydot = r * ( ur + ul ) * Math.sin( 0 ) / 2;
		const phidot = r * ( ur - ul ) / ( 2 * d );

		while ( t < time ) {

			t += timeStep;

			x = x + xdot * timeStep;
			y = y + ydot * timeStep;
			phi = phi + phidot * timeStep;

			xdot = r * ( ur + ul ) * Math.cos( phi ) / 2;
			ydot = r * ( ur + ul ) * Math.sin( phi ) / 2;

		}

		return [ x, y, phi ];

	};

	const restart = () => {

		ur = 20 + ( Math.random() - 0.5 ) * 0.2;
		ul = 20 + ( Math.random() - 0.5 ) * 0.2;

	};

	const duration = 10;
	const timeStep = 0.05;

	const controls = wmr.addPlayerControls( duration, timeStep, simulate, restart );

	const e = document.querySelector<HTMLDivElement>( '#app' );
	e?.parentElement?.insertBefore( controls, e.nextSibling );

}
