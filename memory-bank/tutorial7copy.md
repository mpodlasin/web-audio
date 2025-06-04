# Step 1

<script>
    import Clr from '../Clr.svelte';
</script>

Welcome to the seventh chapter of the `AudioCanvas` tutorial!

In Tutorial 6, we discovered that complex waveforms like the <Clr nodeType="saw-oscillator">Saw Oscillator</Clr> contain multiple harmonics - additional frequencies that give them their characteristic sound.

What if we could build a complex waveform from scratch using only <Clr nodeType="sine-oscillator">Sine</Clr> waves?

In this tutorial, we'll recreate a <Clr nodeType="saw-oscillator">Saw</Clr> wave using multiple <Clr nodeType="sine-oscillator">Sine</Clr> oscillators. This technique is called _additive synthesis_ - building complex sounds by adding simple components together.

# Step 2

<script>
    import Clr from '../Clr.svelte';
</script>

We'll start by creating a reference <Clr nodeType="saw-oscillator">Saw</Clr> wave to compare our synthesized version against.

Create a <Clr nodeType="saw-oscillator">Saw Oscillator</Clr> and a <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 3

<script>
    import Clr from '../Clr.svelte';
</script>

Connect the <Clr nodeType="saw-oscillator">Saw Oscillator</Clr> to the <Clr nodeType="spectrum">Spectrum</Clr> node.

The <Clr nodeType="spectrum">Spectrum</Clr> node will show us the harmonic pattern we're trying to recreate.

# Step 4

<script>
    import Clr from '../Clr.svelte';
</script>

Now we need a way to easily compare between our reference <Clr nodeType="saw-oscillator">Saw</Clr> wave and the version we'll build.

For this, we'll use a <Clr nodeType="switch">Switch</Clr> node, which you can find in the <Clr nodeType="switch">Effect</Clr> section of the node creation menu.

Create a <Clr nodeType="switch">Switch</Clr> node and an <Clr nodeType="destination">Output</Clr> node.

# Step 5

<script>
    import Clr from '../Clr.svelte';
</script>

Connect the <Clr nodeType="switch">Switch</Clr> node to the <Clr nodeType="destination">Output</Clr> node.

This will be our final audio output where we can hear either the reference or our synthesized version.

# Step 6

<script>
    import Clr from '../Clr.svelte';
</script>

Connect the output of the <Clr nodeType="spectrum">Spectrum</Clr> node to the first input of the <Clr nodeType="switch">Switch</Clr> node.

Remember, the <Clr nodeType="spectrum">Spectrum</Clr> node has a pass-through output that allows you to both visualize and hear the signal.

# Step 7

<script>
    import Clr from '../Clr.svelte';
</script>

Press the play button and slowly increase the volume on the <Clr nodeType="destination">Output</Clr> node.

You should hear the <Clr nodeType="saw-oscillator">Saw</Clr> wave and see its harmonic pattern on the <Clr nodeType="spectrum">Spectrum</Clr> node - multiple peaks representing all the harmonics we learned about in Tutorial 6.

# Step 8

<script>
    import Clr from '../Clr.svelte';
</script>

Now we'll prepare to build our own version using individual <Clr nodeType="sine-oscillator">Sine</Clr> waves.

Each <Clr nodeType="sine-oscillator">Sine</Clr> wave will represent one harmonic of the <Clr nodeType="saw-oscillator">Saw</Clr> wave.

Create a second <Clr nodeType="spectrum">Spectrum</Clr> node and connect it to the second input of the <Clr nodeType="switch">Switch</Clr> node.

# Step 9

<script>
    import Clr from '../Clr.svelte';
</script>

Let's start building our synthesized version with the fundamental frequency.

Create a <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> and connect it to the second <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 10

<script>
    import Clr from '../Clr.svelte';
</script>

Set the channel parameter on the <Clr nodeType="switch">Switch</Clr> node to 2 to hear our synthesized version.

You should see a single peak on the second <Clr nodeType="spectrum">Spectrum</Clr> node and hear a pure <Clr nodeType="sine-oscillator">Sine</Clr> wave.

# Step 11

<script>
    import Clr from '../Clr.svelte';
</script>

They sound nothing alike! Let's get to work.

You can compare our version to the reference <Clr nodeType="saw-oscillator">Saw</Clr> wave anytime by changing the channel parameter on the <Clr nodeType="switch">Switch</Clr> node between 1 and 2.

# Step 12

<script>
    import Clr from '../Clr.svelte';
</script>

Now we'll add the second harmonic.

Create a second <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> and set its frequency parameter to 880 Hz - exactly twice the fundamental frequency of 440 Hz.

# Step 13

<script>
    import Clr from '../Clr.svelte';
</script>

In Tutorial 6, we mentioned that harmonics decrease in amplitude, but we didn't explain exactly how fast.

For <Clr nodeType="saw-oscillator">Saw</Clr> waves, each harmonic's amplitude follows the _1/n rule_ - the second harmonic has 1/2 the amplitude, the third has 1/3, and so on.

Create a <Clr nodeType="gain">Gain</Clr> node and set its gain parameter to 0.5 (which is 1/2).

# Step 14

<script>
    import Clr from '../Clr.svelte';
</script>

Connect the second <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to the <Clr nodeType="gain">Gain</Clr> node, then connect the <Clr nodeType="gain">Gain</Clr> node to the second <Clr nodeType="spectrum">Spectrum</Clr> node.

You should now see two peaks and notice the sound becoming slightly richer.

# Step 15

<script>
    import Clr from '../Clr.svelte';
</script>

Let's add the third harmonic.

Create a third <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> and set its frequency parameter to 1320 Hz (3 × 440 Hz).

# Step 16

<script>
    import Clr from '../Clr.svelte';
</script>

Create a second <Clr nodeType="gain">Gain</Clr> node and set its gain parameter to 0.33 (which is approximately 1/3).

Connect the third <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to this <Clr nodeType="gain">Gain</Clr> node, then connect the <Clr nodeType="gain">Gain</Clr> node to the second <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 17

<script>
    import Clr from '../Clr.svelte';
</script>

Notice the sound becoming more complex and closer to the <Clr nodeType="saw-oscillator">Saw</Clr> wave character.

Let's continue adding harmonics. Create a fourth <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> and set its frequency parameter to 1760 Hz (4 × 440 Hz).

# Step 18

<script>
    import Clr from '../Clr.svelte';
</script>

Create a third <Clr nodeType="gain">Gain</Clr> node and set its gain parameter to 0.25 (which is 1/4).

Connect the fourth <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to this <Clr nodeType="gain">Gain</Clr> node, then connect the <Clr nodeType="gain">Gain</Clr> node to the second <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 19

<script>
    import Clr from '../Clr.svelte';
</script>

Let's add the fifth harmonic.

Create a fifth <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> and set its frequency parameter to 2200 Hz (5 × 440 Hz).

# Step 20

<script>
    import Clr from '../Clr.svelte';
</script>

Create a fourth <Clr nodeType="gain">Gain</Clr> node and set its gain parameter to 0.2 (which is 1/5).

Connect the fifth <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to this <Clr nodeType="gain">Gain</Clr> node, then connect the <Clr nodeType="gain">Gain</Clr> node to the second <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 21

<script>
    import Clr from '../Clr.svelte';
</script>

Let's add one more harmonic - the sixth.

Create a sixth <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> and set its frequency parameter to 2640 Hz (6 × 440 Hz).

# Step 22

<script>
    import Clr from '../Clr.svelte';
</script>

Create a fifth <Clr nodeType="gain">Gain</Clr> node and set its gain parameter to 0.167 (which is approximately 1/6).

Connect the sixth <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to this <Clr nodeType="gain">Gain</Clr> node, then connect the <Clr nodeType="gain">Gain</Clr> node to the second <Clr nodeType="spectrum">Spectrum</Clr> node.

# Step 23

<script>
    import Clr from '../Clr.svelte';
</script>

Compare the two versions now by switching the channel parameter between 1 and 2.

With each harmonic added, our sound becomes closer to the <Clr nodeType="saw-oscillator">Saw</Clr> wave. Our version still sounds somewhat "muffled" because we would need many more harmonics to perfectly match the original, but the character is definitely there!

# Step 24

<script>
    import Clr from '../Clr.svelte';
</script>

So far our oscillator bank just plays the same note. Let's make it more musical by adding frequency control.

Our goal is to change the fundamental frequency and have all harmonics follow automatically.

Create a <Clr nodeType="number">Number</Clr> node. You can find it in the <Clr nodeType="number">Math</Clr> section of the node creation menu.

# Step 25

<script>
    import Clr from '../Clr.svelte';
</script>

Set the value parameter on the <Clr nodeType="number">Number</Clr> node to 440.

Connect the <Clr nodeType="number">Number</Clr> node output to the frequency parameter of the first <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> (our fundamental).

Then set the frequency parameter on that <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> to 0.

# Step 26

<script>
    import Clr from '../Clr.svelte';
</script>

Now we need to create harmonic multipliers for the remaining oscillators.

Create five <Clr nodeType="times">Times</Clr> nodes. You can find them in the <Clr nodeType="times">Math</Clr> section of the node creation menu.

These will calculate the harmonic frequencies automatically.

# Step 27

<script>
    import Clr from '../Clr.svelte';
</script>

For each <Clr nodeType="times">Times</Clr> node, we need a corresponding <Clr nodeType="number">Number</Clr> node to set the harmonic multiplier.

Create five more <Clr nodeType="number">Number</Clr> nodes.

# Step 28

<script>
    import Clr from '../Clr.svelte';
</script>

Set the value parameters on the five new <Clr nodeType="number">Number</Clr> nodes to 2, 3, 4, 5, and 6 respectively.

These represent the harmonic numbers for our oscillators.

# Step 29

<script>
    import Clr from '../Clr.svelte';
</script>

Connect each harmonic <Clr nodeType="number">Number</Clr> node to the first input of its corresponding <Clr nodeType="times">Times</Clr> node.

Then connect the main frequency <Clr nodeType="number">Number</Clr> node (set to 440) to the second input of each <Clr nodeType="times">Times</Clr> node.

# Step 30

<script>
    import Clr from '../Clr.svelte';
</script>

Connect each <Clr nodeType="times">Times</Clr> node to the frequency parameter of its corresponding <Clr nodeType="sine-oscillator">Sine Oscillator</Clr> (second through sixth oscillators).

Set the frequency parameter on each of these oscillators to 0.

# Step 31

<script>
    import Clr from '../Clr.svelte';
</script>

For accurate comparison, let's also control the reference <Clr nodeType="saw-oscillator">Saw Oscillator</Clr> with the same frequency.

Connect the main frequency <Clr nodeType="number">Number</Clr> node to the frequency parameter of the <Clr nodeType="saw-oscillator">Saw Oscillator</Clr>.

Set the frequency parameter on the <Clr nodeType="saw-oscillator">Saw Oscillator</Clr> to 0.

# Step 32

<script>
    import Clr from '../Clr.svelte';
</script>

Now test the frequency control!

Set the <Clr nodeType="switch">Switch</Clr> to channel 1 and try changing the value on the main frequency <Clr nodeType="number">Number</Clr> node. 

You should hear the <Clr nodeType="saw-oscillator">Saw</Clr> wave pitch change smoothly.

# Step 33

<script>
    import Clr from '../Clr.svelte';
</script>

Set the <Clr nodeType="switch">Switch</Clr> to channel 2 and try the same frequency sweep with your synthesized version.

All the harmonics should follow the fundamental frequency, maintaining their proper relationships!

# Step 34

<script>
    import Clr from '../Clr.svelte';
</script>

Our oscillator bank doesn't perfectly emulate the <Clr nodeType="saw-oscillator">Saw</Clr> wave, but even with just six oscillators, we've recreated much of its characteristic sound.

The difference you hear is because a true <Clr nodeType="saw-oscillator">Saw</Clr> wave contains _all_ harmonics extending to very high frequencies, while we've only included the first six.

# Step 35

<script>
    import Clr from '../Clr.svelte';
</script>

Adding more <Clr nodeType="sine-oscillator">Sine</Clr> oscillators by hand would be tedious, but computer software can easily create hundreds of them.

Thanks to this, additive synthesis is a technique widely used in professional synthesizers, making it important to understand.

You've just learned one of the fundamental principles of sound synthesis - that complex sounds can be built from simple sine wave components!
