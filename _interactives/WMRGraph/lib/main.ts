import '../node_modules/jsxgraph/distrib/jsxgraph.css';
import imageURL from '../images/wmr.svg';

import { JSXGraph, Board, Point } from 'jsxgraph';

type RotationCB = ( phi: number ) => void;
type TranslationCB = ( x: number, y: number ) => void;

// TODO:
// - allow user to set the position and rotation

export class WMRGraph {

	private board: Board;

	constructor( elementID: string, rotationCB: RotationCB, translationCB: TranslationCB ) {

		const bsize = 20;

		this.board = JSXGraph.initBoard( elementID, {
			boundingbox: [ - bsize, bsize, bsize, - bsize ],
			axis: true,
			keepaspectratio: true,
			showCopyright: false,
			showNavigation: false,
		} );

		const size = 3;
		const half_size = size / 2;

		// Center at origin facing right
		const center = this.board.create( 'point', [ 0, 0 ], { name: 'C' } );

		// Forward point used to adjust the rotation angle
		const circle = this.board.create( 'circle', [ center, half_size ], { visible: false } );
		const rotation = this.board.create( 'glider', [ circle ], { name: 'r', showInfoBox: false } );

		// NOTE: The image must be square
		// Attach image to the center point
		// TODO: allow dragging the image
		const image = this.board.create( 'image', [ imageURL, [ () => center.X() - half_size, () => center.Y() - half_size ], [ size, size ]] );

		// Rotate the image based on the rotation point
		const rotator = this.board.create( 'transform', [ 'atan2(Y(r) - Y(C), X(r) - X(C))', center ], { type: 'rotate' } );
		rotator.bindTo( image );

		center.on( 'drag', () => translationCB( center.X(), center.Y() ) );

		// @ts-ignore
		rotation.on( 'drag', () => rotationCB( Math.atan2( rotation.Y() - center.Y(), rotation.X() - center.X() ) ) );

	}

	addObstacle( obstaclePoints: number[][] ) {

		this.board.create( 'polygon', obstaclePoints );

	}

}
