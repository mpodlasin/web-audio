# Product Context

## Why AudioCanvas Exists

AudioCanvas was created to address the steep learning curve associated with modular synthesis and electronic music production. Traditional modular synthesis tools like hardware synthesizers, Max/MSP, Pure Data, or VCV Rack require significant setup, installation, and technical knowledge before users can start making music. This creates a high barrier to entry for beginners interested in learning about sound synthesis.

AudioCanvas exists to democratize access to synthesis education by:

1. Eliminating installation barriers by running entirely in the browser
2. Providing structured, interactive learning rather than overwhelming open-endedness
3. Making synthesis concepts tangible through visual programming and immediate audio feedback
4. Creating a guided path from basic concepts to practical music-making skills

## Problems AudioCanvas Solves

1. **Accessibility**: Traditional synthesis tools are often expensive, require powerful computers, or demand technical knowledge to set up. AudioCanvas runs in any modern browser, making it accessible to anyone with internet access.

2. **Learning Curve**: Most synthesis environments drop users into a blank canvas with hundreds of modules and no guidance. AudioCanvas provides structured tutorials that introduce concepts gradually.

3. **Immediate Feedback**: In traditional learning environments, it's difficult to know if you're doing things correctly. AudioCanvas validates each step, ensuring users understand concepts before moving forward.

4. **Engagement**: Many synthesis tutorials are theoretical and text-heavy. AudioCanvas makes learning interactive and audible, maintaining user engagement through practical exercises.

5. **Progression**: Self-directed learning often leads to knowledge gaps. AudioCanvas ensures a logical progression of concepts, alternating between theory and practical applications.

## How AudioCanvas Works

AudioCanvas operates as a visual programming environment where users connect nodes (audio modules) to create sound. The core workflow is:

1. **Node Creation**: Users add audio processing nodes to the canvas (oscillators, filters, envelopes, etc.)
2. **Connection**: Users connect node outputs to inputs, creating a signal flow
3. **Parameter Adjustment**: Users modify node parameters to shape the sound
4. **Audition**: Users hear the results in real-time

In tutorial mode, this workflow is guided by step-by-step instructions. Each tutorial step:
1. Presents information about a concept
2. Asks the user to implement that concept by adding/connecting specific nodes
3. Validates the user's implementation
4. Provides feedback and allows progression when correct

Behind the scenes, AudioCanvas uses the Web Audio API for audio processing, with custom WebAssembly modules for specialized functions. The user interface is built with Svelte, providing a responsive and intuitive experience.

## User Experience Goals

1. **Intuitive Interface**: Users should understand how to interact with the system within minutes, with clear visual cues for connections and parameters.

2. **Progressive Disclosure**: Complexity should be revealed gradually, with early tutorials focusing on basic concepts and later ones introducing more advanced techniques.

3. **Immediate Feedback**: Audio changes should be heard instantly when connections are made or parameters adjusted, reinforcing the cause-and-effect relationship.

4. **Guided Discovery**: Tutorials should provide enough structure to prevent frustration while allowing room for experimentation and discovery.

5. **Sense of Achievement**: Each tutorial should result in a satisfying musical outcome, giving users a sense of accomplishment and motivation to continue.

6. **Frictionless Learning**: Users should be able to start learning immediately without account creation, downloads, or complex setup procedures.

7. **Visual Understanding**: Complex audio concepts should be made tangible through visualization tools like oscilloscopes and spectrum analyzers.

8. **Practical Application**: Theory should always be connected to practical music-making applications to maintain relevance and engagement.

## Target Audience

AudioCanvas is designed primarily for:

1. **Complete Beginners**: People with no prior experience in sound synthesis or electronic music
2. **Music Educators**: Teachers looking for interactive tools to explain synthesis concepts
3. **Music Production Students**: Those looking to supplement formal education with interactive exercises
4. **Curious Musicians**: Traditional musicians interested in exploring electronic sound design
5. **Casual Experimenters**: People who want to play with sound without committing to expensive hardware or software

The interface and tutorials are designed to be approachable for beginners while still offering enough depth to be interesting for those with some prior knowledge.
