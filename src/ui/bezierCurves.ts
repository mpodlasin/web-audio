import type { Position } from '../audio/serialized';

/**
 * Calculates a smooth Bézier curve path between two points
 * @param from Starting position
 * @param to Ending position
 * @returns SVG path string for the Bézier curve
 */
export function calculateBezierPath(from: Position, to: Position): string {
	// Calculate the horizontal and vertical distances between points
	const deltaX = Math.abs(to.x - from.x);
	const deltaY = Math.abs(to.y - from.y);
	
	// Calculate the aspect ratio to determine how vertical the line is
	// When deltaX is small compared to deltaY, the line is more vertical
	const aspectRatio = deltaX / (deltaY + 1); // +1 to avoid division by zero
	
	// Reduce curvature for more vertical lines
	// aspectRatio approaches 0 for vertical lines, 1+ for horizontal lines
	const verticalityFactor = Math.min(aspectRatio, 1);
	
	// Base control point offset - responsive to distance but with min/max bounds
	const baseControlOffset = Math.min(Math.max(deltaX * 0.5, 50), 150);
	
	// Apply verticality factor to reduce curvature for vertical lines
	const controlOffset = baseControlOffset * verticalityFactor;
	
	// Detect connection direction to avoid squiggly curves
	const isRightToLeft = to.x < from.x;
	
	let cp1x, cp2x;
	
	if (isRightToLeft) {
		// Right-to-left connection: mirror the control points
		cp1x = from.x - controlOffset; // Control point 1 extends left from output
		cp2x = to.x + controlOffset;   // Control point 2 extends right toward input
	} else {
		// Left-to-right connection: normal behavior
		cp1x = from.x + controlOffset; // Control point 1 extends right from output
		cp2x = to.x - controlOffset;   // Control point 2 extends left toward input
	}
	
	const cp1y = from.y;
	const cp2y = to.y;
	
	// Create SVG path string using cubic Bézier curve
	return `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;
}

/**
 * Calculates a Bézier curve path with custom control point offset
 * @param from Starting position
 * @param to Ending position
 * @param offset Custom control point offset
 * @returns SVG path string for the Bézier curve
 */
export function calculateBezierPathWithOffset(from: Position, to: Position, offset: number): string {
	// Calculate the horizontal and vertical distances between points
	const deltaX = Math.abs(to.x - from.x);
	const deltaY = Math.abs(to.y - from.y);
	
	// Calculate the aspect ratio to determine how vertical the line is
	const aspectRatio = deltaX / (deltaY + 1); // +1 to avoid division by zero
	
	// Reduce curvature for more vertical lines
	const verticalityFactor = Math.min(aspectRatio, 1);
	
	// Apply verticality factor to the provided offset
	const adjustedOffset = offset * verticalityFactor;
	
	// Detect connection direction to avoid squiggly curves
	const isRightToLeft = to.x < from.x;
	
	let cp1x, cp2x;
	
	if (isRightToLeft) {
		// Right-to-left connection: mirror the control points
		cp1x = from.x - adjustedOffset;
		cp2x = to.x + adjustedOffset;
	} else {
		// Left-to-right connection: normal behavior
		cp1x = from.x + adjustedOffset;
		cp2x = to.x - adjustedOffset;
	}
	
	const cp1y = from.y;
	const cp2y = to.y;
	
	return `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;
}
