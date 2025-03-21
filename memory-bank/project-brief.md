# AudioCanvas

## Pitch

AudioCanvas is a node-based visual audio programming environment, similar to Max/MSP, Pure Data, Bitwig Grid or VCV Rack.

The main difference is that it works entirely in the browser, without the need to install any software.

But it's primary funciton is to teach electronic music, sound synthesis and modular style patching to people with no previous experience.

It contains step by step tutorials, where user adds/removes nodes and makes connection between them and the program checks if the tutorial step was performed successfully and correctly. Only then the user can move to the next step, which makes sure they understood the assignment.

## Mission

Our mission is to make the best online synthesis and electronic music tutorials to enable people to get into world of modular synthesis, sound synthesis in general and making electronic music.

First batch of tutorial will be completely free for all users.

## Node Types & Static Definitions

There are many nodes in AudioCanvas.

Their type definitions are in `audio/serialized/v1/types.ts` folder.

But the types aren't enough - in order to know what inputs, outputs and parameters these nodes have, we need to consult also `audio/serialized/v1/staticDefinitions.ts` file.

## Runtime nodes and Web Audio nodes

There is also `audio/initialized/nodes.ts` folder, which contains runtime objects representing those nodes.

AudioCanvas works a bit like a React framework - based on serialized node descriptions and static definitions it builds runtime nodes and connects them together. This process happens in `audio/initialized/update` function.

Initialized nodes are on the other hand wrappers over Web Audio API nodes. There are also custom Web Audio nodes, written in C and compiled to WebAssembly. Those custom Web Audio nodes are in `audio/web-audio` folder.

## Svelte UI

The code in `audio` folder is web framework agnostic.

The code from `audio` is then used inside Svelte/Sveltekit web application.

The main component, containing the most logic is the `src/components/AudioCanvas.svelte`.

## Backend

We don't have backend for now and that's great! Let's keep it like that.

We keep users audio graph files in local storage, so when the log in again on their device, they have immediate access to their work.

This means also that they can start learning without even making an account!

## Tutorial Steps - Copy & Check

AudioCanvas consists step by step tutorials.

Each step consists of a: 
- Markdown (actually mdsvex) file with copy/text of the step, for example `src/components/Tutorial/Tutorial1/Copy1.md`.
- TypeScript file with a function that accepts an audio graph (represented by JS object) and checks if the things asked in the tutorial step were actually accomplished, for example `src/components/Tutorial/Tutorial1/Check1.md`.

## Tutorials Written So Far

Currently there are 4 tutorials written:

### 1. Your First Sounds

It creates a simple synth voice using Sine Oscillator, Pitch Sequencer, Pitch Quantizer, Convolution, Output, AD Envelope nodes (and maybe some others). The result is a simple melody being played by the Sine Oscillator with a bit of reverb.

The goal of this tutorial is only to familiarize the user with the concept of nodes and making connections between them.

### 2. Types of Signals

Second tutorial is more theory heavy. It explains that by connecting nodes, a signal is flowing between them - stream of numbers.

It uses visualization nodes like Oscilloscope or Value to prove that all nodes, no matter their function or type simply use numbers to communicate between eachother.

### 3. Synthesizing Techno Kick

Because previous tutorial was so theory heavy, in this we use the concepts from the previous lessons to make simple but effective Techno Kick.

### 4. Frequency and Amplitude

In this tutorial we use again Oscilloscope node to talk more about frequency and amplitude of an oscillator.

We then check out 4 typical oscillators - sine, square, saw and triangle to compare their waveforms and sound.

## General Outline for Future Tutorials

In `routes/learn/(toc)/+page.md` file there is a table of contents which also has written down ideas for future tutorials.

### Alternating with theory and practice tutorials

In general each theory heavy tutorial should be followed by more fun, practical and musical tutorial, to keep user engaged and motivated.

### Making new nodes for new tutorials

When we prepare the new tutorials, we will sometimes face the need to create the new node. 

That's okay, list of nodes is by no means finished yet.

### Tutorial 5

I want tutorial 5 to be about making a voice that on each note press changes oscillator, alternating between the "big 4".

This way user will get to hear more vividly the differenes between their sounds.

For this, we need nodes that are not yet finished, like Switch node and also a Count node, that doesn't exist at all.

### Tutorial 6

There are some materials in tutorial 6 folder.

Those steps are taken out of the previous version of the tutorial 4 - where there was also the spectrum of an oscillator introduced. 

However I decided that it was too much for one tutorial. I want to make tutorial 6 be about the spectrum of standard oscillators - explaining fundamental and harmonics.

I want it to be tutorial 5 not 6, because 5 should be again more practical.

