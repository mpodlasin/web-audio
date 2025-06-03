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
   - We will use real saw oscillator as our target for comparison
   - Create a Saw Oscillator node
   - Create Spectrum node to watch it's shape
   - Connect Saw -> Spectrum

4. **Set Up Output**
   - We will use Switch node to easily compare between two versions of the waveform
   - Create a Switch.
   - Create an Output node.
   - Connect: Switch → Output.

5. **Connect Saw Spectrum**
   - Connect Spectrum throuput output to the first switch input

6. **Observe Reference Spectrum**
   - Press play and observe the harmonic pattern of the reference saw wave.
   - Note all the harmonics present (every integer multiple of the fundamental).
   - Make sure you can hear Sinewave as well

7. **Prepare for Building**
   - Explain that we'll now build our own version using individual sine waves.
   - Each sine wave will represent one harmonic of the saw wave.
   - Create second Spectrum node and connect it to the second input of the Switch node

8. **Create the Fundamental**
   - Create the first Sine Oscillator for the fundamental frequency.

9. **Add Gain Control for Fundamental**
   - We want to have control over fundamental's amplitude.
   - Create a Gain node for the fundamental.
   - Connect: Sine Oscillator → Gain → Spectrum.

10. **Observe Single Harmonic**
    - Observe the single peak on the spectrum (fundamental only).
    - Set the Switch channel to 2 to hear our synthesized version.

11. **Early Comparison**
    - They sound nothing alike! Let's get to work.
    - Tell users to compare to the actuall saw as frequently as they want to just by switching the Switch

12. **Create Second Harmonic**
    - Create a second Sine Oscillator for the 2nd harmonic.
    - Set its frequency to 880 Hz (2 × fundamental frequency).

13. **Add Gain Control for Second Harmonic**
    - We previously said that harmonic decrease in amplitude, but we didn't say how fast exactly. 
    - Introduce the 1/n rule
    - Set the gain to 0.5

14. **Connect Second Harmonic**
    - Connect 2nd Osc -> 2nd Gain -> Spectrum
    - Observe two peaks on the spectrum.
    - Notice the sound becoming slightly richer.

15. **Connect Second Harmonic**
    - Connect the second harmonic to the spectrum alongside the fundamental.
    - Also connect it to the second input of the Switch (our synthesized version).
    - Switch to channel 2 and observe two peaks on the spectrum.
    - Notice the sound becoming slightly richer.

13. **Create Third Harmonic**
    - Create a third Sine Oscillator at (3 × fundamental) Hz
    - Create a third Gain node and set gain to 0.33 (1/3 amplitude).

14. **Connect Third Harmonic**
    - Connect the third harmonic to the spectrum.
    - Notice the sound becoming more complex and saw-like

15. **Create and connect 4th harmonic**

16. **Create and connect 5th harmonic**

17. **Create and connect 6th harmonic**

18. **Results**
    - Note that witch harmonic added the sound becomes closer and closer to saw sound
    - Our version still sounds "muffled" because would have to add a lot more harmonics
    - But in principle nothing stops us from getting as close as we desire

19. **Introduce Frequencys Control**
    - So far the sine oscillator set just plays the same note
    - Goal: Change the fundamental frequency and have all harmonics follow automatically.

20. **Create Fundamental Frequency Control**
    - Create a Number node for fundamental frequency control.
    - Set its value parameter to 440
    - Connect the Number node output to the fundamental sine oscillator's frequency parameter.
    - Set frequency knob to 0

21. **Create Harmonic Multipliers**
    - Create 5 Times nodes for calculating harmonic frequencies.
    - For each time node create corresponding Number node
    - connect each number node to corresponding times node

22. **Setup harmonic multipliers**
   - Set values on Number nodes corresponding to times nodes as follows: 2, 3, 4, 5, 6
   - Connect main frequency number node to each of the time nodes

23. **Connect harmonic multipliers to oscillators**
    - Connect each times node to corresponding sine oscillator
    - Set frequency knob on each osscillator to 0

24. **Connect funamental frequency Number to Saw**
    - Explain, that in order to accurately compare our oscillators to saw, we will also control saw
    - Connect Number to saw frequency parameter
    - Set frequency knob on saw oscillator to 0

25. **Make a sweep with saw**
    - Set switch to saw
    - Do a frequency sweep using Number node

26. **Make a sweep with sine oscillator bank**
    - Set switch to sine oscillators
    - Do a frequency sweep using Sine oscillators

27. **Comments**
    - While our oscillators od not emulate saw wave perfectly, we saw that even very small amount of oscillators (6) can recreate the character of saw wave.

28. **Final words**
    - Adding more sine oscillators by hand is tedious, but can be done easily by computer software
    - Thanks to that, additive synthesis is a technique that is very much present in professional synthesizers, so it's very important to know it and understand it. 
