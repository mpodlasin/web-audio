# System Patterns

## System Architecture

AudioCanvas follows a clear architectural separation that enables flexibility, maintainability, and performance. The architecture consists of several distinct layers:

### 1. Serialized Representation Layer

The foundation of AudioCanvas is a serializable representation of the audio graph. This layer:
- Defines the structure of nodes, connections, and parameters
- Provides a JSON-compatible format for storing and loading audio graphs
- Serves as the source of truth for the audio graph state

Key files:
- `src/audio/serialized/v1/types.ts`: Type definitions for serialized audio elements
- `src/audio/serialized/v1/staticDefinitions.ts`: Static definitions of node properties
- `src/audio/serialized/v1/utils.ts`: Utility functions for manipulating serialized audio graphs

### 2. Runtime Initialization Layer

This layer transforms the serialized representation into runtime objects that can process audio:
- Creates Web Audio API nodes based on serialized definitions
- Establishes connections between nodes
- Updates node parameters based on user input

Key files:
- `src/audio/initialized/nodes.ts`: Runtime node implementations
- `src/audio/initialized/update.ts`: Logic for updating the audio graph
- `src/audio/initialized/types.ts`: Type definitions for runtime nodes

### 3. Web Audio Processing Layer

This layer handles the actual audio processing:
- Uses the Web Audio API for standard audio operations
- Implements custom audio processors using WebAssembly for specialized functions
- Manages audio context and global audio state

Key files:
- `src/audio/GlobalContext.ts`: Global audio context management
- `src/audio/web-audio/wasm/`: WebAssembly audio processors
- `src/audio/web-audio/utils.ts`: Utility functions for Web Audio API

### 4. User Interface Layer

The UI layer provides the visual representation and interaction capabilities:
- Renders nodes and connections on the canvas
- Handles user interactions (dragging, connecting, parameter adjustment)
- Provides visual feedback for audio state

Key files:
- `src/components/AudioCanvas.svelte`: Main canvas component
- `src/components/DraggableNode.svelte`: Node component with drag functionality
- `src/components/Node.svelte`: Base node component
- `src/ui/`: UI utility functions

### 5. Tutorial System Layer

This layer manages the tutorial experience:
- Presents tutorial content to users
- Validates user actions against expected outcomes
- Tracks progress through tutorial steps

Key files:
- `src/components/Tutorial/`: Tutorial components and content
- `src/components/TutorialNode.svelte`: Special node for tutorial instructions
- `src/routes/learn/`: Learn section routing and presentation

#### Learn Section Structure

The learn section of the application follows a specific structure:

1. **Table of Contents**:
   - Defined in `src/routes/learn/(toc)/+page.md`
   - Uses Markdown with embedded Svelte components
   - The `ToCItem` component links entries to tutorial content via tutorial IDs
   - Organized into sections (Basics, Oscillators & Filters, etc.)

2. **Tutorial Routes**:
   - Configured in `src/routes/learn/[id]/+page.ts`
   - Maps URL slugs to tutorial IDs and titles
   - Each route entry includes:
     - URL slug (e.g., 'cycling-through-oscillators')
     - Display title (e.g., '5. Cycling Through Oscillators')
     - Tutorial ID (e.g., 'tutorial5')

3. **Tutorial Content**:
   - Each tutorial has its own directory in `src/components/Tutorial/`
   - Copy files (Copy*.md) contain the tutorial text
   - Check files (Check*.ts) contain validation logic
   - An index.ts file connects Copy and Check files into tutorial steps

4. **Integration Workflow**:
   - Create tutorial content (Copy and Check files)
   - Update main tutorial index.ts to include the new tutorial
   - Add entry to table of contents with proper ToCItem component
   - Configure route in the [id]/+page.ts file

## Key Technical Decisions

### 1. Serialized State as Source of Truth

AudioCanvas uses a serialized representation of the audio graph as the source of truth. This decision:
- Enables easy saving and loading of user projects
- Simplifies state management and undo/redo functionality
- Provides a clear contract between the UI and audio processing layers

### 2. React-like Update Pattern

The system uses a React-like update pattern where:
- The UI layer maintains the serialized state
- Changes to the state trigger updates to the runtime audio graph
- The update process efficiently determines what needs to change

This approach:
- Minimizes unnecessary audio processing
- Prevents audio glitches during updates
- Maintains a clean separation between UI and audio processing

### 3. WebAssembly for Custom Audio Processors

Custom audio processors are implemented in C and compiled to WebAssembly, which:
- Provides near-native performance for complex audio algorithms
- Enables specialized functionality not available in the Web Audio API
- Allows for more efficient CPU usage in audio processing

#### WebAssembly Module Reuse Pattern

The system employs a pattern of reusing WebAssembly modules for similar functionality:
- Existing modules can be repurposed for new node types with similar behavior
- For example, the Count node reuses the clock-counter WebAssembly module
- This approach reduces code duplication and simplifies maintenance
- It also ensures consistent behavior across related node types

#### AudioWorklet Parameter Handling

AudioWorklet processors follow a specific pattern for parameter handling:
- Parameters are exposed through the AudioWorkletProcessor's parameterDescriptors
- WebAssembly memory is used to share parameter values between JavaScript and C
- Buffer handling requires careful management to prevent "offset out of bounds" errors
- Single-value parameters should be handled individually rather than using array methods like set()
- Parameter descriptors should follow standard Web Audio API conventions (typically starting from 0)
- Non-standard parameter ranges (e.g., 1-4 instead of 0-3) can cause browser-specific quirks in Chrome
- ConstantSourceNode with negative values can be used to map between UI and processing parameter ranges
- Parameter ranges in worklet descriptors should align with standard audio processing expectations

#### UI-to-Processing Value Mapping

The system employs a pattern for mapping between user-friendly UI values and internal processing values:
- UI parameters often use ranges that are intuitive for users (e.g., 1-4 for selection indices)
- Internal processing may require different ranges (e.g., 0-3 for array indices)
- Custom node implementations use ConstantSourceNode for parameter mapping
- The offsetNode pattern subtracts or adds values to transform between UI and processing ranges
- This approach maintains a clean separation between UI representation and audio processing
- It also ensures consistent behavior across different browsers

### 4. Framework-Agnostic Audio Core

The audio processing core is designed to be framework-agnostic:
- The `audio` directory contains code that doesn't depend on Svelte
- This separation allows for potential future migration to other frameworks
- It also enables clearer testing boundaries

### 5. Local Storage for Project Persistence

Projects are stored in the browser's local storage, which:
- Eliminates the need for a backend server
- Allows users to start immediately without account creation
- Provides a frictionless experience for beginners

## Design Patterns in Use

### 1. Adapter Pattern

The initialized nodes act as adapters between the serialized representation and the Web Audio API:
- They translate the serialized format into Web Audio API nodes
- They handle the specifics of different node types
- They provide a consistent interface for the update process

### 2. Observer Pattern

The system uses an observer pattern for parameter changes:
- Audio parameters can be observed by UI components
- Changes to parameters trigger updates to the audio graph
- This enables real-time feedback between UI and audio

### 3. Command Pattern

Operations on the audio graph (add node, remove connection, etc.) are implemented as commands:
- Each command is a pure function that takes the current state and returns a new state
- This enables easy implementation of undo/redo functionality
- It also simplifies testing and debugging

### 4. Factory Pattern

Node creation uses a factory pattern:
- The `addNode` function acts as a factory for creating new serialized nodes
- Static definitions provide the blueprint for different node types
- This centralizes node creation logic and ensures consistency

### 5. Composite Pattern

The audio graph itself is a composite structure:
- Nodes can be connected to form complex processing chains
- The entire graph is treated as a single unit for operations like saving/loading
- Individual nodes can be manipulated independently

## Component Relationships

### Audio Graph and UI Components

The AudioCanvas.svelte component:
- Owns the serialized audio graph state
- Renders nodes and connections based on this state
- Dispatches operations that modify the state
- Updates the runtime audio graph when the state changes

### Node Hierarchy

Nodes follow a component hierarchy:
1. `DraggableNode.svelte`: Adds drag functionality to nodes
2. `Node.svelte`: Base node component that renders inputs, outputs, and parameters
3. Specialized node components (e.g., `OscilloscopeNode.svelte`): Add specific functionality

### Signal Flow

The signal flow in the audio graph:
1. Source nodes (oscillators, MIDI input) generate signals
2. Processing nodes (filters, envelopes) modify signals
3. Visualization nodes (oscilloscope, spectrum) display signals
4. Destination nodes (output) send signals to the audio output

### Parameter Connections

Parameters can be connected to node outputs, creating a modulation system:
- Node outputs can be connected to parameters of other nodes
- This enables complex modulation and control structures
- The system handles both audio-rate and control-rate connections

### Tutorial Integration

The tutorial system integrates with the audio graph:
- Tutorial steps define expected audio graph states
- The system compares the current state with the expected state
- Tutorial nodes provide instructions within the canvas itself
