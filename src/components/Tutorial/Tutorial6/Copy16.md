<script>
    import Clr from '../Clr.svelte';
</script>

For the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>, the harmonics follow a specific pattern:

1. They are evenly spaced
2. They occur only at odd multiples of the fundamental frequency
3. Their amplitudes decrease at a rate of 1/n², where n is the harmonic number

For example, with a fundamental frequency of 100 Hz, the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr> has harmonics at approximately:
- 300 Hz (3rd harmonic)
- 500 Hz (5th harmonic)
- 700 Hz (7th harmonic)

The amplitudes get progressively smaller, which is why some higher harmonics might be difficult to see.