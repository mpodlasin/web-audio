<script>
    import Clr from '../Clr.svelte';
</script>

Our oscillator bank doesn't perfectly emulate the <Clr nodeType="saw-oscillator">Saw</Clr> wave, but even with just six oscillators, we've recreated much of its characteristic sound.

The difference you hear is because a true <Clr nodeType="saw-oscillator">Saw</Clr> wave contains _all_ harmonics extending to very high frequencies, while we've only included the first six.