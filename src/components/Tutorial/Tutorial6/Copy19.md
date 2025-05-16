<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="square-oscillator">Square Oscillator</Clr> has the following harmonic pattern:

1. Like the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>, it contains only odd harmonics (3rd, 5th, 7th, etc.)
2. Unlike the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>, its harmonics decrease more slowly - at a rate of 1/n (rather than 1/n²)

This slower decrease in amplitude means that higher harmonics remain more prominent, which is why the <Clr nodeType="square-oscillator">Square Oscillator</Clr> sounds "brighter" or "harsher" than the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>, despite both having only odd harmonics.