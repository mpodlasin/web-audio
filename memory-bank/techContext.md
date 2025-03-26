# Technical Context

## Technologies Used

AudioCanvas is built using a modern web technology stack that enables high-performance audio processing in the browser:

### Core Technologies

1. **TypeScript**
   - Provides static typing for improved code quality and developer experience
   - Enables better tooling and IDE support for complex audio processing code
   - Used throughout the codebase for both frontend and audio processing

2. **Svelte/SvelteKit**
   - Svelte for reactive UI components with minimal runtime overhead
   - SvelteKit for routing and application structure
   - Chosen for its performance and simplicity compared to larger frameworks

3. **Web Audio API**
   - Browser-native audio processing capabilities
   - Provides low-latency, high-performance audio processing
   - Handles core audio operations like oscillators, filters, and gain control

4. **WebAssembly**
   - Used for custom audio processors that require high performance
   - Compiled from C code for near-native execution speed
   - Enables specialized audio processing not available in the standard Web Audio API

### Supporting Technologies

1. **MDSvex**
   - Markdown processor with Svelte component support
   - Used for tutorial content to combine explanatory text with interactive components
   - Enables rich, formatted tutorial content

2. **Local Storage API**
   - Browser-native storage for saving user projects
   - Eliminates the need for a backend server
   - Provides persistent storage between sessions

3. **ESLint/Prettier**
   - Code quality and formatting tools
   - Ensures consistent code style across the project
   - Integrated into the development workflow

4. **Jest**
   - Testing framework for unit and integration tests
   - Used to verify audio processing logic
   - Ensures stability of core functionality

5. **Storybook**
   - UI component development and testing environment
   - Allows isolated development of UI components
   - Provides a visual catalog of available components

## Development Setup

### Project Structure

The project follows a modular structure:

```
web-audio/
├── src/
│   ├── audio/                 # Audio processing core (framework-agnostic)
│   │   ├── serialized/        # Serialized representation of audio graph
│   │   ├── initialized/       # Runtime initialization of audio nodes
│   │   └── web-audio/         # Web Audio API integration and WebAssembly
│   ├── components/            # Svelte UI components
│   │   └── Tutorial/          # Tutorial-specific components and content
│   ├── routes/                # SvelteKit routes
│   ├── ui/                    # UI utility functions
│   └── utils/                 # General utility functions
├── static/                    # Static assets (audio files, images)
└── memory-bank/              # Project documentation
```

### Build Process

The project uses Vite for fast development and optimized production builds:

1. **Development**
   - `npm run dev`: Starts the development server with hot module replacement
   - `npm run check`: TypeScript type checking
   - `npm run lint`: Code linting with ESLint and Prettier

2. **WebAssembly Compilation**
   - `npm run compile`: Compiles C code to WebAssembly using Emscripten
   - Custom shell script (`src/audio/web-audio/wasm/compile.sh`) handles the compilation process

3. **Testing**
   - `npm run test`: Runs Jest tests
   - `npm run test:watch`: Runs tests in watch mode during development

4. **Production**
   - `npm run build`: Creates optimized production build
   - `npm run preview`: Previews the production build locally

### Development Workflow

The typical development workflow involves:

1. Running the development server with `npm run dev`
2. Making changes to components or audio processing code
3. Testing changes in the browser
4. Running tests with `npm run test`
5. Building for production with `npm run build`

For WebAssembly development, additional steps include:
1. Modifying C code in the `src/audio/web-audio/wasm/` directory
2. Running `npm run compile` to compile to WebAssembly
3. Testing the compiled modules in the browser

## Technical Constraints

### Browser Compatibility

AudioCanvas targets modern browsers with support for:
- Web Audio API
- WebAssembly
- ES6+ JavaScript features
- Modern CSS features

Minimum supported browsers:
- Chrome 79+
- Firefox 75+
- Safari 13.1+
- Edge 79+ (Chromium-based)

### Performance Considerations

Audio processing has strict performance requirements:

1. **Audio Thread Priority**
   - Audio processing must maintain 60Hz update rate to prevent glitches
   - Heavy computations should be offloaded to WebAssembly or Web Workers

2. **Memory Management**
   - Audio buffers and WebAssembly memory must be managed carefully
   - Garbage collection can cause audio glitches if not handled properly
   - Buffer operations must be carefully managed to prevent "offset out of bounds" errors
   - Single-value parameters should be handled directly rather than using array methods like set()

3. **UI Responsiveness**
   - UI updates should not block audio processing
   - Canvas rendering and DOM updates need to be optimized

4. **Parameter Handling**
   - Parameter changes should be efficient and thread-safe
   - Linear parameters provide more intuitive control for certain types of values (like counts)
   - Discrete parameters should be properly quantized to prevent unexpected behavior

### WebAssembly Limitations

1. **Browser Support**
   - WebAssembly is widely supported but has some feature variance between browsers
   - Audio Worklet support is required for custom audio processors

2. **Development Complexity**
   - Requires C/C++ knowledge for custom audio processors
   - Debugging WebAssembly can be challenging
   - Compilation process adds complexity to the build pipeline

### Local Storage Limitations

1. **Storage Quota**
   - Browsers limit local storage to ~5MB per domain
   - Complex projects may approach this limit

2. **No Server Synchronization**
   - Projects are tied to the user's browser/device
   - No built-in way to share or collaborate on projects

## Dependencies

### Production Dependencies

- **svelte**: UI component framework
- **@sveltejs/kit**: Application framework built on top of Svelte
- **mdsvex**: Markdown processor with Svelte support

### Development Dependencies

- **typescript**: Static type checking
- **vite**: Build tool and development server
- **eslint**: Code linting
- **prettier**: Code formatting
- **jest**: Testing framework
- **@babel/core**, **@babel/preset-env**, **@babel/preset-typescript**: JavaScript transpilation
- **storybook**: UI component development environment

### Audio-Specific Dependencies

AudioCanvas minimizes external dependencies for audio processing, instead relying on:
- Native Web Audio API
- Custom WebAssembly modules
- Hand-crafted audio processing algorithms

This approach:
- Reduces bundle size
- Provides more control over audio quality and performance
- Avoids licensing issues with third-party audio libraries

## Version Control and Deployment

- **Git**: Version control system
- **GitHub**: Repository hosting and collaboration
- **npm**: Package management

The project follows semantic versioning (SemVer) for releases.

## Future Technical Considerations

1. **PWA Support**
   - Progressive Web App capabilities for offline use
   - Service workers for caching assets and application code

2. **WebMIDI Integration**
   - Deeper integration with MIDI hardware
   - Support for MIDI controllers and keyboards

3. **Audio Worklet Improvements**
   - More sophisticated custom audio processors
   - Better integration with the main audio graph

4. **Optimization for Mobile**
   - Touch-friendly interface adjustments
   - Performance optimizations for mobile devices
