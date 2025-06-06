# Tutorial 5 Outline: Oscillator Switching

## Tutorial Structure

### Introduction (Steps 1-2)

- Welcome to Tutorial 5
- Brief mention of what we'll build: a patch that cycles through different oscillator types with each note
- Reference to the four oscillator types we learned about in Tutorial 4

### Building the Oscillator Bank (Steps 3-8)

- Create all four oscillator types (Sine, Triangle, Square, Saw)
- Create a Switch node
- Connect each oscillator to a different input on the Switch
- Create a Gain node and connect the Switch output to it
- Connect the Gain to the Output node
- Test each oscillator by manually changing the Switch input parameter

### Setting Up Automatic Oscillator Switching (Steps 9-15)

- Create a Clock node for timing
- Introduce the Count node and explain its basic function
- Create a Count node and connect it to the Clock
- Configure the Count node to cycle through 4 values (for our 4 oscillator types)
- Connect the Count node to the Switch's input parameter
- Test the setup and hear how each clock trigger cycles to a different oscillator
- Add an AD Envelope for amplitude shaping
- Connect the Clock to the AD Envelope trigger and the AD Envelope to the Gain

### Adding Melodic Control (Steps 16-22)

- Create a Sequencer node for melody
- Add a Pitch Quantizer for musical scales
- Set up a simple melody sequence
- Connect the Pitch Quantizer to all oscillator frequency parameters
- Test the complete patch and hear how each note uses a different oscillator type
- Add Convolution (reverb) for a more polished sound
- Adjust parameters for the best musical result

### Refinement and Creative Variations (Steps 23-27)

- Experiment with different Count node modulo values to create different patterns
- Try different tempo settings
- Adjust the AD Envelope for different note articulations
- Create variations in the melody
- Discuss how this technique can be used in musical contexts

### Summary (Steps 28-29)

- Recap what we've built: a melody generator that cycles through different oscillator types
- Encourage experimentation with the patch

## Key Learning Objectives

1. Understanding how to use the Switch node to select between different audio sources
2. Learning how to use the Count node to create cycling patterns
3. Building a practical, musical patch that demonstrates oscillator switching
4. Creating dynamic, evolving sounds through automated oscillator selection

## Technical Focus

The tutorial will focus on:

- Getting sound quickly by building the oscillator bank first
- Adding automation with the Count node
- Creating melodic variation with the Sequencer
- Using the new Switch and Count nodes in a creative context

This structure prioritizes immediate audio feedback by building the oscillator bank first, then adds automation with the Count node, and finally incorporates melodic control with the Sequencer. This approach should keep users engaged by providing audio feedback at each stage of the tutorial.
