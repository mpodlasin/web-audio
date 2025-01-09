<script>
    import Clr from '../Clr.svelte';
</script>

So far we've seen 4 types of signals:

- `Number` node emitting numbers;
- <Clr nodeType="sine-oscillator">Sine</Clr> node emitting audio;
- <Clr nodeType="clock">Clock</Clr> emitting triggers;
- `Gate Length` emitting gates.

Even though those nodes differ in function so much, all of them in the end simply emit streams of numbers:

- `Number` emits arbitrary numbers;
- <Clr nodeType="sine-oscillator">Sine</Clr> emits numbers in range -1 to 1;
- <Clr nodeType="clock">Clock</Clr> and `Gate Length` nodes both emit only either 0 or 1, with nothing inbetween.
