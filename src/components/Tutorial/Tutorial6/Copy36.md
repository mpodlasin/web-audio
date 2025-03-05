<script>
    import Clr from '../Clr.svelte';
</script>

Note that the harmonics are evenly spaced on the graph.  

That's because each harmonic is a multiple of the fundamental frequency.  

In a triangle wave, the harmonics are _odd_ multiples of the fundamental.  

So if you set the frequency to `100` Hz, the harmonics would appear at `300` Hz, `500` Hz, `700` Hz, and so on.  
