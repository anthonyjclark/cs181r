import { html } from 'htl';

export type UpdateCB = ( time: number ) => void;
export type RestartCB = () => void;

export class Player {

	frame: number | null;

	prevTime: number;
	accumulator: number;
	running: boolean;
	wasRunning: boolean;
	timeStep: number;
	numSteps: number;

	update: UpdateCB;
	restart: RestartCB;

	form: HTMLFormElement;

	constructor( timeEnd: number, timeStep: number, update: UpdateCB, restart: RestartCB ) {

		this.frame = null;

		this.prevTime = 0;

		this.accumulator = 0;

		this.running = false;
		this.wasRunning = false;

		this.timeStep = timeStep;

		this.numSteps = timeEnd / timeStep + 1;

		this.update = update;

		this.restart = restart;

		this.form = html`<form>

			<button name="play" type="button" style="width: 5em;"></button>

			<button name="restart" type="button" style="width: 5em;">Reset</button>

			<label>

				<input name="scrubber" type="range" min="0" max="${this.numSteps - 1}" value="0" step="1" />

				<output name="label"></output>

			</label>

		</form>`;

		this.form.scrubber.oninput = () => {

			this.form.label.value = ( this.form.scrubber.valueAsNumber * timeStep ).toFixed( 2 );

		};

		this.form.scrubber.onmousedown = () => {

			this.wasRunning = this.running;

			this.#stop();

		};

		this.form.scrubber.onmouseup = () => {

			if ( this.wasRunning ) this.#start();

		};

		this.form.play.onclick = () => {

			if ( this.running ) return this.#stop();

			this.form.scrubber.valueAsNumber = this.#nextValue();
			this.form.scrubber.dispatchEvent( new CustomEvent( 'input', { bubbles: true } ) );
			this.#start();

		};

		this.form.restart.onclick = () => {

			if ( this.running ) this.#stop();

			this.form.scrubber.valueAsNumber = 0;
			this.form.scrubber.dispatchEvent( new CustomEvent( 'input', { bubbles: true } ) );

			this.restart();

		};

	}

	initialize(): HTMLFormElement {

		this.form.scrubber.oninput();

		this.#stop();
		this.#tick( 0 );

		return this.form;

	}

	#nextValue(): number {

		return ( this.form.scrubber.valueAsNumber + 1 + this.numSteps ) % this.numSteps;

	}

	#start() {

		this.prevTime = 0;
		this.accumulator = 0.0;
		this.running = true;

		this.form.play.textContent = 'Pause';
		this.frame = requestAnimationFrame( time => this.#tick( time ) );

	}

	#stop() {

		this.form.play.textContent = 'Play';
		this.running = false;
		this.accumulator = 0.0;

	}

	#tick( now: number ) {

		if ( ! this.prevTime ) this.prevTime = now;
		let dt = now - this.prevTime;
		this.prevTime = now;

		if ( this.form.scrubber.valueAsNumber === ( this.numSteps - 1 ) ) this.#stop();

		if ( this.running ) {

			this.accumulator += dt;

			if ( this.accumulator >= this.timeStep * 1000.0 ) {

				this.form.scrubber.valueAsNumber = this.#nextValue();
				this.form.scrubber.dispatchEvent( new CustomEvent( 'input', { bubbles: true } ) );
				this.accumulator -= this.timeStep * 1000.0;

			}

		}

		this.update( this.form.scrubber.valueAsNumber * this.timeStep + this.accumulator / 1000.0 );

		this.frame = requestAnimationFrame( time => this.#tick( time ) );

	}

}
