import '../node_modules/jsxgraph/distrib/jsxgraph.css';
import imageURL from '../images/wmr.svg';

import { JSXGraph, Board, Point } from 'jsxgraph';

import { Player } from '../../Player/lib/main';

type RotationCB = ( phi: number ) => void;
type TranslationCB = ( x: number, y: number ) => void;

// TODO:
// - allow user to set the position and rotation
// - change cursor when over C or r

export class WMRGraph {

	private board: Board;
	private center: Point;
	private rotation: Point;

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

	addControls(): HTMLFormElement {

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
		const s = 1.5;

		const ur = 20;
		const ul = 19.9;

		const timeStep = 0.1;

		// TODO: simulate from t=0 to t=time on each call to update
		// TODO: add caching

		const update = ( time: number ) => {

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

			console.log( '🚀 ~ WMRGraph ~ update ~', y, x );

			this.center.moveTo( [ x, y ] );
			this.rotation.moveTo( [ x + s * Math.cos( phi ), y + s * Math.sin( phi ) ] );

		};

		const restart = () => {};

		const player = new Player( 10, 0.1, update, restart );
		const controls = player.initialize();

		return controls;

	}

}
