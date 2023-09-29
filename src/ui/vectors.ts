import type { Position } from '../audio/serialized';

export const vector = (positionA: Position, positionB: Position): Position => {
	return {
		x: positionB.x - positionA.x,
		y: positionB.y - positionA.y
	};
};

export const normalize = (position: Position): Position => {
	const { x, y } = position;

	const length = Math.sqrt(x * x + y * y);

	return {
		x: x / length,
		y: y / length
	};
};

export const normalizedVector = (positionA: Position, positionB: Position): Position => {
	const vect = vector(positionA, positionB);

	return normalize(vect);
};
