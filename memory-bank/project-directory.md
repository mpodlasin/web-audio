# Project Directory

This document provides an overview of the AudioCanvas project structure and key dependencies.

## Project Structure

### Root Directory

```
web-audio/
├── memory-bank/       # Project documentation and knowledge repository
├── src/               # Source code
├── static/            # Static assets (audio files, images)
├── package.json       # Project configuration and dependencies
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite build configuration
└── tutorial-splitter.js # Utility script for processing tutorial content
```

### Source Code Organization

```
src/
├── audio/             # Audio processing core (framework-agnostic)
│   ├── serialized/    # Serialized representation of audio graph
│   │   └── v1/        # Version 1 of the serialization format
│   ├── initialized/   # Runtime initialization of audio nodes
│   └── web-audio/     # Web Audio API integration and WebAssembly
│       └── wasm/      # WebAssembly modules for custom audio processors
├── components/        # Svelte UI components
│   ├── Line.svelte        # Connection line component with Bézier curves
│   ├── DraggingLine.svelte # Dedicated component for actively dragged connections
│   └── Tutorial/      # Tutorial-specific components and content
├── routes/            # SvelteKit routes
│   ├── playground/    # Audio canvas playground
│   └── learn/         # Tutorial section
├── ui/                # UI utility functions
│   ├── bezierCurves.ts    # Intelligent Bézier curve calculation utilities
│   └── [other files]     # Other UI utility functions
├── utils/             # General utility functions
├── icons/             # SVG icons
└── stories/           # Storybook component stories
```

### Audio Processing Structure

```
audio/
├── serialized/        # Serialized representation layer
│   └── v1/
│       ├── types.ts             # Type definitions for serialized audio elements
│       ├── staticDefinitions.ts # Static definitions of node properties
│       └── utils.ts             # Utility functions for manipulating serialized audio graphs
├── initialized/       # Runtime initialization layer
│   ├── nodes.ts       # Runtime node implementations
│   ├── update.ts      # Logic for updating the audio graph
│   └── types.ts       # Type definitions for runtime nodes
└── web-audio/         # Web Audio processing layer
    ├── utils.ts       # Utility functions for Web Audio API
    └── wasm/          # WebAssembly audio processors
        ├── ad-envelope/     # Attack-Decay envelope processor
        ├── clock-counter/   # Clock and counter processors
        ├── switch/          # Audio signal switching processor
        └── [other modules]  # Various audio processing modules
```

### Tutorial System Structure

```
components/Tutorial/
├── Clr.svelte         # Component for highlighting node types in tutorials
├── types.ts           # Type definitions for tutorial system
├── index.ts           # Main tutorial configuration
├── Tutorial1/         # "Your First Sounds" tutorial
├── Tutorial2/         # "Types of Signals" tutorial
├── Tutorial3/         # "Synthesizing Techno Kick" tutorial
├── Tutorial4/         # "Frequency and Amplitude" tutorial
└── Tutorial5/         # "Cycling Through Oscillators" tutorial
    ├── index.ts       # Tutorial steps configuration
    ├── Copy*.md       # Tutorial content for each step
    └── Check*.ts      # Validation functions for each step
```

## Key Dependencies

### Core Frameworks

- **Svelte** (v3.54.0): Reactive UI component framework
- **SvelteKit** (v1.5.0): Application framework built on top of Svelte
- **TypeScript** (v5.0.0): Static typing for improved code quality

### Audio Processing

- **Web Audio API**: Browser-native audio processing capabilities
- **WebAssembly**: Custom audio processors compiled from C code

### Documentation and Content

- **MDSvex** (v0.11.0): Markdown processor with Svelte component support
  - Used for tutorial content to combine explanatory text with interactive components

## Development Tools

### Build System

- **Vite** (v4.3.0): Fast development server and build tool
  - Used for development server with hot module replacement
  - Handles production builds and optimizations

### Testing

- **Jest** (v29.5.0): Testing framework for unit and integration tests
  - Used to verify audio processing logic
  - Ensures stability of core functionality

### Code Quality

- **ESLint** (v8.28.0): Code linting for identifying problems
- **Prettier** (v2.8.0): Code formatting for consistent style
- **TypeScript** (v5.0.0): Static type checking

### UI Development

- **Storybook** (v7.3.2): UI component development and testing environment
  - Allows isolated development of UI components
  - Provides a visual catalog of available components

## Build and Development Scripts

- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run test`: Run tests
- `npm run compile`: Compile WebAssembly modules
- `npm run storybook`: Start Storybook for component development
