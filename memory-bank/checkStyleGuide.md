# AudioCanvas Tutorial Validation Guide

## Table of Contents

1. [Introduction and Philosophy](#introduction-and-philosophy)
2. [SerializedAudioElements Deep Dive](#serializedaudioelements-deep-dive)
3. [Validation Function Anatomy](#validation-function-anatomy)
4. [Core Validation Patterns](#core-validation-patterns)
5. [Advanced Validation Techniques](#advanced-validation-techniques)
6. [Best Practices](#best-practices)
7. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)
8. [Utility Functions Reference](#utility-functions-reference)
9. [Complete Examples](#complete-examples)
10. [Tutorial-Specific Validation Strategies](#tutorial-specific-validation-strategies)

## Introduction and Philosophy

### Purpose of Validation

Validation functions in AudioCanvas tutorials serve multiple critical purposes:

1. **Educational Verification**: They confirm that users have understood and correctly implemented the concepts being taught.
2. **Progression Control**: They ensure users have completed necessary prerequisites before advancing to more complex concepts.
3. **Guided Discovery**: They allow for some flexibility in implementation while ensuring core learning objectives are met.
4. **Immediate Feedback**: They provide a mechanism for users to know when they've successfully completed a step.

### Validation Philosophy

The validation system follows these philosophical principles:

1. **Balance Between Strictness and Flexibility**: Validation should be strict enough to ensure learning objectives are met, but flexible enough to allow for creative exploration and different approaches to solving problems.

2. **Progressive Complexity**: Early tutorial steps should have simpler validation requirements, with complexity increasing as users gain proficiency.

3. **Invisible Scaffolding**: Validation functions should work behind the scenes, supporting the learning experience without becoming the focus of attention.

4. **Fail Fast, Fail Informatively**: When validation fails, it should be immediately clear and provide guidance on what's missing or incorrect.

5. **Positive Reinforcement**: Successful validation should feel rewarding and motivate continued progress.

## SerializedAudioElements Deep Dive

### Structure Overview

The `SerializedAudioElements` type is the foundation of all validation functions. It represents the complete state of the audio graph as a serializable JavaScript object:

```typescript
export type SerializedAudioElements = {
	[key: string]: AllowedSerializedAudioElements;
};
```

This is a dictionary where:

- Keys are unique string identifiers for each node
- Values are node objects conforming to the `AllowedSerializedAudioElements` type

### Node Structure

Each node in the audio graph has this general structure:

```typescript
{
    type: 'node-type', // e.g., 'sine-oscillator', 'gain', etc.
    inputs: [
        { id: 'source-node-id', output: 'output-name', input: 'input-name' }
    ],
    parameters: {
        paramName: {
            base: number, // The base parameter value
            inputs: [
                { id: 'modulation-source-id', output: 'output-name', multiply: number }
            ]
        }
    },
    ui: {
        position: { x: number, y: number },
        primaryColor: string
    }
}
```

### Key Properties Explained

#### 1. `type`

The node type identifier (e.g., 'sine-oscillator', 'gain', 'destination'). This corresponds to the types defined in `staticDefinitions.ts`.

#### 2. `inputs`

An array of connections from other nodes to this node's inputs. Each connection has:

- `id`: The source node's unique identifier
- `output`: The output port name on the source node
- `input`: The input port name on this node

#### 3. `parameters`

A dictionary of parameter objects, where each key is the parameter name. Each parameter has:

- `base`: The base value set by the user
- `inputs`: An array of modulation connections, similar to node inputs but with an additional `multiply` property that determines modulation amount

#### 4. `ui`

Contains visual information about the node:

- `position`: The node's coordinates on the canvas
- `primaryColor`: The node's color

### Special Node Types

Some nodes have additional properties:

- `CommentNode`: Has a `comment` property containing the text
- `TutorialNode`: Has a `tutorialId` property referencing the tutorial

## Validation Function Anatomy

### Basic Structure

Every validation function follows this pattern:

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Description of what this validation checks for
export default function (audioGraph: SerializedAudioElements) {
	// Validation logic
	return true; // or false, or a condition
}
```

### Function Signature

The validation function:

- Takes a single parameter: the current state of the audio graph
- Returns a boolean indicating whether validation passed or failed
- Is exported as the default export from the file

### Execution Context

Validation functions are executed:

- When the user attempts to proceed to the next tutorial step
- In the browser's JavaScript environment
- With the current state of the audio graph as the input

### Return Value Semantics

- `true`: Validation passed, user can proceed
- `false`: Validation failed, user must correct their implementation

### Future Enhancement Path

The validation system is designed to eventually support more detailed feedback:

```typescript
export default function (audioGraph: SerializedAudioElements) {
	// Validation logic
	return {
		success: true, // or false
		message: 'Optional message explaining why validation failed'
	};
}
```

## Core Validation Patterns

### 1. Node Existence Validation

#### Finding Nodes by Type

The most fundamental validation pattern is checking if a specific type of node exists:

```typescript
const sineOscillator = Object.values(audioGraph).find((node) => node.type === 'sine-oscillator');
return !!sineOscillator; // Convert to boolean
```

#### Counting Nodes by Type

Sometimes you need to verify that a specific number of nodes exist:

```typescript
const oscillators = Object.values(audioGraph).filter(
	(node) =>
		node.type === 'sine-oscillator' ||
		node.type === 'saw-oscillator' ||
		node.type === 'square-oscillator' ||
		node.type === 'triangle-oscillator'
);
return oscillators.length === 4; // Exactly 4 oscillators
```

#### Verifying Node Absence

Sometimes you need to verify that a node has been removed:

```typescript
const triangleOscillator = Object.values(audioGraph).find(
	(node) => node.type === 'triangle-oscillator'
);
return !triangleOscillator; // Should not exist
```

#### Multiple Node Requirements

Often you need to check for multiple nodes:

```typescript
const sineNode = Object.values(audioGraph).find((node) => node.type === 'sine-oscillator');
const gainNode = Object.values(audioGraph).find((node) => node.type === 'gain');
const outputNode = Object.values(audioGraph).find((node) => node.type === 'destination');

return !!sineNode && !!gainNode && !!outputNode; // All three must exist
```

### 2. Connection Validation

#### Finding Node IDs

Before checking connections, you need to find the node IDs:

```typescript
const nodes = Object.values(audioGraph);
const entries = Object.entries(audioGraph);

const sineNode = nodes.find((node) => node.type === 'sine-oscillator');
const gainNode = nodes.find((node) => node.type === 'gain');

// Get the IDs
const sineNodeId = entries.find((entry) => entry[1] === sineNode)?.[0];
const gainNodeId = entries.find((entry) => entry[1] === gainNode)?.[0];
```

#### Checking Direct Connections

To check if one node is connected to another:

```typescript
// Check if sine is connected to gain
const sineConnectedToGain = gainNode?.inputs?.some((input) => input.id === sineNodeId) ?? false;
```

#### Checking Connection Chains

To verify a chain of connections:

```typescript
// Check if sine -> gain -> output
const sineConnectedToGain = gainNode?.inputs?.some((input) => input.id === sineNodeId) ?? false;
const gainConnectedToOutput = outputNode?.inputs?.some((input) => input.id === gainNodeId) ?? false;

return sineConnectedToGain && gainConnectedToOutput;
```

#### Checking Parameter Connections

To verify connections to parameters (modulation):

```typescript
// Check if LFO is connected to oscillator frequency
const lfoConnectedToFreq =
	sineNode?.parameters?.frequency?.inputs.some((input) => input.id === lfoNodeId) ?? false;
```

### 3. Parameter Value Validation

#### Checking Exact Values

To verify a parameter has an exact value:

```typescript
// Check if frequency is exactly 440 Hz
return sineNode?.parameters?.frequency?.base === 440;
```

#### Checking Value Ranges

To verify a parameter is within a range:

```typescript
// Check if attack is between 10 and 100 ms
const attack = envelope?.parameters?.attack?.base ?? 0;
return attack >= 10 && attack <= 100;
```

#### Checking Value Changes

To verify a parameter has been changed from its default:

```typescript
// Check if frequency has been changed from 440 Hz
const frequency = sineNode?.parameters?.frequency?.base ?? 440;
return frequency !== 440;
```

#### Checking Multiple Parameters

To verify multiple parameters:

```typescript
// Check if attack is short and decay is long
const attack = envelope?.parameters?.attack?.base ?? 0;
const decay = envelope?.parameters?.decay?.base ?? 0;

return attack < 50 && decay > 200;
```

### 4. Complex Graph Structure Validation

#### Verifying Signal Paths

To verify complete signal paths:

```typescript
// Verify oscillator -> filter -> gain -> output path
const oscillatorConnectedToFilter =
	filterNode?.inputs?.some((input) => input.id === oscillatorNodeId) ?? false;
const filterConnectedToGain = gainNode?.inputs?.some((input) => input.id === filterNodeId) ?? false;
const gainConnectedToOutput = outputNode?.inputs?.some((input) => input.id === gainNodeId) ?? false;

return oscillatorConnectedToFilter && filterConnectedToGain && gainConnectedToOutput;
```

#### Verifying Modulation Structures

To verify modulation setups:

```typescript
// Verify envelope modulating filter cutoff
const envelopeModulatingCutoff =
	filterNode?.parameters?.frequency?.inputs.some((input) => input.id === envelopeNodeId) ?? false;

// Check modulation amount
const modulationAmount =
	filterNode?.parameters?.frequency?.inputs.find((input) => input.id === envelopeNodeId)
		?.multiply ?? 0;

return envelopeModulatingCutoff && modulationAmount > 500;
```

## Advanced Validation Techniques

### 1. Conditional Validation

Sometimes validation requirements depend on the state of the graph:

```typescript
// If user has chosen the "filter" path, check for filter nodes
// If user has chosen the "delay" path, check for delay nodes
const hasFilter = Object.values(audioGraph).some(
	(node) => node.type === 'lowpass-filter' || node.type === 'highpass-filter'
);

if (hasFilter) {
	return validateFilterPath(audioGraph);
} else {
	return validateDelayPath(audioGraph);
}

function validateFilterPath(audioGraph: SerializedAudioElements) {
	// Filter-specific validation
}

function validateDelayPath(audioGraph: SerializedAudioElements) {
	// Delay-specific validation
}
```

### 2. Partial Validation

For complex steps, consider breaking validation into parts:

```typescript
// Check node existence
const nodesExist = checkRequiredNodesExist(audioGraph);
if (!nodesExist) return false;

// Check connections
const connectionsCorrect = checkRequiredConnections(audioGraph);
if (!connectionsCorrect) return false;

// Check parameters
return checkParameterValues(audioGraph);

function checkRequiredNodesExist(audioGraph: SerializedAudioElements) {
	// Node existence checks
}

function checkRequiredConnections(audioGraph: SerializedAudioElements) {
	// Connection checks
}

function checkParameterValues(audioGraph: SerializedAudioElements) {
	// Parameter value checks
}
```

### 3. Fuzzy Validation

For creative steps, consider more flexible validation:

```typescript
// Check if any parameter has been changed significantly
function anyParameterChanged(
	node: AllowedSerializedAudioElements,
	paramName: string,
	threshold: number = 0.1
) {
	const defaultValue = getDefaultValueForParameter(node.type, paramName);
	const currentValue = node.parameters?.[paramName]?.base ?? defaultValue;

	// Calculate percent change
	const percentChange = Math.abs((currentValue - defaultValue) / defaultValue);

	return percentChange > threshold;
}

// Check if user has experimented with the filter
const filter = Object.values(audioGraph).find((node) => node.type === 'lowpass-filter');
return (
	anyParameterChanged(filter, 'frequency', 0.2) || anyParameterChanged(filter, 'resonance', 0.2)
);
```

### 4. Validation with Utility Functions

Create utility functions for common validation patterns:

```typescript
// Utility function to check if two nodes are connected
function areNodesConnected(
	audioGraph: SerializedAudioElements,
	sourceType: string,
	targetType: string
): boolean {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	const sourceNode = nodes.find((node) => node.type === sourceType);
	const targetNode = nodes.find((node) => node.type === targetType);

	if (!sourceNode || !targetNode) return false;

	const sourceId = entries.find((entry) => entry[1] === sourceNode)?.[0];
	return targetNode.inputs.some((input) => input.id === sourceId);
}

// Usage
return areNodesConnected(audioGraph, 'sine-oscillator', 'gain');
```

## Best Practices

### 1. Safety and Robustness

#### Always Use Optional Chaining

Audio graphs can be in various states of completion, so always use optional chaining to prevent errors:

```typescript
// Good
const frequency = oscillator?.parameters?.frequency?.base ?? 440;

// Bad - will throw error if any part of the path is undefined
const frequency = oscillator.parameters.frequency.base;
```

#### Provide Default Values

Use the nullish coalescing operator to provide sensible defaults:

```typescript
const attack = envelope?.parameters?.attack?.base ?? 0;
const hasOscillator =
	!!Object.values(audioGraph).find((node) => node.type === 'sine-oscillator') ?? false;
```

#### Check for Node Existence Before Deeper Validation

Always verify nodes exist before checking their properties:

```typescript
const oscillator = Object.values(audioGraph).find((node) => node.type === 'sine-oscillator');
if (!oscillator) return false;

// Now safe to check properties
return oscillator.parameters.frequency.base === 440;
```

### 2. Code Organization and Readability

#### Use Descriptive Variable Names

Choose names that clearly indicate what the variable represents:

```typescript
// Good
const sineOscillator = nodes.find((node) => node.type === 'sine-oscillator');
const isConnectedToOutput = outputNode.inputs.some((input) => input.id === oscillatorId);

// Bad
const n1 = nodes.find((node) => node.type === 'sine-oscillator');
const c1 = outputNode.inputs.some((input) => input.id === oscillatorId);
```

#### Extract Complex Logic to Named Functions

For complex validation, extract logic to named functions:

```typescript
export default function (audioGraph: SerializedAudioElements) {
	return (
		hasRequiredNodes(audioGraph) &&
		connectionsAreCorrect(audioGraph) &&
		parametersAreInRange(audioGraph)
	);
}

function hasRequiredNodes(audioGraph: SerializedAudioElements): boolean {
	// Node existence checks
}

function connectionsAreCorrect(audioGraph: SerializedAudioElements): boolean {
	// Connection checks
}

function parametersAreInRange(audioGraph: SerializedAudioElements): boolean {
	// Parameter checks
}
```

#### Use Consistent Patterns

Establish and follow consistent patterns across all validation functions:

```typescript
// Consistent pattern for all validation functions
export default function (audioGraph: SerializedAudioElements) {
	// 1. Extract nodes
	const nodes = Object.values(audioGraph);

	// 2. Find required nodes
	const requiredNodes = findRequiredNodes(nodes);
	if (!allNodesExist(requiredNodes)) return false;

	// 3. Check connections
	if (!connectionsAreCorrect(audioGraph, requiredNodes)) return false;

	// 4. Check parameters
	return parametersAreCorrect(requiredNodes);
}
```

### 3. Documentation and Comments

#### Add a Top-Level Comment

Every validation function should have a clear comment explaining what it checks:

```typescript
// Checks that a Sine Oscillator is connected to a Gain node, which is then connected to an Output node.
// The Sine Oscillator's frequency should be set to 440 Hz and the Gain node's gain should be 0.5.
export default function (audioGraph: SerializedAudioElements) {
	// Validation logic
}
```

#### Comment Complex Logic

Add inline comments for complex validation logic:

```typescript
// Find all oscillator nodes
const oscillators = Object.values(audioGraph).filter(
	(node) =>
		// Check for any of the four oscillator types
		node.type === 'sine-oscillator' ||
		node.type === 'saw-oscillator' ||
		node.type === 'square-oscillator' ||
		node.type === 'triangle-oscillator'
);

// Ensure we have exactly one of each type
const hasSine = oscillators.some((node) => node.type === 'sine-oscillator');
const hasSaw = oscillators.some((node) => node.type === 'saw-oscillator');
const hasSquare = oscillators.some((node) => node.type === 'square-oscillator');
const hasTriangle = oscillators.some((node) => node.type === 'triangle-oscillator');

return hasSine && hasSaw && hasSquare && hasTriangle;
```

### 4. Validation Strictness

#### Balance Strictness with Flexibility

Consider how strict validation should be for each step:

```typescript
// Strict validation - exact frequency required
return oscillator.parameters.frequency.base === 440;

// Flexible validation - any frequency in a range
const frequency = oscillator.parameters.frequency.base;
return frequency >= 400 && frequency <= 500;

// Very flexible validation - any non-default frequency
const defaultFrequency = 440;
return oscillator.parameters.frequency.base !== defaultFrequency;
```

#### Progressive Strictness

Early tutorial steps should be more lenient, with strictness increasing as users progress:

```typescript
// Early tutorial - just check if the node exists
return !!Object.values(audioGraph).find((node) => node.type === 'sine-oscillator');

// Mid tutorial - check connections
return sineConnectedToOutput;

// Late tutorial - check specific parameter values
return frequency === 440 && gain === 0.5;
```

## Common Pitfalls and Solutions

### 1. Undefined Property Access

#### Pitfall

Accessing properties without checking for existence can cause errors:

```typescript
// Will throw error if oscillator is undefined
const frequency = oscillator.parameters.frequency.base;
```

#### Solution

Always use optional chaining and provide defaults:

```typescript
const frequency = oscillator?.parameters?.frequency?.base ?? 440;
```

### 2. Missing Node IDs

#### Pitfall

Forgetting to get node IDs before checking connections:

```typescript
// Incorrect - sineNode is the node object, not its ID
const isConnected = gainNode.inputs.some((input) => input.id === sineNode);
```

#### Solution

Always extract node IDs from the entries:

```typescript
const entries = Object.entries(audioGraph);
const sineNodeId = entries.find((entry) => entry[1] === sineNode)?.[0];
const isConnected = gainNode.inputs.some((input) => input.id === sineNodeId);
```

### 3. Overly Strict Validation

#### Pitfall

Making validation too strict can frustrate users:

```typescript
// Too strict - requires exact position
return node.ui.position.x === 100 && node.ui.position.y === 200;
```

#### Solution

Focus on functional aspects, not visual details:

```typescript
// Better - focuses on what matters (connections and parameters)
return nodeConnectedCorrectly && parameterSetCorrectly;
```

### 4. Insufficient Validation

#### Pitfall

Making validation too lenient can let users skip important concepts:

```typescript
// Too lenient - just checks if any oscillator exists
return !!Object.values(audioGraph).find((node) => node.type.includes('oscillator'));
```

#### Solution

Be specific about requirements while allowing reasonable flexibility:

```typescript
// Better - checks for specific oscillator type and connection
const sineOscillator = Object.values(audioGraph).find((node) => node.type === 'sine-oscillator');
if (!sineOscillator) return false;

// Check connection to output
const outputNode = Object.values(audioGraph).find((node) => node.type === 'destination');
if (!outputNode) return false;

const entries = Object.entries(audioGraph);
const oscillatorId = entries.find((entry) => entry[1] === sineOscillator)?.[0];
return outputNode.inputs.some((input) => input.id === oscillatorId);
```

### 5. Ignoring Parameter Modulation

#### Pitfall

Only checking base parameter values without considering modulation:

```typescript
// Incomplete - ignores modulation
return oscillator.parameters.frequency.base === 440;
```

#### Solution

Consider both base values and modulation when relevant:

```typescript
// Better - checks both base value and modulation
const frequency = oscillator.parameters.frequency;
const baseValueCorrect = frequency.base === 440;
const hasModulation = frequency.inputs.length > 0;

return baseValueCorrect && hasModulation;
```

## Utility Functions Reference

### Node Finding Functions

```typescript
// Find a node by type
function findNodeByType(audioGraph: SerializedAudioElements, type: string) {
	return Object.values(audioGraph).find((node) => node.type === type);
}

// Find all nodes of a type
function findAllNodesByType(audioGraph: SerializedAudioElements, type: string) {
	return Object.values(audioGraph).filter((node) => node.type === type);
}

// Find a node's ID
function findNodeId(audioGraph: SerializedAudioElements, node: AllowedSerializedAudioElements) {
	return Object.entries(audioGraph).find((entry) => entry[1] === node)?.[0];
}

// Count nodes by type
function countNodesByType(audioGraph: SerializedAudioElements, type: string) {
	return Object.values(audioGraph).filter((node) => node.type === type).length;
}
```

### Connection Checking Functions

```typescript
// Check if two nodes are directly connected
function areNodesConnected(
	audioGraph: SerializedAudioElements,
	sourceNode: AllowedSerializedAudioElements,
	targetNode: AllowedSerializedAudioElements
) {
	const sourceId = findNodeId(audioGraph, sourceNode);
	return targetNode.inputs.some((input) => input.id === sourceId);
}

// Check if a node is connected to a parameter
function isNodeConnectedToParameter(
	audioGraph: SerializedAudioElements,
	sourceNode: AllowedSerializedAudioElements,
	targetNode: AllowedSerializedAudioElements,
	parameterName: string
) {
	const sourceId = findNodeId(audioGraph, sourceNode);
	return (
		targetNode.parameters?.[parameterName]?.inputs.some((input) => input.id === sourceId) ?? false
	);
}

// Check connection chain (A -> B -> C)
function isConnectionChainValid(audioGraph: SerializedAudioElements, nodeTypes: string[]) {
	// Find all nodes in the chain
	const nodes = nodeTypes.map((type) => findNodeByType(audioGraph, type));
	if (nodes.some((node) => !node)) return false;

	// Check each connection in the chain
	for (let i = 0; i < nodes.length - 1; i++) {
		const sourceId = findNodeId(audioGraph, nodes[i]);
		const targetConnected = nodes[i + 1].inputs.some((input) => input.id === sourceId);
		if (!targetConnected) return false;
	}

	return true;
}
```

### Parameter Checking Functions

```typescript
// Check if a parameter has a specific value
function hasParameterValue(
	node: AllowedSerializedAudioElements,
	parameterName: string,
	value: number
) {
	return node.parameters?.[parameterName]?.base === value;
}

// Check if a parameter is in a range
function isParameterInRange(
	node: AllowedSerializedAudioElements,
	parameterName: string,
	min: number,
	max: number
) {
	const value = node.parameters?.[parameterName]?.base ?? 0;
	return value >= min && value <= max;
}

// Check if a parameter has been changed from default
function hasParameterChanged(
	node: AllowedSerializedAudioElements,
	parameterName: string,
	defaultValue: number
) {
	return node.parameters?.[parameterName]?.base !== defaultValue;
}

// Check if a parameter has modulation
function hasParameterModulation(node: AllowedSerializedAudioElements, parameterName: string) {
	return (node.parameters?.[parameterName]?.inputs.length ?? 0) > 0;
}
```

## Complete Examples

### Example 1: Basic Node and Connection Check

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Sine Oscillator is connected to an Output node
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find required nodes
	const sineOscillator = nodes.find((node) => node.type === 'sine-oscillator');
	const outputNode = nodes.find((node) => node.type === 'destination');

	// Ensure both nodes exist
	if (!sineOscillator || !outputNode) {
		return false;
	}

	// Get the sine oscillator's ID
	const sineOscillatorId = entries.find((entry) => entry[1] === sineOscillator)?.[0];

	// Check if sine oscillator is connected to output
	const isConnected = outputNode.inputs.some((input) => input.id === sineOscillatorId);

	return isConnected;
}
```

### Example 2: Complex Validation with Multiple Requirements

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks for a complete synthesizer patch with oscillator, filter, envelope, and output
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// 1. Find all required nodes
	const oscillator = nodes.find((node) => node.type === 'sine-oscillator');
	const filter = nodes.find((node) => node.type === 'lowpass-filter');
	const envelope = nodes.find((node) => node.type === 'ad-envelope');
	const output = nodes.find((node) => node.type === 'destination');

	// Ensure all nodes exist
	if (!oscillator || !filter || !envelope || !output) {
		return false;
	}

	// 2. Get node IDs
	const oscillatorId = entries.find((entry) => entry[1] === oscillator)?.[0];
	const filterId = entries.find((entry) => entry[1] === filter)?.[0];
	const envelopeId = entries.find((entry) => entry[1] === envelope)?.[0];

	// 3. Check connections
	// Oscillator -> Filter
	const oscillatorConnectedToFilter = filter.inputs.some((input) => input.id === oscillatorId);

	// Filter -> Output
	const filterConnectedToOutput = output.inputs.some((input) => input.id === filterId);

	// Envelope -> Filter Cutoff (parameter modulation)
	const envelopeModulatingCutoff =
		filter.parameters?.frequency?.inputs.some((input) => input.id === envelopeId) ?? false;

	// 4. Check parameter values
	// Envelope attack should be short (< 100ms)
	const attackIsShort = (envelope.parameters?.attack?.base ?? 0) < 100;

	// Envelope decay should be moderate (200-1000ms)
	const decayValue = envelope.parameters?.decay?.base ?? 0;
	const decayIsModerate = decayValue >= 200 && decayValue <= 1000;

	// Filter resonance should be non-zero
	const resonanceIsSet = (filter.parameters?.resonance?.base ?? 0) > 0;

	// 5. Combine all conditions
	return (
		oscillatorConnectedToFilter &&
		filterConnectedToOutput &&
		envelopeModulatingCutoff &&
		attackIsShort &&
		decayIsModerate &&
		resonanceIsSet
	);
}
```

### Example 3: Validation with Utility Functions

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Utility functions
function findNodeByType(audioGraph: SerializedAudioElements, type: string) {
	return Object.values(audioGraph).find((node) => node.type === type);
}

function findNodeId(audioGraph: SerializedAudioElements, node: any) {
	return Object.entries(audioGraph).find((entry) => entry[1] === node)?.[0];
}

function areNodesConnected(
	audioGraph: SerializedAudioElements,
	sourceType: string,
	targetType: string
) {
	const sourceNode = findNodeByType(audioGraph, sourceType);
	const targetNode = findNodeByType(audioGraph, targetType);

	if (!sourceNode || !targetNode) return false;

	const sourceId = findNodeId(audioGraph, sourceNode);
	return targetNode.inputs.some((input) => input.id === sourceId);
}

function hasParameterValue(
	audioGraph: SerializedAudioElements,
	nodeType: string,
	paramName: string,
	value: number
) {
	const node = findNodeByType(audioGraph, nodeType);
	return node?.parameters?.[paramName]?.base === value;
}

// Main validation function
export default function (audioGraph: SerializedAudioElements) {
	// Check node existence
	const hasOscillator = !!findNodeByType(audioGraph, 'sine-oscillator');
	const hasGain = !!findNodeByType(audioGraph, 'gain');
	const hasOutput = !!findNodeByType(audioGraph, 'destination');

	if (!hasOscillator || !hasGain || !hasOutput) return false;

	// Check connections
	const oscillatorConnectedToGain = areNodesConnected(audioGraph, 'sine-oscillator', 'gain');
	const gainConnectedToOutput = areNodesConnected(audioGraph, 'gain', 'destination');

	// Check parameters
	const frequencyIs440 = hasParameterValue(audioGraph, 'sine-oscillator', 'frequency', 440);
	const gainIs05 = hasParameterValue(audioGraph, 'gain', 'gain', 0.5);

	return oscillatorConnectedToGain && gainConnectedToOutput && frequencyIs440 && gainIs05;
}
```

## Tutorial-Specific Validation Strategies

### Tutorial 5: Cycling Through Oscillators

Based on the content of Tutorial 5, here are specific validation strategies for each major step:

#### 1. Oscillator Creation Validation

For steps that require creating the four oscillator types:

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that all four oscillator types have been created
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Check for each oscillator type
	const hasSineOscillator = nodes.some((node) => node.type === 'sine-oscillator');
	const hasSawOscillator = nodes.some((node) => node.type === 'saw-oscillator');
	const hasSquareOscillator = nodes.some((node) => node.type === 'square-oscillator');
	const hasTriangleOscillator = nodes.some((node) => node.type === 'triangle-oscillator');

	// All four oscillator types must exist
	return hasSineOscillator && hasSawOscillator && hasSquareOscillator && hasTriangleOscillator;
}
```

#### 2. Switch Node Validation

For steps involving the Switch node:

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Switch node exists and has the correct channel parameter value
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find the Switch node
	const switchNode = nodes.find((node) => node.type === 'switch');
	if (!switchNode) return false;

	// Check if the channel parameter is set to 1
	const channelValue = switchNode.parameters?.channel?.base ?? 0;
	return channelValue === 1;
}
```

#### 3. Oscillator-to-Switch Connection Validation

For steps requiring connections between oscillators and the Switch node:

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that all four oscillators are connected to the Switch node
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find all required nodes
	const sineOscillator = nodes.find((node) => node.type === 'sine-oscillator');
	const sawOscillator = nodes.find((node) => node.type === 'saw-oscillator');
	const squareOscillator = nodes.find((node) => node.type === 'square-oscillator');
	const triangleOscillator = nodes.find((node) => node.type === 'triangle-oscillator');
	const switchNode = nodes.find((node) => node.type === 'switch');

	// Ensure all nodes exist
	if (
		!sineOscillator ||
		!sawOscillator ||
		!squareOscillator ||
		!triangleOscillator ||
		!switchNode
	) {
		return false;
	}

	// Get node IDs
	const sineId = entries.find((entry) => entry[1] === sineOscillator)?.[0];
	const sawId = entries.find((entry) => entry[1] === sawOscillator)?.[0];
	const squareId = entries.find((entry) => entry[1] === squareOscillator)?.[0];
	const triangleId = entries.find((entry) => entry[1] === triangleOscillator)?.[0];

	// Check if each oscillator is connected to the Switch node
	// Note: The Switch node has inputs with specific names (audio-a, audio-b, audio-c, audio-d)
	const sineConnected = switchNode.inputs.some((input) => input.id === sineId);
	const sawConnected = switchNode.inputs.some((input) => input.id === sawId);
	const squareConnected = switchNode.inputs.some((input) => input.id === squareId);
	const triangleConnected = switchNode.inputs.some((input) => input.id === triangleId);

	// All oscillators must be connected to the Switch node
	return sineConnected && sawConnected && squareConnected && triangleConnected;
}
```

#### 4. Count Node Validation

For steps involving the Count node:

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Count node exists with modulo parameter set to 4
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find the Count node
	const countNode = nodes.find((node) => node.type === 'count');
	if (!countNode) return false;

	// Check if the modulo parameter is set to 4
	const moduloValue = countNode.parameters?.modulo?.base ?? 0;
	return moduloValue === 4;
}
```

#### 5. Clock-to-Count Connection Validation

For steps requiring the Clock to be connected to the Count node:

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Clock node is connected to a Count node
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find the Clock and Count nodes
	const clockNode = nodes.find((node) => node.type === 'clock');
	const countNode = nodes.find((node) => node.type === 'count');

	// Ensure both nodes exist
	if (!clockNode || !countNode) return false;

	// Get the Clock node ID
	const clockId = entries.find((entry) => entry[1] === clockNode)?.[0];

	// Check if the Clock is connected to the Count node
	return countNode.inputs.some((input) => input.id === clockId);
}
```

#### 6. Count-to-Switch Parameter Connection Validation

For steps requiring the Count node to be connected to the Switch node's channel parameter:

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Count node is connected to the Switch node's channel parameter
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find the Count and Switch nodes
	const countNode = nodes.find((node) => node.type === 'count');
	const switchNode = nodes.find((node) => node.type === 'switch');

	// Ensure both nodes exist
	if (!countNode || !switchNode) return false;

	// Get the Count node ID
	const countId = entries.find((entry) => entry[1] === countNode)?.[0];

	// Check if the Count node is connected to the Switch node's channel parameter
	return switchNode.parameters?.channel?.inputs.some((input) => input.id === countId) ?? false;
}
```

#### 7. Complete Signal Path Validation

For steps requiring the complete signal path from oscillators through Switch to Output:

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks the complete signal path: Oscillators -> Switch -> Gain -> Output
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find all required nodes
	const switchNode = nodes.find((node) => node.type === 'switch');
	const gainNode = nodes.find((node) => node.type === 'gain');
	const outputNode = nodes.find((node) => node.type === 'destination');

	// Ensure all nodes exist
	if (!switchNode || !gainNode || !outputNode) return false;

	// Get node IDs
	const switchId = entries.find((entry) => entry[1] === switchNode)?.[0];
	const gainId = entries.find((entry) => entry[1] === gainNode)?.[0];

	// Check connections
	const switchConnectedToGain = gainNode.inputs.some((input) => input.id === switchId);
	const gainConnectedToOutput = outputNode.inputs.some((input) => input.id === gainId);

	return switchConnectedToGain && gainConnectedToOutput;
}
```

#### 8. AD Envelope Integration Validation

For steps involving the AD Envelope:

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the AD Envelope is properly integrated into the patch
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find all required nodes
	const clockNode = nodes.find((node) => node.type === 'clock');
	const envelopeNode = nodes.find((node) => node.type === 'ad-envelope');
	const gainNode = nodes.find((node) => node.type === 'gain');

	// Ensure all nodes exist
	if (!clockNode || !envelopeNode || !gainNode) return false;

	// Get node IDs
	const clockId = entries.find((entry) => entry[1] === clockNode)?.[0];
	const envelopeId = entries.find((entry) => entry[1] === envelopeNode)?.[0];

	// Check connections
	const clockConnectedToEnvelope = envelopeNode.inputs.some((input) => input.id === clockId);
	const envelopeConnectedToGainParam =
		gainNode.parameters?.gain?.inputs.some((input) => input.id === envelopeId) ?? false;

	// Check if gain base parameter is set to 0 (letting envelope control it fully)
	const gainBaseIsZero = gainNode.parameters?.gain?.base === 0;

	// Check envelope parameters
	const attackValue = envelopeNode.parameters?.attack?.base ?? 0;
	const decayValue = envelopeNode.parameters?.decay?.base ?? 0;

	// Attack should be between 5-10ms and decay should be above 500ms
	const attackInRange = attackValue >= 5 && attackValue <= 10;
	const decayAbove500 = decayValue >= 500;

	return (
		clockConnectedToEnvelope &&
		envelopeConnectedToGainParam &&
		gainBaseIsZero &&
		attackInRange &&
		decayAbove500
	);
}
```

#### 9. Sequencer and Pitch Quantizer Validation

For steps involving the Sequencer and Pitch Quantizer:

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Sequencer and Pitch Quantizer are properly integrated
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find all required nodes
	const clockNode = nodes.find((node) => node.type === 'clock');
	const sequencerNode = nodes.find((node) => node.type === 'sequencer');
	const quantizerNode = nodes.find((node) => node.type === 'pitch-quantizer');

	// Ensure all nodes exist
	if (!clockNode || !sequencerNode || !quantizerNode) return false;

	// Get node IDs
	const clockId = entries.find((entry) => entry[1] === clockNode)?.[0];
	const sequencerId = entries.find((entry) => entry[1] === sequencerNode)?.[0];

	// Check connections
	const clockConnectedToSequencer = sequencerNode.inputs.some((input) => input.id === clockId);
	const sequencerConnectedToQuantizer = quantizerNode.inputs.some(
		(input) => input.id === sequencerId
	);

	return clockConnectedToSequencer && sequencerConnectedToQuantizer;
}
```

#### 10. Oscillator Frequency Control Validation

For steps requiring the Pitch Quantizer to control all oscillator frequencies:

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Pitch Quantizer controls all oscillator frequencies
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find all required nodes
	const quantizerNode = nodes.find((node) => node.type === 'pitch-quantizer');
	const sineOscillator = nodes.find((node) => node.type === 'sine-oscillator');
	const sawOscillator = nodes.find((node) => node.type === 'saw-oscillator');
	const squareOscillator = nodes.find((node) => node.type === 'square-oscillator');
	const triangleOscillator = nodes.find((node) => node.type === 'triangle-oscillator');

	// Ensure all nodes exist
	if (
		!quantizerNode ||
		!sineOscillator ||
		!sawOscillator ||
		!squareOscillator ||
		!triangleOscillator
	) {
		return false;
	}

	// Get the Pitch Quantizer ID
	const quantizerId = entries.find((entry) => entry[1] === quantizerNode)?.[0];

	// Check if the Pitch Quantizer is connected to each oscillator's frequency parameter
	const connectedToSine =
		sineOscillator.parameters?.frequency?.inputs.some((input) => input.id === quantizerId) ?? false;

	const connectedToSaw =
		sawOscillator.parameters?.frequency?.inputs.some((input) => input.id === quantizerId) ?? false;

	const connectedToSquare =
		squareOscillator.parameters?.frequency?.inputs.some((input) => input.id === quantizerId) ??
		false;

	const connectedToTriangle =
		triangleOscillator.parameters?.frequency?.inputs.some((input) => input.id === quantizerId) ??
		false;

	// Check if all oscillator frequency base values are set to 0
	const sineFreqIsZero = sineOscillator.parameters?.frequency?.base === 0;
	const sawFreqIsZero = sawOscillator.parameters?.frequency?.base === 0;
	const squareFreqIsZero = squareOscillator.parameters?.frequency?.base === 0;
	const triangleFreqIsZero = triangleOscillator.parameters?.frequency?.base === 0;

	return (
		connectedToSine &&
		connectedToSaw &&
		connectedToSquare &&
		connectedToTriangle &&
		sineFreqIsZero &&
		sawFreqIsZero &&
		squareFreqIsZero &&
		triangleFreqIsZero
	);
}
```

#### 11. Convolution (Reverb) Validation

For steps involving the Convolution (reverb) node:

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Convolution node is properly integrated between Gain and Output
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Find all required nodes
	const gainNode = nodes.find((node) => node.type === 'gain');
	const convolutionNode = nodes.find((node) => node.type === 'convolution');
	const outputNode = nodes.find((node) => node.type === 'destination');

	// Ensure all nodes exist
	if (!gainNode || !convolutionNode || !outputNode) return false;

	// Get node IDs
	const gainId = entries.find((entry) => entry[1] === gainNode)?.[0];
	const convolutionId = entries.find((entry) => entry[1] === convolutionNode)?.[0];

	// Check connections
	const gainConnectedToConvolution = convolutionNode.inputs.some((input) => input.id === gainId);
	const convolutionConnectedToOutput = outputNode.inputs.some(
		(input) => input.id === convolutionId
	);

	return gainConnectedToConvolution && convolutionConnectedToOutput;
}
```

#### 12. Creative Exploration Validation

For steps encouraging experimentation with different modulo values or oscillator connections:

```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the user has experimented with the Count node's modulo parameter
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find the Count node
	const countNode = nodes.find((node) => node.type === 'count');
	if (!countNode) return false;

	// Check if the modulo parameter has been changed from 4
	const moduloValue = countNode.parameters?.modulo?.base ?? 4;
	return moduloValue !== 4;
}
```

### Validation Strategy for Tutorial 5

When implementing validation functions for Tutorial 5, consider these strategies:

1. **Progressive Validation**: Start with simple node existence checks, then add connection checks, and finally parameter checks as the tutorial progresses.

2. **Focus on Key Concepts**: Emphasize validation of the Switch node's channel parameter, the Count node's modulo parameter, and the connections between them.

3. **Allow Flexibility in Oscillator Order**: While the tutorial suggests a specific order for connecting oscillators to the Switch node, consider allowing flexibility in which oscillator connects to which input.

4. **Validate Parameter Mapping**: Pay special attention to validating that the Count node (outputting 0-3) is properly connected to the Switch node's channel parameter (expecting 1-4) with the base value set to 1.

5. **Balance Strictness with Exploration**: For later steps that encourage experimentation, use more flexible validation that checks for changes rather than specific values.
