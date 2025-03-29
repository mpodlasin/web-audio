# Active Context

## Current Work Focus

The current development focus for AudioCanvas is on expanding the tutorial content and implementing new node types needed for upcoming tutorials. Specifically:

### Tutorial Content Access

Complete tutorial content for the first four tutorials is now available in the memory bank:
- `tutorial1copy.md`: Your First Sounds - Introduction to nodes, connections, and basic synthesis
- `tutorial2copy.md`: Types of Signals - Understanding signal types and visualization
- `tutorial3copy.md`: Synthesizing Techno Kick - Practical application of synthesis concepts
- `tutorial4copy.md`: Frequency and Amplitude - Exploring oscillator properties and waveforms
- `tutorialSummary.md`: Comprehensive summary of all tutorial content
- `tutorialStyleGuide.md`: Writing style, structural patterns, and established conventions
- `tutorialWorkflow.md`: Standard process and checklist for creating new tutorials

This organization provides easier access to the full tutorial content for reference when developing new tutorials. The style guide ensures consistency in writing approach, terminology, and instructional techniques across all tutorials. The workflow document standardizes the tutorial creation process, leveraging the new tutorial-splitter script to streamline development.


### Tutorial 5 Development

We're working on Tutorial 5, which will teach users how to create a voice that changes oscillator types on each note press. This tutorial will:

1. Demonstrate the differences between the "big 4" oscillator types (sine, square, saw, triangle)
2. Teach users about signal routing and switching between audio sources
3. Introduce more advanced patching techniques

To support this tutorial, we need to:
- ✅ Complete the implementation of the Switch node
- ✅ Create a new Count node
- ✅ Design the tutorial steps and structure
- ✅ Write the tutorial content (stored in `tutorial5copy.md`)
- Write validation logic

### Node Implementation

1. **Switch Node**
   - ✅ The Switch node implementation is now complete
   - ✅ It allows selecting between multiple audio inputs (up to 4) based on a control signal
   - ✅ The implementation in `src/audio/web-audio/wasm/switch/switch.c` has been completed to match the worklet
   - ✅ The node can now be used in patches to dynamically route audio signals
   - ✅ Implemented a parameter mapping solution to handle browser-specific behavior with AudioWorklet parameters
   - ✅ Created a UI-friendly approach that shows values 1-4 while internally using 0-3
   - ✅ Fixed cross-browser compatibility issues with parameter handling

2. **Count Node**
   - ✅ Successfully implemented by leveraging the existing clock-counter worklet
   - ✅ Counts incoming trigger signals and outputs the current count modulo a parameter
   - ✅ Parameter range limited to 1-16 with linear control for intuitive operation
   - ✅ Can be used to cycle through different options (like oscillator types)
   - ✅ Fixed a critical "offset is out of bounds" error in the worklet by improving parameter handling

### Development Environment Note

**Important**: There are currently issues with the development environment that prevent compiling WebAssembly modules or running the project in the browser directly. When implementing new features:
- Make the best educated guesses based on existing code patterns
- Do not attempt to compile or run the project
- The user will provide feedback and handle testing

## Recent Changes

### 1. Tutorial 4 Completion

Tutorial 4 on "Frequency and Amplitude" was recently completed:
- Explores oscillator properties and waveforms
- Uses the Oscilloscope node to visualize waveforms
- Compares the four standard oscillator types
- Some content related to spectrum analysis was moved to the planned Tutorial 6

### 2. Switch Node Initial Implementation

The Switch node has been partially implemented:
- Static definitions added to `src/audio/serialized/v1/staticDefinitions.ts`
- UI representation is working
- Runtime audio processing still needs work

### 3. UI Improvements

Recent UI enhancements include:
- Better visual feedback for connections
- Improved parameter controls
- More intuitive node dragging and selection
- Color coding for different node categories

### 4. WebAssembly Optimizations

Several WebAssembly modules have been optimized:
- Improved performance for oscillator nodes
- Reduced memory usage
- Better browser compatibility

### 5. Switch Node Parameter Renaming

The Switch node's parameter has been renamed from "input" to "channel" for improved clarity:
- Renamed across all layers of the architecture (UI, serialized representation, runtime implementation, WebAssembly/C code)
- Eliminates ambiguity between the parameter and the physical inputs of the node
- Maintains the parameter mapping pattern that uses UI-friendly values (1-4) while using efficient internal processing values (0-3)
- Tutorial content has been updated to reflect the new parameter name
- This change reinforces our commitment to intuitive parameter naming and consistent cross-layer implementation

### 6. Tutorial Content Processing Script

We've created a Node.js script to streamline the tutorial development workflow:
- The `tutorial-splitter.js` script automates the process of splitting tutorial markdown files from memory-bank into separate Copy*.md files
- It takes a source markdown file and target directory as parameters
- The script automatically:
  - Splits content by "# Step X" headers
  - Creates properly formatted Copy*.md files with Svelte script imports
  - Preserves step numbers in the filenames
- Usage: `node tutorial-splitter.js <source-file> <target-directory>`
- Example: `node tutorial-splitter.js memory-bank/tutorial5copy.md src/components/Tutorial/Tutorial5`
- This significantly reduces the manual effort required to prepare tutorial content for the application
- The script handles the formatting requirements automatically, ensuring consistency across all tutorial steps

## Next Steps

### Short-term (Next 2-4 Weeks)

1. ✅ **Complete Switch Node Implementation**
   - ✅ Finish the runtime audio processing for the Switch node
   - ✅ Test with various audio sources
   - ✅ Ensure smooth switching without clicks or pops

2. ✅ **Implement Count Node**
   - ✅ Created serialized definition in `src/audio/serialized/v1/types.ts` and `staticDefinitions.ts`
   - ✅ Implemented runtime node in `src/audio/initialized/nodes.ts` using existing clock-counter worklet
   - ✅ Fixed buffer handling issue in the worklet to prevent "offset is out of bounds" errors
   - ✅ Made the modulo parameter linear for better user control

3. **Begin Tutorial 5 Content**
   - ✅ Outline the tutorial steps (stored in `tutorial5outline.md`)
   - ✅ Write the tutorial copy (stored in `tutorial5copy.md`)
   - Create validation functions for each step
   - Test the tutorial flow

### Medium-term (Next 2-3 Months)

1. **Complete Tutorial 5**
   - Finalize and polish all steps
   - Add any missing functionality
   - User testing and feedback

2. **Develop Tutorial 6**
   - Focus on spectrum analysis of oscillators
   - Explain fundamentals and harmonics
   - Use the Spectrum node for visualization

3. **Performance Optimizations**
   - Identify and address performance bottlenecks
   - Optimize for mobile devices
   - Reduce memory usage

### Long-term (3+ Months)

1. **Expand Node Library**
   - Add more filter types
   - Implement additional envelope types (ADSR)
   - Create more complex modulation sources

2. **Advanced Tutorials**
   - Create tutorials on filter design
   - Add content on complex modulation techniques
   - Develop tutorials for specific musical styles

3. **Community Features**
   - Explore options for sharing patches
   - Consider lightweight backend for project sharing
   - Investigate export/import functionality

## Active Decisions and Considerations

### 1. Tutorial Sequencing

We're actively considering the optimal sequence for tutorials:
- Current approach alternates between theory and practical applications
- Tutorial 5 (oscillator switching) will be practical
- Tutorial 6 (spectrum analysis) will be more theoretical
- This pattern helps maintain user engagement

### 2. Node Implementation Strategy

For new nodes, we're deciding between:
1. **Web Audio API Native**: Using built-in nodes when possible
2. **WebAssembly**: Creating custom processors for specialized functionality
3. **JavaScript**: Using JS for simpler, non-performance-critical nodes

The decision depends on:
- Performance requirements
- Complexity of the algorithm
- Browser compatibility considerations

### 3. Mobile Support

We're evaluating the best approach for mobile support:
- Current UI works on tablets but is challenging on phones
- Touch interactions need refinement
- Performance on mobile devices varies significantly
- Considering responsive design vs. dedicated mobile interface

### 4. Tutorial Validation Complexity

We're balancing validation thoroughness with user experience:
- Too strict validation can frustrate users
- Too loose validation might not ensure learning
- Current approach checks for specific connections and parameters
- Considering adding hints or progressive assistance for users who get stuck

### 5. WebAssembly Development Workflow

Improving the WebAssembly development workflow is under consideration:
- Current compile script works but is somewhat manual
- Looking at integrating WebAssembly compilation into the main build process
- Exploring better debugging tools for WebAssembly modules
- Considering documentation improvements for WebAssembly development

### 6. Browser Compatibility Considerations

We've identified and addressed several browser-specific issues:
- Chrome's AudioWorklet implementation can behave unexpectedly with non-standard parameter ranges
- When parameter descriptors use ranges that don't start from 0 (e.g., 1-4 instead of 0-3), Chrome may mishandle the values
- This is not a universal behavior but specific to using non-standard parameter ranges in descriptors
- Implemented a solution that uses standard ranges (0-3) in the worklet parameter descriptors
- Used ConstantSourceNode with negative values to map between user-friendly UI ranges (1-4) and standard internal ranges (0-3)
- This approach follows Web Audio API conventions while maintaining intuitive UI values
- Following standard parameter range conventions helps avoid browser-specific quirks

In Tutorial 5, we've implemented a practical example of this parameter mapping:
- The Count node counts from 0 to 3 (with modulo 4)
- The Switch node's UI expects values from 1 to 4 for its channel parameter
- We instruct users to set the Switch node's input parameter to 1
- This creates the mapping: Count outputs (0-3) + input value 1 = effective values (1-4)
- This ensures all four oscillator inputs are properly selected in sequence
- We've added explicit explanations in the tutorial to help users understand this mapping
- This pattern will be applied consistently in future tutorials involving similar parameter mapping requirements

### 7. Tutorial Content Accuracy

We've established an important practice for tutorial development:
- Before writing or editing tutorial content, always consult the source code for accurate node information
- Specifically check `src/audio/serialized/v1/staticDefinitions.ts` and `src/audio/serialized/v1/types.ts`
- This ensures tutorials correctly reference node categories, parameters, inputs/outputs, and behaviors
- Recent example: We discovered the Switch node is categorized under "Effect" not "Utility" in the code
- This verification step prevents user confusion when following tutorial instructions
