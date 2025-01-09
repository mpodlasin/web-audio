<script>
    import Clr from '../Clr.svelte';
</script>

This way `AD Envelope` node will control loudness of sine oscillator and give it that "guitar-like" pluck sound.

Now reduce the value of gain parameter itself to 0, just as we did before with frequency parameter of <Clr nodeType="sine-oscillator">Sine</Clr> oscillator.

That's because when the "pluck" ends, we want it to go completely silent.
