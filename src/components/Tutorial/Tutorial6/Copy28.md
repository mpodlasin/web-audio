<script>
    import Clr from '../Clr.svelte';
</script>

Now we can understand the differences between all our oscillator types based on their harmonic content:

- <Clr nodeType="sine-oscillator">Sine Oscillator</Clr>: Contains only the fundamental frequency with no harmonics. This gives it a pure, simple sound.

- <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>: Contains only odd harmonics (3rd, 5th, 7th...) with amplitudes that decrease at 1/n². This gives it a somewhat richer sound than the sine wave, but still relatively mellow.

- <Clr nodeType="square-oscillator">Square Oscillator</Clr>: Contains only odd harmonics (3rd, 5th, 7th...) with amplitudes that decrease at 1/n. The slower decrease means higher harmonics are more prominent, making it sound brighter than the triangle wave.

- <Clr nodeType="saw-oscillator">Saw Oscillator</Clr>: Contains all harmonics (both odd and even) with amplitudes that decrease at 1/n. This gives it the richest, most complex sound of all the standard oscillators.

This harmonic content is exactly what creates the differences in "richness" that we mentioned in previous tutorials. The more harmonics present (and the stronger they are), the richer and more complex the sound will be!