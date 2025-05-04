# AudioCanvas Memory Bank

This directory contains the comprehensive documentation for the AudioCanvas project. The Memory Bank serves as Cline's knowledge repository, providing essential context and information about the project's architecture, goals, and implementation details.

## Core Files

These files form the foundation of project knowledge and should be read in the following order:

1. [.clinerules](../.clinerules) - **CRITICAL**: Project-specific rules and patterns that MUST be read FIRST
2. [projectbrief.md](./projectbrief.md) - Foundation document defining core requirements and goals
3. [productContext.md](./productContext.md) - Why the project exists and how it should work
4. [activeContext.md](./activeContext.md) - Current work focus, recent changes, and next steps
5. [systemPatterns.md](./systemPatterns.md) - System architecture and key technical decisions
6. [techContext.md](./techContext.md) - Technologies used and development setup
7. [progress.md](./progress.md) - Current status, what works, and what's left to build
8. [project-directory.md](./project-directory.md) - Comprehensive list of project structure and key dependencies

## Tutorial Content

### Tutorial Style and Process

- [tutorialStyleGuide.md](./tutorialStyleGuide.md) - Writing style, structural patterns, and established conventions
- [tutorialWorkflow.md](./tutorialWorkflow.md) - Standard process and checklist for creating new tutorials
- [tutorialSummary.md](./tutorialSummary.md) - Comprehensive summary of all tutorial content
- [checkStyleGuide.md](./checkStyleGuide.md) - Comprehensive guide for creating validation functions for tutorial steps

### Complete Tutorial Content

- [tutorial1copy.md](./tutorial1copy.md) - Your First Sounds - Introduction to nodes, connections, and basic synthesis
- [tutorial2copy.md](./tutorial2copy.md) - Types of Signals - Understanding signal types and visualization
- [tutorial3copy.md](./tutorial3copy.md) - Synthesizing Techno Kick - Practical application of synthesis concepts
- [tutorial4copy.md](./tutorial4copy.md) - Frequency and Amplitude - Exploring oscillator properties and waveforms
- [tutorial5copy.md](./tutorial5copy.md) - Cycling Through Oscillators - Creating a voice that changes oscillator types with each note

### Tutorial Planning

- [tutorial5outline.md](./tutorial5outline.md) - Outline for Tutorial 5 structure and content (refers to the original AI-generated version, not the current main tutorial)

## Memory Bank Usage

The Memory Bank is Cline's only link to previous work after memory resets. It must be maintained with precision and clarity, as effectiveness depends entirely on its accuracy.

### When to Update

Memory Bank updates should occur when:
1. Discovering new project patterns
2. After implementing significant changes
3. When user requests with **update memory bank**
4. When context needs clarification

### Update Process

When updating the Memory Bank:
1. Review ALL files
2. Document current state
3. Clarify next steps
4. Update .clinerules with new patterns

### Project Intelligence

The .clinerules file captures important patterns, preferences, and project intelligence that help work more effectively. It should be updated with:
- Critical implementation paths
- User preferences and workflow
- Project-specific patterns
- Known challenges
- Evolution of project decisions
- Tool usage patterns
