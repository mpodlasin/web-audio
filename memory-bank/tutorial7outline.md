# Tutorial 7 Outline: Building a Saw Wave with Sine Waves (Additive Synthesis)

## Step-by-Step Outline

1. **Welcome and Introduction**
   - Welcome to Tutorial 7.
   - Reference Tutorial 6's discovery that complex waveforms like the saw wave contain multiple harmonics.
   - Introduce the concept: "What if we could build a complex waveform from scratch using only sine waves?"

2. **Set the Goal**
   - Explain that we will (imperfectly) recreate a saw wave using multiple sine oscillators.
   - This technique is called "additive synthesis" - building complex sounds by adding simple components together.
   
3. **Create Reference Saw Wave**
   - We will use a real saw oscillator as our target for comparison.
   - Create a Saw Oscillator node.
   - Create a Spectrum node to watch its shape.
   - Connect Saw → Spectrum.

4. **Set Up Output**
   - We will use a Switch node to easily compare between two versions of the waveform.
   - Create a Switch.
   - Create an Output node.
   - Connect: Switch → Output.

5. **Connect Saw to Switch**
   - Connect the output of the spectrum to the first input of the Switch node.

6. **Observe Reference Spectrum**
   - Press play and observe the harmonic pattern of the reference saw wave.
   - Note the harmonics present (every integer multiple of the fundamental).
   - Make sure you can hear the saw wave as well.

7. **Prepare for Building**
   - Explain that we'll now build our own version using individual sine waves.
   - Each sine wave will represent one harmonic of the saw wave.
   - Create a second Spectrum node and connect it to the second input of the Switch node.

8. **Create the Fundamental**
   - Create the first Sine Oscillator for the fundamental frequency.
    - Connect: Sine Oscillator → second Spectrum.

10. **Observe Single Harmonic**
    - Observe the single peak on the spectrum (fundamental only).
    - Set the Switch channel to 2 to hear our synthesized version.

11. **Early Comparison**
    - They sound nothing alike! Let's get to work.
    - Tell users to compare to the actual saw as frequently as they want to just by switching the Switch.

12. **Create Second Harmonic**
    - Create a second Sine Oscillator for the 2nd harmonic.
    - Set its frequency to 880 Hz (2 × fundamental frequency).

13. **Add Gain Control for Second Harmonic**
    - We previously said that harmonics decrease in amplitude, but we didn't say how fast exactly.
    - Introduce the 1/n rule.
    - Add gain node
    - Set the gain to 0.5.

14. **Connect Second Harmonic**
    - Connect 2nd Oscillator → 2nd Gain → second Spectrum.
    - Observe two peaks on the spectrum.
    - Notice the sound becoming slightly richer.

15. **Create Third Harmonic**
    - Create a third Sine Oscillator at (3 × fundamental) Hz.
    - Create a third Gain node and set gain to 0.33 (1/3 amplitude).

16. **Connect Third Harmonic**
    - Connect the third harmonic to the spectrum.
    - Notice the sound becoming more complex and saw-like.

17. **Create and Connect 4th Harmonic**
    - Create a fourth Sine Oscillator at 1760 Hz (4 × fundamental).
    - Create a fourth Gain node and set gain to 0.25 (1/4 amplitude).
    - Connect to the second Spectrum.

18. **Create and Connect 5th Harmonic**
    - Create a fifth Sine Oscillator at 2200 Hz (5 × fundamental).
    - Create a fifth Gain node and set gain to 0.2 (1/5 amplitude).
    - Connect to the second Spectrum.

19. **Create and Connect 6th Harmonic**
    - Create a sixth Sine Oscillator at 2640 Hz (6 × fundamental).
    - Create a sixth Gain node and set gain to 0.167 (1/6 amplitude).
    - Connect to the second Spectrum.

20. **Results**
    - Note that with each harmonic added, the sound becomes closer and closer to the saw sound.
    - Our version still sounds "muffled" because we would have to add a lot more harmonics.
    - But in principle, nothing stops us from getting as close as we desire.

21. **Introduce Frequency Control**
    - So far the sine oscillator set just plays the same note.
    - Goal: Change the fundamental frequency and have all harmonics follow automatically.

22. **Create Fundamental Frequency Control**
    - Create a Number node for fundamental frequency control.
    - Set its value parameter to 440.
    - Connect the Number node output to the fundamental sine oscillator's frequency parameter.
    - Set frequency knob to 0.

23. **Create Harmonic Multipliers**
    - Create 5 Times nodes for calculating harmonic frequencies.
    - For each Times node, create a corresponding Number node.
    - Connect each Number node to the corresponding Times node.

24. **Set Up Harmonic Multipliers**
    - Set values on Number nodes corresponding to Times nodes as follows: 2, 3, 4, 5, 6.
    - Connect the main frequency Number node to each of the Times nodes.

25. **Connect Harmonic Multipliers to Oscillators**
    - Connect each Times node to the corresponding sine oscillator.
    - Set the frequency knob on each oscillator to 0.

26. **Connect Fundamental Frequency Number to Saw**
    - Explain that in order to accurately compare our oscillators to the saw, we will also control the saw.
    - Connect the Number with fundamental value to the saw frequency parameter.
    - Set the frequency knob on the saw oscillator to 0.

27. **Make a Sweep with Saw**
    - Set the switch to saw.
    - Do a frequency sweep using the Number node.

28. **Make a Sweep with Sine Oscillator Bank**
    - Set the switch to sine oscillators.
    - Do a frequency sweep using the sine oscillators.

29. **Comments**
    - While our oscillators do not emulate the saw wave perfectly, we saw that even a very small amount of oscillators (6) can already recreate the character of the saw wave.

30. **Final Words**
    - Adding more sine oscillators by hand is tedious, but can be done easily by computer software.
    - Thanks to that, additive synthesis is a technique that is very much present in professional synthesizers, so it's important to know it and understand it.
