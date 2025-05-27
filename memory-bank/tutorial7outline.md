# Tutorial 7 Outline: Building a Saw Wave with Sine Waves (Additive Synthesis)

## Step-by-Step Outline

1. **Welcome and Introduction**
   - Welcome to Tutorial 7.
   - Reference Tutorial 6's discovery that complex waveforms like the saw wave contain multiple harmonics.
   - Introduce the concept: "What if we could build a complex waveform from scratch using only sine waves?"

2. **Set the Goal**
   - Explain that we will recreate a saw wave using multiple sine oscillators.
   - This technique is called "additive synthesis" - building complex sounds by adding simple components together.

3. **Create Reference Saw Wave**
   - Create a Saw Oscillator as our reference target.
   - This will help us compare our synthesized version with the real thing.

4. **Set Up Spectrum Analysis**
   - Create a Spectrum node.
   - Create a Switch node for A/B comparison.
   - Create an Output node.
   - Connect: Spectrum → Switch → Output.

5. **Connect Reference Saw Wave**
   - Connect the Saw Oscillator to the first input of the Switch node.
   - Also connect the Saw Oscillator to the Spectrum node for analysis.
   - Set the Switch channel parameter to 1 to hear the reference.

6. **Observe Reference Spectrum**
   - Press play and observe the harmonic pattern of the reference saw wave.
   - Note all the harmonics present (every integer multiple of the fundamental).
   - Set the saw oscillator frequency to 100 Hz for easy harmonic calculation.

7. **Prepare for Building**
   - Explain that we'll now build our own version using individual sine waves.
   - Each sine wave will represent one harmonic of the saw wave.
   - We'll connect our synthesized version to the second input of the Switch for easy comparison.

8. **Create the Fundamental**
   - Create the first Sine Oscillator for the fundamental frequency.
   - Set its frequency to 100 Hz (matching the reference).

9. **Add Gain Control for Fundamental**
   - Create a Gain node for the fundamental.
   - Connect: Sine Oscillator → Gain → Spectrum.
   - Also connect the Gain node to the second input of the Switch.
   - This gives us control over the fundamental's amplitude.

10. **Observe Single Harmonic**
    - Set the Switch channel to 2 to hear our synthesized version.
    - Observe the single peak on the spectrum (fundamental only).
    - Switch back to channel 1 to compare with the reference - we're missing all the harmonics!

11. **Create Second Harmonic**
    - Create a second Sine Oscillator for the 2nd harmonic.
    - Set its frequency to 200 Hz (2 × fundamental frequency).

12. **Add Gain Control for Second Harmonic**
    - Create a second Gain node for the 2nd harmonic.
    - Set the gain to 0.5 (half amplitude, following the 1/n rule for saw waves).

13. **Connect Second Harmonic**
    - Connect the second harmonic to the spectrum alongside the fundamental.
    - Also connect it to the second input of the Switch (our synthesized version).
    - Switch to channel 2 and observe two peaks on the spectrum.
    - Notice the sound becoming slightly richer.

13. **Create Third Harmonic**
    - Create a third Sine Oscillator at 300 Hz (3 × fundamental).
    - Create a third Gain node and set gain to 0.33 (1/3 amplitude).

14. **Connect Third Harmonic**
    - Connect the third harmonic to the spectrum.
    - Notice the sound becoming more complex and saw-like.

15. **Compare Progress with Switch**
    - Use the Switch to A/B between channel 1 (reference) and channel 2 (synthesized).
    - Notice we're getting closer but still missing many harmonics.

16. **Create Fourth Harmonic**
    - Create a fourth Sine Oscillator at 400 Hz (4 × fundamental).
    - Create a fourth Gain node and set gain to 0.25 (1/4 amplitude).

17. **Connect Fourth Harmonic**
    - Connect the fourth harmonic to the spectrum and Switch input 2.
    - Observe increasing similarity to reference saw wave.

18. **A/B Comparison with Switch**
    - Use the Switch to toggle between channel 1 and 2.
    - Notice how much closer we're getting to the saw wave sound.

19. **Add Fifth Harmonic**
    - Create fifth Sine Oscillator at 500 Hz (5 × fundamental).
    - Create fifth Gain node and set gain to 0.2 (1/5 amplitude).
    - Connect to spectrum.

20. **Add Sixth Harmonic**
    - Create sixth Sine Oscillator at 600 Hz (6 × fundamental).
    - Create sixth Gain node and set gain to 0.167 (1/6 amplitude).
    - Connect to spectrum.

21. **Add Seventh Harmonic**
    - Create seventh Sine Oscillator at 700 Hz (7 × fundamental).
    - Create seventh Gain node and set gain to 0.143 (1/7 amplitude).
    - Connect to spectrum.

22. **Add Eighth Harmonic**
    - Create eighth Sine Oscillator at 800 Hz (8 × fundamental).
    - Create eighth Gain node and set gain to 0.125 (1/8 amplitude).
    - Connect to spectrum.

23. **Observe Rich Spectrum**
    - With each harmonic added, compare the spectrum and sound to the reference.
    - Notice how our synthesized version is becoming very close to the original.

24. **Explain the Pattern**
    - Explain the 1/n amplitude relationship for saw wave harmonics.
    - Show how each harmonic frequency is n × fundamental frequency.
    - Demonstrate that more harmonics = closer approximation to perfect saw wave.

25. **Discuss Practical Limitations**
    - Explain why we can't add infinite harmonics (processing power, audible range).
    - Note that 8 harmonics already gives us a very convincing saw wave.

26. **Fine-Tune Amplitudes**
    - Adjust individual harmonic amplitudes for the best match with the reference.
    - Small adjustments can make a big difference in the final sound.

27. **Final A/B Comparison**
    - Do a final A/B test between synthesized saw and reference saw.
    - Celebrate the achievement of additive synthesis!

28. **Demonstrate Understanding**
    - Show how close the approximation sounds to the original.
    - Discuss the remarkable fact that we built a complex waveform from simple sine waves.

29. **Introduce Dynamic Control**
    - Explain that we'll now make our additive oscillator controllable like a real instrument.
    - Goal: Change the fundamental frequency and have all harmonics follow automatically.
    - This will demonstrate both additive synthesis and modular control concepts.

30. **Create Fundamental Frequency Control**
    - Create a Number node for fundamental frequency control.
    - Set its value parameter to 100 Hz (matching our current setup).
    - Connect the Number node output to the fundamental sine oscillator's frequency parameter.

31. **Create Harmonic Multipliers**
    - Create three more Number nodes with values 2, 3, and 4 (for harmonic multipliers).
    - Create three Times nodes for calculating harmonic frequencies.
    - These will multiply the fundamental frequency by 2, 3, and 4.

32. **Connect 2nd Harmonic Control**
    - Connect the fundamental Number node to the first Times node's input A.
    - Connect the "2" Number node to the same Times node's input B.
    - Connect the Times node output to the 2nd harmonic sine oscillator's frequency parameter.

33. **Connect 3rd and 4th Harmonic Control**
    - Repeat the process for the 3rd harmonic using the "3" Number node and second Times node.
    - Repeat for the 4th harmonic using the "4" Number node and third Times node.
    - Connect each Times node output to its respective harmonic oscillator frequency.

34. **Test Dynamic Control**
    - Adjust the fundamental Number node value and observe all harmonics moving together.
    - Use the Switch to A/B test with the reference saw at different frequencies.
    - Notice how the harmonic relationships are maintained at all frequencies.

35. **Frequency Sweep Demonstration**
    - Sweep the fundamental Number node from 100Hz to 400Hz.
    - Show how the additive oscillator tracks the reference saw wave perfectly.
    - Observe the spectrum maintaining proper harmonic structure at all frequencies.

36. **Summary and Achievement**
    - Celebrate creating a controllable additive oscillator instrument.
    - Explain how this demonstrates both additive synthesis and modular control concepts.
    - Preview how this knowledge applies to more complex synthesis techniques.
    - Encourage further experimentation with the dynamic additive oscillator.

## Key Learning Objectives

1. **Understanding Additive Synthesis**: Experience hands-on how complex waveforms are built from simple sine waves
2. **Harmonic Relationships**: Learn the mathematical relationship between harmonics (1/n amplitude, n × frequency)
3. **Practical Synthesis**: Apply theoretical knowledge from Tutorial 6 to create sounds
4. **Spectrum Analysis**: Use visual feedback to guide synthesis decisions
5. **Building Block Concept**: Reinforce that sine waves are the fundamental building blocks of all sounds

## Technical Focus

The tutorial will focus on:
- Precise frequency relationships (100Hz, 200Hz, 300Hz, etc.)
- Amplitude relationships following the 1/n rule for saw waves
- Using multiple Gain nodes for individual harmonic amplitude control
- Spectrum analysis for visual feedback and comparison
- Building complexity gradually (one harmonic at a time)
- A/B comparison techniques between synthesized and reference sounds

## Required Nodes

- 1 Saw Oscillator (reference)
- 4 Sine Oscillators (fundamental + 3 harmonics - reduced for dynamic control section)
- 4 Gain nodes (individual amplitude control for each harmonic)
- 4 Number nodes (1 for fundamental frequency + 3 for harmonic multipliers: 2, 3, 4)
- 3 Times nodes (harmonic frequency calculators)
- 1 Spectrum node (visualization and analysis)
- 1 Switch node (A/B comparison between reference and synthesized)
- 1 Output node (monitoring and playback)

## Tutorial Structure Summary

This tutorial bridges theoretical understanding from Tutorial 6 with practical synthesis techniques. By building a saw wave from scratch using additive synthesis, users will gain deep insight into how harmonics work and how complex sounds are constructed from simple components. The incremental approach allows users to hear and see how each harmonic contributes to the final sound, making the abstract concept of harmonics tangible and understandable.
