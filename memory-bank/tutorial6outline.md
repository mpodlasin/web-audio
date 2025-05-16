# Tutorial 6 Outline: Spectrum and Harmonics

## Step-by-Step Outline

1. **Welcome and Introduction**
   - Welcome to Tutorial 6.
   - Point out that in previous tutorials we described some waveforms as "richer" than others.
   - In this tutorial we will understand exactly where this difference between oscillators/waveforms comes from.

2. **Introduce Spectrum Node**
   - Note that in order to understand that, we will use a new visualization node - Spectrum - that will allow us to analyze contents of sounds more deeply.
   - Create spectrum node.

3. **Basic Patch Setup**
   - Create Sine and Gain nodes.
   - Set up a basic patch: Sine Oscillator → Gain → Spectrum.

4. **Spectrum Peak**
   - Note the peak that appears on the spectrum node when play button is turned on.

5. **Frequency Sweep and Observation**
   - Sweep the Sine Oscillator's frequency and observe the moving peak in the Spectrum node.

6. **Spectrum as Frequency Detector**
   - Explain the Spectrum node as a frequency detector (low frequencies on the left, high on the right).

7. **Add a Second Sine Oscillator**
   - Add a second Sine Oscillator and connect it to the Spectrum node.

8. **Visualize Multiple Frequencies**
   - Observe two peaks; experiment with the frequency of the second oscillator.

9. **Spectrum Can Show Multiple Frequencies**
   - Discuss how the Spectrum node can display multiple frequencies at once.

10. **Amplitude and Spectrum**
    - Lower the gain of one Sine Oscillator and observe the effect on peak height in the Spectrum node.

11. **Explain Peak Height**
    - Explain that peak height represents amplitude (strength) of a frequency.

12. **Remove Sine Oscillators and Gain**
    - Remove both Sine Oscillators and the Gain node.

13. **Create a Triangle Oscillator**
    - Create a Triangle Oscillator.
    - Connect the Triangle Oscillator to the Spectrum node and observe the spectrum.

14. **Discover Harmonics**
    - Notice multiple peaks (harmonics) in the spectrum, not just the fundamental.
    - Draw analogy to combining multiple sine waves.
    - Reference the concept from Tutorial 1: sine waves as building blocks of all sounds.

15. **Define Fundamental and Harmonics**
    - Define the fundamental frequency (leftmost peak) and harmonics (other peaks).

16. **Harmonic Spacing**
    - Explain that harmonics are evenly spaced and, for triangle waves, are odd multiples of the fundamental.
    - Give concrete example: 100 Hz fundamental → harmonics at 300, 500, 700 Hz, etc.

17. **Create a Square Oscillator**
    - Remove the Triangle Oscillator.
    - Create a Square Oscillator.
    - Connect the Square Oscillator to the Spectrum node.

18. **Observe Square Wave Harmonics**
    - Notice the harmonic peaks in the spectrum.
    - Compare with the Triangle oscillator - there are still multiple peaks.

19. **Square Wave Harmonic Pattern**
    - Explain that like the Triangle wave, Square waves contain only odd harmonics (3rd, 5th, 7th...).
    - Unlike Triangle waves, Square wave harmonics decrease more slowly (amplitudes fall off at 1/n rather than 1/n²).
    - This explains why Square waves sound "brighter" than Triangle waves despite both having only odd harmonics.

20. **Create a Saw Oscillator**
    - Remove the Square Oscillator.
    - Create a Saw Oscillator.
    - Connect the Saw Oscillator to the Spectrum node.

21. **Observe Saw Wave Harmonics**
    - Notice the spectrum has even more peaks than Square or Triangle.
    - Point out that the peaks appear at all integer multiples of the fundamental.

22. **Saw Wave Harmonic Pattern**
    - Explain that Saw waves contain ALL harmonics (both odd and even).
    - This is why the Saw oscillator sounds "richest" or most "aggressive" of all the standard waveforms.
    - Harmonics decrease in amplitude at a rate of 1/n.
    - Give concrete example: 100 Hz fundamental → harmonics at 200, 300, 400, 500 Hz, etc.

23. **Harmonic Content Comparison**
    - Summarize the harmonic content of all oscillators:
        - Sine: Only fundamental (no harmonics)
        - Triangle: Only odd harmonics with 1/n² falloff
        - Square: Only odd harmonics with 1/n falloff
        - Saw: All harmonics with 1/n falloff
    - This explains the "richness" differences mentioned in previous tutorials.
