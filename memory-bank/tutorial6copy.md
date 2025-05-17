# Step 1

<script>
    import Clr from '../Clr.svelte';
</script>

Welcome to the sixth chapter of the `AudioCanvas` tutorial!

You might remember that in previous tutorials we described some oscillators as "richer" than others. 

For example, we mentioned that the <Clr nodeType="saw-oscillator">Saw Oscillator</Clr> sounds richer than the <Clr nodeType="square-oscillator">Square Oscillator</Clr>, which in turn sounds richer than the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>.

In this tutorial, we'll understand exactly where this difference in tone between waveforms comes from.

# Step 2

<script>
    import Clr from '../Clr.svelte';
</script>

To understand what makes oscillators sound different from each other, we need to analyze their signals more deeply.

For this, we'll use a new visualization node called the <Clr nodeType="spectrum">Spectrum</Clr> node, which will allow us to see what frequencies are present in a sound.

Create a <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 3

<script>
    import Clr from '../Clr.svelte';
</script>

Let's set up a basic patch to see how the <Clr nodeType="spectrum">Spectrum</Clr> node works.

Create a <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> and a <Clr nodeType="gain">Gain</Clr> node.

Connect the <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to the <Clr nodeType="gain">Gain</Clr> node, and then connect the <Clr nodeType="gain">Gain</Clr> node to the <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 4

<script>
    import Clr from '../Clr.svelte';
</script>

Press the play button to start audio processing.

Look at the <Clr nodeType="spectrum">Spectrum</Clr> node. You should see a single peak appear somewhere on the display.

This peak represents the frequency of our <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> - by default set to 440Hz, when you create an oscillator.

# Step 5

<script>
    import Clr from '../Clr.svelte';
</script>

Now, try changing the frequency.

Start from a low value like 100 Hz and gradually increase it while watching the <Clr nodeType="spectrum">Spectrum</Clr> node.

At the end, increase the frequency up to the maximum possible value - 10000 Hz.

# Step 6

<script>
    import Clr from '../Clr.svelte';
</script>

You saw the peak on the <Clr nodeType="spectrum">Spectrum</Clr> node travel from left to right as you increased the frequency.

The <Clr nodeType="spectrum">Spectrum</Clr> node is essentially a frequency detector that shows us what frequencies are present in a signal.

Lower frequencies appear on the left side of the display, while higher frequencies appear on the right side.

# Step 7

<script>
    import Clr from '../Clr.svelte';
</script>

On top of that, when you've set the frequency of the <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to the maximum - 10000Hz, you probably noted that the peak on the <Clr nodeType="spectrum">Spectrum</Clr> node was not even in the middle of the display.

This shows that the  <Clr nodeType="spectrum">Spectrum</Clr> node can detect *extremely* high frequencies.

Why this is important will be obvious very, very soon.

# Step 8

<script>
    import Clr from '../Clr.svelte';
</script>

Now let's see what happens when we have more than one frequency present at the same time.

Create a second <Clr nodeType="sine-oscillator">Sine Oscillator</Clr>.

# Step 9

<script>
    import Clr from '../Clr.svelte';
</script>

Connect this second <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> directly to the <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 10

<script>
    import Clr from '../Clr.svelte';
</script>

Now you should see two distinct peaks on the <Clr nodeType="spectrum">Spectrum</Clr> node - one for each <Clr nodeType="sine-oscillator">Sine Oscillator</Clr>.

Try changing the frequency of the second oscillator and observe how its peak moves independently of the first peak.

This demonstrates an important capability of the <Clr nodeType="spectrum">Spectrum</Clr> node: it can display multiple frequencies simultaneously, which is essential for analyzing complex sounds.

# Step 11

<script>
    import Clr from '../Clr.svelte';
</script>

Let's explore another aspect of the <Clr nodeType="spectrum">Spectrum</Clr> node.

Adjust the gain parameter on the <Clr nodeType="gain">Gain</Clr> node that's connected to the first <Clr nodeType="sine-oscillator">Sine Oscillator</Clr>.

You will have to lower it significanly - somwhere below 0.1 - to see a clear effect.

Watch what happens to one of the peaks in the <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 12

<script>
    import Clr from '../Clr.svelte';
</script>

When you lowered the gain, the height of the peak decreased.

This illustrates another important aspect of the <Clr nodeType="spectrum">Spectrum</Clr> display: the height of a peak represents the amplitude (or strength) of that frequency.

Taller peaks indicate stronger presence of a frequency, while shorter peaks indicate weaker presence.

# Step 13

<script>
    import Clr from '../Clr.svelte';
</script>

Now that we understand how the <Clr nodeType="spectrum">Spectrum</Clr> node works, let's use it to examine our oscillator waveforms.

Remove both <Clr nodeType="sine-oscillator">Sine Oscillators</Clr> and the <Clr nodeType="gain">Gain</Clr> node from your patch.

# Step 14

<script>
    import Clr from '../Clr.svelte';
</script>

Let's start with the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>.

Create a <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr> and connect it directly to the <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 15

<script>
    import Clr from '../Clr.svelte';
</script>

Woah! Something very interesting is happening.

Unlike the <Clr nodeType="sine-oscillator">Sine Oscillator</Clr>, which produced just one peak, the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr> creates multiple peaks!

# Step 16

<script>
    import Clr from '../Clr.svelte';
</script>

This is strange - it looks almost as if the triangle wave is composed of series of sine waves...

Well, it looks that way because this is *exactly* what is happening!

Perhaps you remember that in the very first tutorial we mentioned that the sine wave is a building block of all other sounds - this is exactly what we meant!

# Step 17

<script>
    import Clr from '../Clr.svelte';
</script>

If this is something that is difficult for you to wrap your head around, don't worry. 

At some point it will click, for now simply continue following the tutorials. 

Play around with the frequency parameter of the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr> and watch what happens with the graph on the <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 18

<script>
    import Clr from '../Clr.svelte';
</script>

You saw peaks move, but not randomly. 

Perhaps you noticed that distances between the peaks - while changing - maintain certain order.

# Step 19

<script>
    import Clr from '../Clr.svelte';
</script>

Before we discuss that further, let's get some naming conventions out of the way.

The leftmost and usually tallest peak is called the _fundamental frequency_. 

It corresponds to the frequency value set on the oscillator - literally whatever value you have set on the oscillator node right now.

# Step 20

<script>
    import Clr from '../Clr.svelte';
</script>

The additional peaks to the right are the _harmonics_. 

Each harmonic is a multiple of the fundamental frequency.

You saw that, when you were playing with the frequency knob. 

If the fundamental frequency gets higher, distances between harmonics also get higher.

_(Check again to make sure you see that!)_

# Step 21

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

# Step 22

<script>
    import Clr from '../Clr.svelte';
</script>

Now, let's examine the <Clr nodeType="square-oscillator">Square Oscillator</Clr>.

Remove the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>.

Create a <Clr nodeType="square-oscillator">Square Oscillator</Clr> and connect it to the <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 23

<script>
    import Clr from '../Clr.svelte';
</script>

Observe the spectrum again. Just like the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>, the <Clr nodeType="square-oscillator">Square Oscillator</Clr> also produces multiple peaks.

You should notice that there are still multiple harmonics, but they look different from the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>'s harmonics.

In particular, the higher harmonics of the <Clr nodeType="square-oscillator">Square Oscillator</Clr> seem more prominent compared to those of the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>.

# Step 24

<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="square-oscillator">Square Oscillator</Clr> has the following harmonic pattern:

1. Like the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>, it contains only odd harmonics (3rd, 5th, 7th, etc.)
2. However unlike the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>, its harmonics decrease more slowly.

This slower decrease in amplitude means that higher harmonics remain more prominent, which is why the <Clr nodeType="square-oscillator">Square Oscillator</Clr> sounds "brighter" or "harsher" than the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>, despite both having only odd harmonics.

# Step 25

<script>
    import Clr from '../Clr.svelte';
</script>

Finally, let's examine the <Clr nodeType="saw-oscillator">Saw Oscillator</Clr>.

Remove the <Clr nodeType="square-oscillator">Square Oscillator</Clr>.

Create a <Clr nodeType="saw-oscillator">Saw Oscillator</Clr> and connect it to the <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 26

<script>
    import Clr from '../Clr.svelte';
</script>

Look at the <Clr nodeType="spectrum">Spectrum</Clr> node again. 

The <Clr nodeType="saw-oscillator">Saw Oscillator</Clr> produces even more peaks than either the <Clr nodeType="triangle-oscillator">Triangle</Clr> or <Clr nodeType="square-oscillator">Square</Clr> oscillators!

# Step 27

<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="saw-oscillator">Saw Oscillator</Clr> contains *all* harmonics (both odd and even).

With a fundamental frequency of 100 Hz, the <Clr nodeType="saw-oscillator">Saw Oscillator</Clr> has harmonics at:
- 200 Hz (2nd harmonic)
- 300 Hz (3rd harmonic)
- 400 Hz (4th harmonic)
- 500 Hz (5th harmonic)
- And so on...

This rich harmonic content is why the <Clr nodeType="saw-oscillator">Saw Oscillator</Clr> sounds the "richest" or most "aggressive" of all the standard waveforms.

# Step 28

<script>
    import Clr from '../Clr.svelte';
</script>

Now we can understand the differences between all our oscillator types based on their harmonic content:

- <Clr nodeType="sine-oscillator">Sine Oscillator</Clr>: Contains only the fundamental frequency with no harmonics. This gives it a pure, simple sound.

- <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr>: Contains only odd harmonics (3rd, 5th, 7th...) with amplitudes that decrease very quickly. This gives it a somewhat richer sound than the sine wave, but still relatively mellow.

- <Clr nodeType="square-oscillator">Square Oscillator</Clr>: Contains only odd harmonics (3rd, 5th, 7th...), but their amplitudes decrease more gradually than in the triangle wave. This means higher harmonics remain more prominent, making it sound brighter and harsher than the triangle wave.

- <Clr nodeType="saw-oscillator">Saw Oscillator</Clr>: Contains all harmonics (both odd and even) with amplitudes that decrease gradually. This gives it the richest, most complex sound of all the standard oscillators.

This harmonic content is exactly what creates the differences in "richness" that we mentioned in previous tutorials. The more harmonics present (and the stronger they are), the richer and more complex the sound will be!
