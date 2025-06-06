# AudioCanvas

## Core Requirements and Goals

AudioCanvas is a node-based visual audio programming environment, similar to Max/MSP, Pure Data, Bitwig Grid or VCV Rack. The main difference is that it works entirely in the browser, without the need to install any software.

Its primary function is to teach electronic music, sound synthesis and modular style patching to people with no previous experience. It contains step-by-step tutorials where users add/remove nodes and make connections between them. The program checks if each tutorial step was performed successfully and correctly before allowing the user to proceed, ensuring they understand the concepts.

## Project Scope

AudioCanvas aims to be the best online platform for learning synthesis and electronic music through interactive tutorials. The project scope includes:

1. A browser-based node editor with real-time audio processing
2. A comprehensive set of audio nodes (oscillators, filters, envelopes, etc.)
3. Step-by-step interactive tutorials that teach synthesis concepts
4. Local storage for saving user projects without requiring accounts
5. A clean, intuitive user interface built with Svelte

## Mission

Our mission is to make the best online synthesis and electronic music tutorials to enable people to get into the world of modular synthesis, sound synthesis in general, and electronic music creation.

The first batch of tutorials will be completely free for all users, making synthesis education accessible to everyone.

## High-Level Architecture

AudioCanvas consists of several key components:

1. **Audio Engine**: A framework-agnostic core that handles audio processing using Web Audio API and WebAssembly

   - Serialized node definitions (`audio/serialized/v1/types.ts`)
   - Static node definitions (`audio/serialized/v1/staticDefinitions.ts`)
   - Runtime node implementations (`audio/initialized/nodes.ts`)
   - Custom WebAssembly audio processors (`audio/web-audio/wasm/`)

2. **User Interface**: A Svelte/SvelteKit application that provides the visual programming environment

   - Main canvas component (`src/components/AudioCanvas.svelte`)
   - Node components and UI elements

3. **Tutorial System**: Step-by-step interactive lessons

   - Tutorial content in Markdown/MDSvex (`src/components/Tutorial/Tutorial*/Copy*.md`)
   - Validation logic in TypeScript (`src/components/Tutorial/Tutorial*/Check*.ts`)

4. **Project Management**: Local storage-based project saving and loading
   - No backend required
   - Users can start learning without creating an account

## Current Tutorial Content

Currently, there are 4 tutorials implemented:

1. **Your First Sounds**: Introduction to nodes and connections
2. **Types of Signals**: Theory on signal flow and visualization
3. **Synthesizing Techno Kick**: Practical application of synthesis concepts
4. **Frequency and Amplitude**: Exploring oscillator properties and waveforms

## Future Development

Planned future tutorials include:

1. **Tutorial 5**: Creating a voice that changes oscillator types on each note press

   - Requires implementing the Switch node and a new Count node
   - Will demonstrate differences between oscillator sounds

2. **Tutorial 6**: Exploring the spectrum of standard oscillators
   - Explaining fundamentals and harmonics
   - Building on concepts from previous tutorials

The development approach alternates between theory-heavy and practical tutorials to keep users engaged and motivated.
