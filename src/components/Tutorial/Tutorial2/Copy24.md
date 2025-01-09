<script>
    import Clr from '../Clr.svelte';
</script>

So far we've seen 4 types of signals:

- <Clr nodeType="number">Number</Clr> node emitting numbers;
- <Clr nodeType="sine-oscillator">Sine</Clr> node emitting audio;
- <Clr nodeType="clock">Clock</Clr> emitting triggers;
- <Clr nodeType="gate-length">Gate Length</Clr> emitting gates.

Even though those nodes differ in function so much, all of them in the end simply emit streams of numbers:

- <Clr nodeType="number">Number</Clr> emits arbitrary numbers;
- <Clr nodeType="sine-oscillator">Sine</Clr> emits numbers in range -1 to 1;
- <Clr nodeType="clock">Clock</Clr> and <Clr nodeType="gate-length">Gate Length</Clr> nodes both emit only either 0 or 1, with nothing inbetween.
