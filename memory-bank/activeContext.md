# Active Context

## Current Work Focus

The current development focus for AudioCanvas is on expanding the tutorial content and implementing new node types needed for upcoming tutorials. Specifically:

### Tutorial 5 Development

We're working on Tutorial 5, which will teach users how to create a voice that changes oscillator types on each note press. This tutorial will:

1. Demonstrate the differences between the "big 4" oscillator types (sine, square, saw, triangle)
2. Teach users about signal routing and switching between audio sources
3. Introduce more advanced patching techniques

To support this tutorial, we need to:
- ✅ Complete the implementation of the Switch node
- Create a new Count node (not yet implemented)
- Design the tutorial steps and validation logic
- Write the tutorial content

### Node Implementation

1. **Switch Node**
   - ✅ The Switch node implementation is now complete
   - ✅ It allows selecting between multiple audio inputs (up to 4) based on a control signal
   - ✅ The implementation in `src/audio/web-audio/wasm/switch/switch.c` has been completed to match the worklet
   - ✅ The node can now be used in patches to dynamically route audio signals

2. **Count Node**
   - This node needs to be created from scratch
   - It will count incoming trigger signals and output the current count
   - Can be used to cycle through different options (like oscillator types)
   - Will need both serialized definition and runtime implementation

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

## Next Steps

### Short-term (Next 2-4 Weeks)

1. **Complete Switch Node Implementation**
   - Finish the runtime audio processing for the Switch node
   - Test with various audio sources
   - Ensure smooth switching without clicks or pops

2. **Implement Count Node**
   - Create serialized definition in `src/audio/serialized/v1/types.ts` and `staticDefinitions.ts`
   - Implement runtime node in `src/audio/initialized/nodes.ts`
   - Create WebAssembly module if necessary for performance
   - Test with trigger signals

3. **Begin Tutorial 5 Content**
   - Outline the tutorial steps
   - Create validation functions for each step
   - Write the tutorial copy
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
