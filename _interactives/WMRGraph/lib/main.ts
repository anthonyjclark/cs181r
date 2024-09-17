import '../node_modules/jsxgraph/distrib/jsxgraph.css';
import imageURL from '../images/wmr.svg';

import { JSXGraph, Board, Point } from 'jsxgraph';

import { Player, RestartCB } from 'player';

type RotationCB = ( phi: number ) => void;
type TranslationCB = ( x: number, y: number ) => void;
type SimulationCB = ( time: number ) => [ number, number, number ];

type Pose = [number, number, number];
type PoseCache = { [index: number]: Pose };

// TODO:
// - allow user to set the position and rotation
// - change cursor when over C or r

export class WMRGraph {

	private board: Board;
	private center: Point;
	private rotation: Point;

	// TODO: reset should clear each cache
	private kinematicsCache: PoseCache = {};
	private dynamicsCache: PoseCache = {};

	constructor( elementID: string, rotationCB: RotationCB, translationCB: TranslationCB ) {

		const bsize = 20;

		this.board = JSXGraph.initBoard( elementID, {
			boundingbox: [ - bsize, bsize, bsize, - bsize ],
			// TODO: maxboundingbox
			// TODO: showfullscreen
			axis: true,
			keepaspectratio: true,
			showCopyright: false,
			showNavigation: false,
		} );

		const size = 3;
		const half_size = size / 2;

		// Center at origin facing right
		this.center = this.board.create( 'point', [ 0, 0 ], { name: 'C' } );

		// Forward point used to adjust the rotation angle
		// TODO: do not show the point if simulating
		const circle = this.board.create( 'circle', [ this.center, half_size ], { visible: false } );
		this.rotation = this.board.create( 'glider', [ circle ], { name: 'r', showInfoBox: false } );

		// NOTE: The image must be square
		// Attach image to the center point
		// TODO: allow dragging the image
		const image = this.board.create( 'image', [ imageURL, [ () => this.center.X() - half_size, () => this.center.Y() - half_size ], [ size, size ]] );

		// Rotate the image based on the rotation point
		const rotator = this.board.create( 'transform', [ 'atan2(Y(r) - Y(C), X(r) - X(C))', this.center ], { type: 'rotate' } );
		rotator.bindTo( image );

		// @ts-ignore
		this.rotation.on( 'drag', () => rotationCB( Math.atan2( this.rotation.Y() - this.center.Y(), this.rotation.X() - this.center.X() ) ) );
		this.center.on( 'drag', () => translationCB( this.center.X(), this.center.Y() ) );

	}

	addObstacle( obstaclePoints: number[][] ) {

		this.board.create( 'polygon', obstaclePoints );

	}

	addPlayerControls( duration: number, timeStep: number, simulate: SimulationCB, restart: RestartCB ): HTMLFormElement {

		// TODO: scale?
		const s = 1.5;

		const update = ( time: number ) => {

			const [ x, y, phi ] = simulate( time );

			this.center.moveTo( [ x, y ] );
			this.rotation.moveTo( [ x + s * Math.cos( phi ), y + s * Math.sin( phi ) ] );

		};

		const player = new Player( duration, timeStep, update, restart );
		const controls = player.initialize();

		return controls;

	}

	kinematicsUpdate( time: number, { timeStep = 0.05, ur = 10.0, ul = 10.0, wheelRadius = 0.035, trackWidth = 0.16, useCache = true } = {} ): Pose {

		// Check the cache
		const index = Math.floor( time / timeStep );
		if ( useCache && this.kinematicsCache[index] !== undefined ) return this.kinematicsCache[index];

		// Initial pose
		let phi = 0;
		let x = 0;
		let y = 0;

		const phidot = wheelRadius * ( ur - ul ) / trackWidth;
		let xdot = wheelRadius * ( ur + ul ) * Math.cos( phi ) / 2;
		let ydot = wheelRadius * ( ur + ul ) * Math.sin( phi ) / 2;

		let t = 0;

		while ( t < time ) {

			t += timeStep;

			x = x + xdot * timeStep;
			y = y + ydot * timeStep;
			phi = phi + phidot * timeStep;

			xdot = wheelRadius * ( ur + ul ) * Math.cos( phi ) / 2;
			ydot = wheelRadius * ( ur + ul ) * Math.sin( phi ) / 2;

		}

		this.kinematicsCache[index] = [ x, y, phi ];
		return [ x, y, phi ];

	}

	dynamicsUpdate( time: number, { timeStep = 0.05, taur = 1.0, taul = 1.0, wheelRadius = 0.035, trackWidth = 0.16, mass = 1.2, inertia = 0.0015, useCache = true } = {} ): Pose {

		// m = 0.75;
		// J = 0.001;
		// L = 0.075;
		// r = 0.024;

		// CHeck the cache
		const index = Math.floor( time / timeStep );
		if ( useCache && this.dynamicsCache[index] !== undefined ) return this.dynamicsCache[index];

		// Initial pose
		let phi = 0;
		let x = 0;
		let y = 0;

		// Initial velocity
		let v = 0;
		let omega = 0;

		let xdot = v * Math.cos( phi );
		let ydot = v * Math.sin( phi );
		let phidot = omega;

		const vdot = ( taur + taul ) / ( mass * wheelRadius );
		const omegadot = ( taur * trackWidth - taul * trackWidth ) / ( 2 * inertia * wheelRadius );

		let t = 0;

		while ( t < time ) {

			t += timeStep;

			x = x + xdot * timeStep;
			y = y + ydot * timeStep;
			phi = phi + phidot * timeStep;

			v = v + vdot * timeStep;
			omega = omega + omegadot * timeStep;

			xdot = v * Math.cos( phi );
			ydot = v * Math.sin( phi );
			phidot = omega;

		}

		this.dynamicsCache[index] = [ x, y, phi ];
		return [ x, y, phi ];

	}

}
