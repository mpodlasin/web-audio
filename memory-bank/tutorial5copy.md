# Step 1

<script>
    import Clr from '../Clr.svelte';
</script>

Welcome to the fifth chapter of the `AudioCanvas` tutorial!

In Tutorial 4, we explored the four standard oscillator types: <Clr nodeType="sine-oscillator">Sine</Clr>, <Clr nodeType="triangle-oscillator">Triangle</Clr>, <Clr nodeType="square-oscillator">Square</Clr>, and <Clr nodeType="saw-oscillator">Saw</Clr>, each with its own distinct sound character.

You should be able to distinguish between them easily, so in this tutorial we will build a voice that will change the oscillator type on each note, allowing you to more easily compare their tones.

# Step 2

To achieve that, we'll use two new nodes:

The <Clr nodeType="switch">Switch</Clr> node, which allows us to select between different audio signals.

The <Clr nodeType="count">Count</Clr> node, which will help us to automatically choose the appropriate parameter value for the <Clr nodeType="switch">Switch</Clr> node.

# Step 3

<script>
    import Clr from '../Clr.svelte';
</script>

Let's start by creating our four oscillators.

Create a <Clr nodeType="sine-oscillator">Sine</Clr> oscillator, a <Clr nodeType="saw-oscillator">Saw</Clr> oscillator, a <Clr nodeType="square-oscillator">Square</Clr> oscillator, and a <Clr nodeType="triangle-oscillator">Triangle</Clr> oscillator.

# Step 4

<script>
    import Clr from '../Clr.svelte';
</script>

Now we need a way to select between these four oscillators.

This is where the <Clr nodeType="switch">Switch</Clr> node comes in. You can find it in the <Clr nodeType="switch">Effect</Clr> section of the node creation menu.

Create a <Clr nodeType="switch">Switch</Clr> node.

# Step 5

<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="switch">Switch</Clr> node has four inputs and one output.

It works like a selector: based on the value of its channel parameter, it chooses which of its inputs to route to the output.

For example, if the channel parameter is set to 1, the signal from the first input will be sent to the output.

If it's set to 2, the signal from the second input will be sent, and so on.

# Step 6

<script>
    import Clr from '../Clr.svelte';
</script>

Let's connect our oscillators to the <Clr nodeType="switch">Switch</Clr> node.

Connect each of the oscillators to a separate input of the <Clr nodeType="switch">Switch</Clr> node.

# Step 7

<script>
    import Clr from '../Clr.svelte';
</script>

Now, let's create a <Clr nodeType="gain">Gain</Clr> node and connect the output of the <Clr nodeType="switch">Switch</Clr> node to it.

Then, create an <Clr nodeType="destination">Output</Clr> node and connect the <Clr nodeType="gain">Gain</Clr> node to it.

# Step 8

<script>
    import Clr from '../Clr.svelte';
</script>

Press the play button and slowly increase the volume on the <Clr nodeType="destination">Output</Clr> node.

You should hear the sound of the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator, since the channel parameter of the <Clr nodeType="switch">Switch</Clr> node is set to 1 by default.

Try changing the channel parameter on the <Clr nodeType="switch">Switch</Clr> node to 2, 3, and 4 to hear the different oscillator types.

# Step 9

<script>
    import Clr from '../Clr.svelte';
</script>

Manually changing the <Clr nodeType="switch">Switch</Clr> parameter works for testing purposes, but we want the parameter to change automatically on each note.

To achieve this, we will use the already mentioned <Clr nodeType="count">Count</Clr> node to cycle through the values of the channel parameter.

Create the <Clr nodeType="count">Count</Clr> node. You will find it in the <Clr nodeType="count">Clock</Clr> section of the node creation menu.

# Step 10

<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="count">Count</Clr> node requires a trigger signal as its input, so we will also use the good old <Clr nodeType="clock">Clock</Clr> node.

Create a <Clr nodeType="clock">Clock</Clr> node and connect its output to the input of the <Clr nodeType="count">Count</Clr> node.

# Step 11

<script>
    import Clr from '../Clr.svelte';
</script>

Before we connect the <Clr nodeType="count">Count</Clr> node to the <Clr nodeType="switch">Switch</Clr> node, let's first investigate how it works on its own.

Create a <Clr nodeType="value">Value</Clr> node and connect the output of the <Clr nodeType="count">Count</Clr> node to it.

Also feel free to reduce the volume on the <Clr nodeType="destination">Output</Clr> node to 0.

# Step 12

<script>
    import Clr from '../Clr.svelte';
</script>

You should be seeing the numbers displayed in the <Clr nodeType="value">Value</Clr> node cycling (assuming your playback is on).

Set the tempo on the <Clr nodeType="clock">Clock</Clr> node to be below `30` BPM in order to better see what is happening.

# Step 13

<script>
    import Clr from '../Clr.svelte';
</script>

You probably noticed that when you slowed the tempo down, the numbers displayed in the <Clr nodeType="value">Value</Clr> node also started cycling slower.

When the <Clr nodeType="count">Count</Clr> node receives a trigger via its input, it increases a number emitted on its output by one.

The count starts at 0 and ends at 7, because we have set the modulo parameter to 8.

Set the modulo parameter to 4 and see what happens.

# Step 14

<script>
    import Clr from '../Clr.svelte';
</script>

Now the count starts at 0 but ends at 3.

# Step 15

<script>
    import Clr from '../Clr.svelte';
</script>

Now direct your attention towards the <Clr nodeType="switch">Switch</Clr> node.

Note that the channel parameter there has values in the range from 1 to 4.

This means, that if we set it to 1 and then connect the output of the <Clr nodeType="count">Count</Clr> node to it (going from 0 to 3), we will cycle through all 4 possible values this parameter has.

This way, on each trigger coming from the <Clr nodeType="clock">Clock</Clr> node, we will hear a different oscillator, just as we wanted.

# Step 16

<script>
    import Clr from '../Clr.svelte';
</script>

Let's do it then!

Set the channel parameter on the <Clr nodeType="switch">Switch</Clr> node to 1.

Then connect the output of the <Clr nodeType="count">Count</Clr> node to it.

Also increase the volume on the <Clr nodeType="destination">Output</Clr> node again.

# Step 17

<script>
    import Clr from '../Clr.svelte';
</script>

You can now hear the timbre coming out of your speakers change in a rhythmic manner.

The tempo of that change is controlled by the <Clr nodeType="clock">Clock</Clr> node.

Play around with its tempo parameter to see how it will affect the sound.

# Step 18

<script>
    import Clr from '../Clr.svelte';
</script>

Now set the tempo to be somewhere between 30 and 40 BPM.

# Step 19

<script>
    import Clr from '../Clr.svelte';
</script>

Let's add an <Clr nodeType="ad-envelope">AD Envelope</Clr> to change that constant sound of oscillators into something more musical.

Create an <Clr nodeType="ad-envelope">AD Envelope</Clr> node.

# Step 20

<script>
    import Clr from '../Clr.svelte';
</script>

Connect the <Clr nodeType="clock">Clock</Clr> node to the trigger input of the <Clr nodeType="ad-envelope">AD Envelope</Clr> node.

Then, connect the output of the <Clr nodeType="ad-envelope">AD Envelope</Clr> node to the gain parameter of the <Clr nodeType="gain">Gain</Clr> node.

As always, set the gain parameter to 0, as we want the envelope to fully control the amplitude.

# Step 21

<script>
    import Clr from '../Clr.svelte';
</script>

Let's make the decay a bit longer - set the decay parameter on the <Clr nodeType="ad-envelope">AD Envelope</Clr> to be above 500 ms.

Also, in order to avoid hearing characteristic clicks, let's make attack _a bit_ longer - somewhere between 5 and 10 ms.

# Step 22

<script>
    import Clr from '../Clr.svelte';
</script>

This sounds better, but is still a bit static. That's because we are playing the same note on each trigger from the <Clr nodeType="clock">Clock</Clr> node.

Let's add a <Clr nodeType="sequencer">Sequencer</Clr> and a <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr> node in order to create a melody.

# Step 23

<script>
    import Clr from '../Clr.svelte';
</script>

Connect the <Clr nodeType="clock">Clock</Clr> node to the input of the <Clr nodeType="sequencer">Sequencer</Clr> node.

Then connect the output of the <Clr nodeType="sequencer">Sequencer</Clr> node to the input of the <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr> node.

# Step 24

<script>
    import Clr from '../Clr.svelte';
</script>

Now, connect the output of the <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr> to the frequency parameter of each oscillator: <Clr nodeType="sine-oscillator">Sine</Clr>, <Clr nodeType="triangle-oscillator">Triangle</Clr>, <Clr nodeType="square-oscillator">Square</Clr>, and <Clr nodeType="saw-oscillator">Saw</Clr>.

# Step 25

<script>
    import Clr from '../Clr.svelte';
</script>

Set the frequency parameter of each oscillator to 0.

After all, we want the <Clr nodeType="sequencer">Sequencer</Clr> and <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr> to fully control the pitches of the oscillators.

# Step 26

<script>
    import Clr from '../Clr.svelte';
</script>

On the <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr>, select a few notes to create a scale. For example, you might choose C, E, G, and A for a C major pentatonic feel.

Also, adjust the frequency knobs on the <Clr nodeType="sequencer">Sequencer</Clr> to create an interesting melody.

You should now hear a melody that changes oscillator type with each note!

# Step 27

<script>
    import Clr from '../Clr.svelte';
</script>

Let's add some reverb to make the sound even more appealing.

Create a <Clr nodeType="convolution">Convolution</Clr> node.

Insert it between the <Clr nodeType="gain">Gain</Clr> node and the <Clr nodeType="destination">Output</Clr> node.

# Step 28

<script>
    import Clr from '../Clr.svelte';
</script>

Now let's experiment with different modulo values on the <Clr nodeType="count">Count</Clr> node.

Try setting it to 2, which will make the patch alternate between just two oscillator types.

Then try 3, which will cycle through three oscillator types.

Notice how these changes affect the overall character of the melody.

# Step 29

<script>
    import Clr from '../Clr.svelte';
</script>

One more creative variation we can try is to change the order of the oscillators.

Disconnect the oscillators from the <Clr nodeType="switch">Switch</Clr> node and reconnect them in a different order.

Listen to how this changes the pattern of timbres in your melody.

# Step 30

<script>
    import Clr from '../Clr.svelte';
</script>

Congratulations! You've created a dynamic patch that cycles through different oscillator types with each note.

In this tutorial, we've learned:

- How to use the <Clr nodeType="switch">Switch</Clr> node to select between different audio sources
- How to use the <Clr nodeType="count">Count</Clr> node to create cycling patterns
- How the Count node's values (0-3) map to the Switch node's inputs (1-4)
- How to combine these techniques with sequencing to create a melody that changes timbre with each note
