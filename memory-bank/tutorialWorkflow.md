# Tutorial Creation Workflow

This document outlines the standard process for creating new tutorials in the AudioCanvas project. Following this workflow ensures consistency across tutorials and streamlines the development process.

## Tutorial Creation Workflow Checklist

### 1. Planning and Research
- [ ] Review existing tutorials in memory-bank for style and structure
- [ ] Consult `tutorialStyleGuide.md` for writing conventions
- [ ] Check `src/audio/serialized/v1/staticDefinitions.ts` and `types.ts` for accurate node information
- [ ] Create an outline of tutorial steps (e.g., `tutorial5outline.md`)
- [ ] Identify any new nodes or features needed for the tutorial

### 2. Content Development
- [ ] Write the complete tutorial content in a single markdown file in memory-bank (e.g., `tutorial5copy.md`)
- [ ] Structure content with "# Step X" headers for each tutorial step
- [ ] Include Svelte script imports for `Clr` component where needed
- [ ] Follow established writing patterns from style guide
- [ ] Ensure accurate node category references and parameter names

### 3. Content Processing
- [ ] Create the tutorial directory if it doesn't exist (e.g., `src/components/Tutorial/Tutorial5`)
- [ ] Use the tutorial-splitter script to split the content:
  - [ ] `node tutorial-splitter.js memory-bank/tutorial5copy.md src/components/Tutorial/Tutorial5`
- [ ] Verify that all Copy*.md files were created correctly

### 4. Validation Implementation
- [ ] Create Check*.ts files for each step to validate user progress
- [ ] Implement validation functions that check for specific nodes, connections, and parameters
- [ ] Balance validation strictness (not too strict, not too loose)
- [ ] Provide helpful error messages to guide users

### 5. Tutorial Integration
- [ ] Create an index.ts file in the tutorial directory that:
  - [ ] Imports all Copy*.md files
  - [ ] Imports all Check*.ts files
  - [ ] Defines the tutorial object with steps array
- [ ] Update the main tutorial index.ts to include the new tutorial

### 6. Testing and Refinement
- [ ] Test the tutorial flow
- [ ] Verify validation functions work correctly
- [ ] Polish content and instructions
- [ ] Ensure consistent terminology and clear explanations

## Key Tools and Resources

### Tutorial-Splitter Script
The `tutorial-splitter.js` script automates the process of splitting tutorial markdown files from memory-bank into separate Copy*.md files. Usage:

```
node tutorial-splitter.js <source-file> <target-directory>
```

Example:
```
node tutorial-splitter.js memory-bank/tutorial5copy.md src/components/Tutorial/Tutorial5
```

### Important Reference Files
- `tutorialStyleGuide.md`: Writing style, structural patterns, and established conventions
- `src/audio/serialized/v1/staticDefinitions.ts`: Node definitions, categories, and parameters
- `src/audio/serialized/v1/types.ts`: Type definitions for audio elements
- Existing tutorials in memory-bank for reference

### Validation Function Pattern
```typescript
import type { SerializedAudioElements } from '../../../audio/serialized';

export function check1(audioGraph: SerializedAudioElements) {
  // Check for specific nodes, connections, or parameters
  
  // Return success or failure with optional message
  return {
    success: true, // or false
    message: 'Optional message explaining why validation failed'
  };
}
```

This workflow leverages the tutorial-splitter script to significantly reduce the manual effort of preparing tutorial content, allowing you to focus on writing quality instructional material and implementing effective validation logic.
