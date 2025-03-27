# Tutorial Style Guide

This document outlines the writing style, structural patterns, and established conventions used in the AudioCanvas tutorials. Following these guidelines will help maintain consistency across all tutorials and ensure a cohesive learning experience for users.

## Writing Style and Tone

### Conversational and Approachable
- Use a friendly, conversational tone that addresses the user directly
- Write in second person ("you") to engage the user personally
- Keep sentences relatively short and straightforward
- Avoid overly technical language when introducing new concepts

### Examples:
- "Let's begin by creating a _sine wave oscillator_."
- "You should now hear a tone coming from your speakers or headphones."
- "Don't worry if you don't know what that is!"

### Encouraging and Supportive
- Acknowledge potential challenges or confusion
- Provide reassurance when introducing complex concepts
- Celebrate achievements at key milestones
- Encourage experimentation and exploration

### Examples:
- "If you don't hear anything, make sure your audio settings are set up correctly."
- "What a difference, right?"
- "Feel free to experiment with the frequency and gain parameters if you need more examples of how things work."

## Structural Patterns

### Step-by-Step Progression
- Each tutorial is divided into numbered steps
- Steps follow a logical progression from simple to complex
- Each step focuses on a single concept or action
- Steps build upon previous knowledge

### Consistent Step Structure
- Begin with a clear instruction or explanation
- Provide context for why the action is important
- Include specific directions for implementation
- End with verification or observation of results

### Tutorial Flow Pattern
1. **Introduction**: Overview of what will be learned
2. **Basic Setup**: Creating initial nodes and connections
3. **Core Concept**: Introducing the main topic
4. **Exploration**: Experimenting with parameters and variations
5. **Application**: Applying concepts in a practical context
6. **Refinement**: Fine-tuning and optimization
7. **Summary**: Recap of key learnings

## Instructional Techniques

### Show, Then Explain
- First guide the user to perform an action
- Then explain what happened and why
- Connect new information to previously learned concepts

### Examples:
- "Now that we've added rhythm to the kick, you might notice it's missing a bit of punch in its tone. To give the kick that characteristic 'thump,' we'll create a quick pitch drop at the start of each cycle."

### Concrete Before Abstract
- Start with tangible examples before theoretical explanations
- Use practical demonstrations to illustrate concepts
- Provide theory after users have experienced the concept in action

### Examples:
- In Tutorial 4, users first observe and hear different oscillator types before learning about their theoretical properties

### Guided Discovery
- Prompt users to observe and deduce patterns
- Ask questions that lead users to insights
- Encourage experimentation within controlled parameters

### Examples:
- "Convince yourself that it the last sentence is true by setting value on Number node to 0."
- "Now, slowly decrease the decay parameter on the AD Envelope node and listen to how it affects the sound."

## Visual Elements

### Formatting Conventions
- Use _italics_ for emphasis and to highlight new terms
- Use backticks for `AudioCanvas` and node names when mentioned generically
- Use the Clr component for highlighting node types in context

### Examples:
```
<Clr nodeType="sine-oscillator">Sine</Clr> oscillator
```

### Visual Hierarchy
- Step numbers are prominently displayed
- Important concepts are visually emphasized
- Instructions are clearly separated from explanations
- Node names are consistently highlighted

### Whitespace and Pacing
- Use short paragraphs (1-3 sentences) for readability
- Include blank lines between conceptual sections
- Break complex instructions into bullet points or numbered lists
- Provide visual breathing room between dense explanations

## Terminology Conventions

### Consistent Node Naming
- Use the full node name with proper capitalization when first introducing it
- Use shortened names for subsequent mentions
- Always use the Clr component when referring to specific node types

### Examples:
- First mention: <Clr nodeType="sine-oscillator">Sine Oscillator</Clr>
- Subsequent mentions: <Clr nodeType="sine-oscillator">Sine</Clr>

### Technical Term Introduction
- Introduce technical terms with clear definitions
- Use italics to highlight new terms
- Provide analogies for abstract concepts
- Reinforce terminology through repeated use

### Examples:
- "The state where number 1 is being emitted is called a _gate_ and overall this kind of binary, on/off signal is called a gate signal."
- "We can now see that the <Clr nodeType="gain">Gain</Clr> node performs nothing more than a multiplication by the factor set on the gain knob."

### Consistent Parameter Terminology
- Refer to adjustable controls as "parameters" or "parameter knobs"
- Use specific parameter names consistently (e.g., "frequency parameter" not "frequency knob")
- Specify exact values when instructing users to set parameters

### Examples:
- "Set the frequency parameter of the <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to exactly 1 hertz."
- "From now on, instead of saying 'knob', we will use the term _parameter_ of a node."

## User Interaction Patterns

### Clear Action Instructions
- Begin instructions with action verbs (Create, Connect, Set, Adjust)
- Specify exact locations for interactions
- Provide alternative methods when available
- Include expected outcomes

### Examples:
- "Create a <Clr nodeType="sine-oscillator">Sine</Clr> node and a <Clr nodeType="destination">Output</Clr> node, and connect them together to hear how the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator sounds."
- "You can do it by hand or by double clicking on the parameter knob, which will reset it to its default value."

### Consistent Interaction Vocabulary
- "Create" for adding new nodes
- "Connect" for establishing connections between nodes
- "Set" for assigning specific parameter values
- "Adjust" or "Change" for modifying parameters
- "Delete" or "Remove" for eliminating nodes or connections

### Validation and Feedback
- Provide clear indicators of successful actions
- Describe expected audio or visual feedback
- Offer troubleshooting tips for common issues
- Encourage users to verify results before proceeding

### Examples:
- "You should now hear a tone coming from your speakers or headphones. If you don't hear anything, make sure your audio settings are set up correctly."
- "Look at the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node. You'll notice that the saw waveform has shifted upwards."

## UI and Layout Considerations

### Node Input References
- Inputs on nodes are not labeled with numbers in the UI
- Refer to inputs as "the first input," "the second input," etc.
- Be consistent with this terminology across all tutorials

### Examples:
- "Connect the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator to the first input of the <Clr nodeType="switch">Switch</Clr> node."
- "Connect the output of the <Clr nodeType="sequencer">Sequencer</Clr> to the input of the <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr>."

### Canvas Organization
- Avoid prescribing specific node placement instructions
- Users have different screen sizes and layout preferences
- Focus on functional relationships rather than visual organization
- Let users decide how to arrange their workspace

### Examples:
- Instead of: "Place the Switch node to the right of your oscillators."
- Use: "Create a <Clr nodeType="switch">Switch</Clr> node."

### Concise Introductions
- Keep tutorial introductions concise and focused
- Introduce new nodes clearly but briefly
- Get to the hands-on steps quickly to maintain engagement
- Combine conceptual steps when possible to streamline the tutorial

## Tutorial Progression Conventions

### Knowledge Building Pattern
- Each tutorial builds on concepts from previous tutorials
- New concepts are explicitly connected to previously learned material
- Core concepts are reinforced through different applications
- Technical depth increases gradually across tutorials

### Examples:
- "In the previous tutorial, we learned how to use the <Clr nodeType="ad-envelope">AD Envelope</Clr> node in order to control the volume of the sound to give it a guitar-like 'pluck' sound."
- "We've already encountered this oscillator in its <Clr nodeType="saw-lfo">LFO</Clr> form, but let's take another look at its waveshape and finally hear how it sounds."

### Theory-Practice Alternation
- Alternate between theoretical tutorials and practical applications
- Use practical tutorials to reinforce theoretical concepts
- Follow complex theoretical explanations with creative applications
- Balance technical depth with creative engagement

### Forward References
- Mention concepts that will be explored in future tutorials
- Create anticipation for upcoming learning
- Acknowledge current limitations that will be addressed later
- Provide just enough information without overwhelming

### Examples:
- "In future tutorials, we will explain where this 'richness' comes from."
- "In later tutorials, we will learn that the sine wave is a building block of all sounds."

## Technical Accuracy Verification

### Source of Truth for Node Information
- Always consult the static definitions and types files before writing or editing tutorial content
- Verify node categories, parameters, inputs/outputs, and default values against the code
- Key files to check:
  - `src/audio/serialized/v1/staticDefinitions.ts`: Contains node definitions, categories, parameters, and UI information
  - `src/audio/serialized/v1/types.ts`: Contains type definitions for all nodes

### Common Verification Points
- Node categorization (which menu section contains the node)
- Parameter ranges and default values
- Input/output types and counts
- Node capabilities and limitations
- UI representation and naming conventions

### Examples:
- Verify the Switch node is in the "Effect" category, not "Utility"
- Confirm the Count node's modulo parameter range is 1-16 with a default of 8
- Check that parameter names in tutorials match those in the code

## Accessibility Considerations

### Multiple Learning Modalities
- Combine visual, textual, and auditory learning
- Provide multiple ways to understand concepts
- Use visual tools like Oscilloscope to reinforce audio concepts
- Connect abstract concepts to physical experiences

### Inclusive Language
- Avoid assumptions about prior knowledge
- Provide alternative explanations for complex concepts
- Use analogies to familiar experiences
- Acknowledge different learning paces

### Examples:
- "It turns out that these two concepts are equivalent—shortening the waveform of an oscillator makes us perceive its pitch to be higher."
- "To stay with our guitar analogy, <Clr nodeType="ad-envelope">AD Envelope</Clr> needs to know when to pluck the string of a guitar."
