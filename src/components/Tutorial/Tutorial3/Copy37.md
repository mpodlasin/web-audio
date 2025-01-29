<script>
    import Clr from '../Clr.svelte';
</script>

Luckily, multiplying signals to modulate parameters is so common in `AudioCanvas` that there’s an easier, built-in way to do it.

Click on the connection between the <Clr nodeType="sine-oscillator">Sine</Clr> and <Clr nodeType="triangle-oscillator">Triangle</Clr> oscillators.

In the context menu, you will see an option titled `Mult`.

Click on it, and a knob will appear, allowing you to set the multiplication value.
