<script>
    import Clr from '../Clr.svelte';
</script>

Different oscillators will have different harmonic patterns.

For the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>, the harmonics occur only at odd multiples of the fundamental frequency.

For example, with a fundamental frequency of 100 Hz, the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr> has harmonics at approximately:
- 300 Hz (3rd harmonic)
- 500 Hz (5th harmonic)
- 700 Hz (7th harmonic)
- and so on...

The amplitudes of harmonics get progressively smaller, which you can see on the graph - peaks further to the right get smaller and smaller.