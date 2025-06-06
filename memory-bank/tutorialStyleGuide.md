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
- Use visualization nodes (Value, Oscilloscope, Spectrum) to help users discover functionality before explaining it
- Have users observe and interact with node outputs before providing theoretical explanations
- Create "aha!" moments by letting users discover patterns themselves

### Examples:

- "Convince yourself that it the last sentence is true by setting value on Number node to 0."
- "Now, slowly decrease the decay parameter on the AD Envelope node and listen to how it affects the sound."
- "Let's first visualize what the <Clr nodeType="count">Count</Clr> node is outputting. Create a <Clr nodeType="value">Value</Clr> node and connect the output of the <Clr nodeType="count">Count</Clr> node to it."
- "Connect the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator to an <Clr nodeType="oscilloscope">Oscilloscope</Clr> node to see its waveform before we discuss its properties."

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

### Menu-Order Node Listing

- When instructing users to create multiple nodes of the same category, list them in the exact order they appear in the menu
- This reduces cognitive load as users can work through the menu sequentially
- Always verify the menu order in `src/audio/serialized/v1/staticDefinitions.ts` (categorizedNodeTypes object)
- For oscillators, the menu order is: Sine, Saw, Square, Triangle

### Examples:

- "Create a <Clr nodeType="sine-oscillator">Sine</Clr> oscillator, a <Clr nodeType="saw-oscillator">Saw</Clr> oscillator, a <Clr nodeType="square-oscillator">Square</Clr> oscillator, and a <Clr nodeType="triangle-oscillator">Triangle</Clr> oscillator."
- "Add the three filter nodes in menu order: <Clr nodeType="lowpass-filter">Lowpass</Clr>, <Clr nodeType="bandpass-filter">Bandpass</Clr>, and <Clr nodeType="highpass-filter">Highpass</Clr>."

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

---

# Case Study: Human vs. AI Authorship in Tutorial 5 – A Detailed Comparison

This section provides a comprehensive, example-rich analysis of the differences between the AI-generated and user-edited versions of Tutorial 5 ("Cycling Through Oscillators"). It demonstrates how the application of the style guide’s principles leads to a more effective, engaging, and pedagogically sound tutorial.

## 1. Introduction and Motivation

**AI Version Example:**

> "Today, we'll build on that knowledge to create something more dynamic: a voice that changes its oscillator type with each note, automatically cycling through the different timbres."

**User Version Example:**

> "You should be able to distinguish between them easily, so in this tutorial we will build a voice that will change the oscillator type on each note, allowing you to more easily compare their tones."

**Analysis:**  
The user version directly references the learner’s prior experience and frames the tutorial as a tool for deeper understanding. This approach is more motivating and connects new material to what the user has already learned, as recommended in the style guide.

---

## 2. Step Structure and Pacing

**AI Version Example:**  
Some steps combine multiple actions and explanations:

> "Now we need a way to select between these four oscillators. This is where the Switch node comes in. You can find it in the Effect section of the node creation menu. Create a Switch node."

**User Version Example:**  
Steps are more granular and focused:

> "Now we need a way to select between these four oscillators.  
> This is where the Switch node comes in. You can find it in the Effect section of the node creation menu.  
> Create a Switch node."

**Analysis:**  
The user version breaks down instructions into smaller, digestible steps, making it easier for users to follow along and reducing cognitive load. This aligns with the style guide’s “step-by-step progression” and “consistent step structure.”

---

## 3. Guided Discovery and Experimentation

**AI Version Example:**

> "Let's first visualize what the Count node is outputting. Create a Value node and connect the output of the Count node to it. Press the play button if it's not already on. You should see the Value node displaying numbers changing from 0 to 3 as the Clock sends triggers to the Count node."

**User Version Example:**

> "Before we connect the Count node to the Switch node, let's first investigate how it works on its own.  
> Create a Value node and connect the output of the Count node to it.  
> Also feel free to reduce the volume on the Output node to 0."

**Analysis:**  
The user version encourages the learner to experiment and observe before proceeding, fostering a sense of discovery. It also adds practical advice (e.g., reducing volume), which supports a more user-friendly experience.

---

## 4. Technical Accuracy and Clarity

**AI Version Example:**

> "The Count node counts incoming triggers and outputs the current count. It has a modulo parameter that determines when the count resets. For example, if the modulo is set to 4, the Count node will output values 0, 1, 2, 3 in sequence, then start over."

**User Version Example:**

> "When the Count node receives a trigger via its input, it increases a number emitted on its output by one.  
> The count starts at 0 and ends at 7, because we have set the modulo parameter to 8.  
> Set the modulo parameter to 4 and see what happens."

**Analysis:**  
The user version is more explicit about parameter values and their effects, and it prompts the user to observe the result of changing parameters. This reinforces the importance of technical accuracy and hands-on learning.

---

## 5. Encouragement and Support

**AI Version Example:**

> "Try changing the channel parameter on the Switch node to 2, 3, and 4 to hear the different oscillator types."

**User Version Example:**

> "Play around with its tempo parameter to see how it will affect the sound."

**Analysis:**  
The user version more frequently encourages experimentation and reassures the learner, which is in line with the style guide’s emphasis on an encouraging and supportive tone.

---

## 6. Concrete Before Abstract

**AI Version Example:**

> "The Count node outputs values 0-3, but we need values 1-4 to select our oscillator inputs. With this setup, each time the Clock node sends a trigger, the Count node will increment its count and output the new value. The Switch node will use this value (plus the input parameter value of 1) to select a different oscillator..."

**User Version Example:**

> "Note that the channel parameter there has values in the range from 1 to 4.  
> This means, that if we set it to 1 and then connect the output of the Count node to it (going from 0 to 3), we will cycle through all 4 possible values this parameter has.  
> This way, on each trigger coming from the Clock node, we will hear a different oscillator, just as we wanted."

**Analysis:**  
The user version has the learner perform the action and observe the result before explaining the underlying theory, which is more effective for learning.

---

## 7. Conciseness and Focus

**AI Version Example:**  
Some steps are verbose or combine multiple ideas.

**User Version Example:**  
Steps are concise, focused, and avoid unnecessary detail. For example, the user version omits redundant explanations and gets to the hands-on steps more quickly.

**Analysis:**  
This reflects the style guide’s advice to keep steps focused and introductions concise.

---

## 8. Parameter and Node Naming Consistency

**AI Version Example:**  
Generally consistent, but sometimes less explicit about parameter names and ranges.

**User Version Example:**  
Always uses the Clr component for node names, refers to parameters by their exact names, and is explicit about value ranges and their significance.

**Analysis:**  
This is in line with the style guide’s “terminology conventions” and “consistent parameter terminology.”

---

## 9. User Experience and Troubleshooting

**AI Version Example:**  
Minimal troubleshooting advice.

**User Version Example:**  
Offers suggestions like reducing the output volume when experimenting, and encourages users to observe and adjust as needed.

**Analysis:**  
This supports the style guide’s recommendations for validation, feedback, and inclusive language.

---

## 10. Summary Table: Key Differences

| Aspect             | AI Version                    | User Version (Preferred)              |
| ------------------ | ----------------------------- | ------------------------------------- |
| Introduction       | Informative, generic          | Learner-focused, connects to prior    |
| Step Structure     | Sometimes dense, multi-action | Granular, single-action, clear pacing |
| Guided Discovery   | Less frequent                 | Frequent, encourages experimentation  |
| Technical Accuracy | Good, sometimes glossed over  | Explicit, careful, parameter-focused  |
| Encouragement      | Some, procedural              | Frequent, supportive, motivating      |
| Concrete/Abstract  | Theory before action          | Action before theory                  |
| Conciseness        | Sometimes verbose             | Concise, focused, streamlined         |
| Naming Consistency | Good, sometimes less explicit | Always explicit, Clr component used   |
| Troubleshooting    | Minimal                       | Present, user-focused                 |

---

## Why the User’s Version is Preferred

- **Better aligns with the AudioCanvas tutorial style guide**
- More effective at building understanding through hands-on discovery
- Provides a more supportive and engaging learning experience
- Ensures technical accuracy and clarity
- Encourages experimentation and observation
- Maintains consistent terminology and formatting

---

## Best Practices Illustrated

- **Connect new material to prior knowledge**: Reference previous tutorials and explain why the new concept matters.
- **Break down instructions**: Use granular steps, each with a single focus.
- **Encourage observation and experimentation**: Prompt users to try things and observe results before explaining theory.
- **Be explicit about parameters and values**: Always state parameter ranges, defaults, and effects.
- **Support and reassure**: Use language that encourages and motivates.
- **Maintain consistency**: Use the Clr component and exact parameter names throughout.
- **Provide troubleshooting tips**: Anticipate where users might get stuck and offer solutions.

---

**Conclusion:**  
This case study demonstrates how careful editing and adherence to the style guide transform a technically correct but generic tutorial into a highly effective, learner-centered experience. Future tutorial authors should use this comparison as a model for best practices in AudioCanvas tutorial writing.
