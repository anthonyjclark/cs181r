import '../node_modules/jsxgraph/distrib/jsxgraph.css';
import imageURL from '../images/wmr.svg';

import { JSXGraph, Board, Point } from 'jsxgraph';

import { Player, RestartCB } from 'player';

type RotationCB = ( phi: number ) => void;
type TranslationCB = ( x: number, y: number ) => void;
type SimulationCB = ( time: number ) => [ number, number, number ];

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

}
