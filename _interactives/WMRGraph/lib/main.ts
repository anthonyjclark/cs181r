import '../node_modules/jsxgraph/distrib/jsxgraph.css';
import imageURL from '../images/wmr.svg';

import { JSXGraph, Board, Point } from 'jsxgraph';

type RotationCB = ( phi: number ) => void;
type TranslationCB = ( x: number, y: number ) => void;

export class WMRGraph {

	private board: Board;
	private center: Point;
	private forward: Point;

	constructor( elementID: string, rotationCB: RotationCB, translationCB: TranslationCB ) {

		this.board = JSXGraph.initBoard( elementID, {
			boundingbox: [ - 10, 10, 10, - 10 ],
			axis: true,
			keepaspectratio: true,
			showCopyright: false,
			showNavigation: false,
		} );

		const size = 3;
		const half_size = size / 2;

		// Center at origin facing right
		this.center = this.board.create( 'point', [ 0, 0 ], { name: 'COM' } );
		this.forward = this.board.create( 'point', [ half_size, 0 ], { name: 'R' } );

		// The image should be square
		// Attach image to the center point
		const image = this.board.create( 'image', [ imageURL, [ () => this.center.X() - size / 2, () => this.center.Y() - size / 2 ], [ size, size ]] );

		// Move forward point with center point
		const wmrTranslator = this.board.create( 'transform', [ () => this.center.X(), () => this.center.Y() ], { type: 'translate' } );
		wmrTranslator.bindTo( this.forward );

		// Update wmr angle based on the forward point
		const wmrForwardAngle = () => Math.atan2( this.forward.Y() - this.center.Y(), this.forward.X() - this.center.X() );
		const rotator = this.board.create( 'transform', [ wmrForwardAngle, this.center ], { type: 'rotate' } );
		rotator.bindTo( image );

		// Constrain forward point to circle around the center point
		this.board.on( 'move', () => {

			this.board.suspendUpdate();

			const angle = wmrForwardAngle();
			const x = half_size * Math.cos( angle ) + this.center.X();
			const y = half_size * Math.sin( angle ) + this.center.Y();
			this.forward.moveTo( [ x, y ] );

			this.board.unsuspendUpdate();

		} );

		this.center.on( 'drag', () => translationCB( this.center.X(), this.center.Y() ) );
		this.forward.on( 'drag', () => rotationCB( wmrForwardAngle() ) );

	}

	addObstacle( obstaclePoints: number[][] ) {

		this.board.create( 'polygon', obstaclePoints );

	}

}
