<script>
    import Clr from '../Clr.svelte';
</script>

Welcome to the seventh chapter of the `AudioCanvas` tutorial!

In Tutorial 6, we discovered that complex waveforms like the <Clr nodeType="saw-oscillator">Saw Oscillator</Clr> contain multiple harmonics - additional frequencies that give them their characteristic sound.

What if we could build a complex waveform from scratch using only <Clr nodeType="sine-oscillator">Sine</Clr> waves?

In this tutorial, we'll recreate a <Clr nodeType="saw-oscillator">Saw</Clr> wave using multiple <Clr nodeType="sine-oscillator">Sine</Clr> oscillators. This technique is called _additive synthesis_ - building complex sounds by adding simple components together.