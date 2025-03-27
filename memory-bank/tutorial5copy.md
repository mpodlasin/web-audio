# Step 1

<script>
    import Clr from '../Clr.svelte';
</script>

Welcome to the fifth chapter of the `AudioCanvas` tutorial!

In Tutorial 4, we explored the four standard oscillator types: <Clr nodeType="sine-oscillator">Sine</Clr>, <Clr nodeType="triangle-oscillator">Triangle</Clr>, <Clr nodeType="square-oscillator">Square</Clr>, and <Clr nodeType="saw-oscillator">Saw</Clr>, each with its own distinct sound character.

Today, we'll build on that knowledge to create something more dynamic: a voice that changes its oscillator type with each note, automatically cycling through the different timbres.

To accomplish this, we'll use two new nodes: the <Clr nodeType="switch">Switch</Clr> node, which allows us to select between different audio sources, and the <Clr nodeType="count">Count</Clr> node, which helps us cycle through options automatically.

# Step 2

<script>
    import Clr from '../Clr.svelte';
</script>

Let's start by creating our four oscillators.

Create a <Clr nodeType="sine-oscillator">Sine</Clr> oscillator, a <Clr nodeType="triangle-oscillator">Triangle</Clr> oscillator, a <Clr nodeType="square-oscillator">Square</Clr> oscillator, and a <Clr nodeType="saw-oscillator">Saw</Clr> oscillator.

# Step 3

<script>
    import Clr from '../Clr.svelte';
</script>

Now we need a way to select between these four oscillators.

This is where the <Clr nodeType="switch">Switch</Clr> node comes in. You can find it in the <Clr nodeType="switch">Utility</Clr> section of the node creation menu.

Create a <Clr nodeType="switch">Switch</Clr> node.

# Step 4

<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="switch">Switch</Clr> node has four inputs labeled 1, 2, 3, and 4, and one output.

It works like a selector: based on the value of its input parameter, it chooses which of its inputs to route to its output.

For example, if the input parameter is set to 1, the signal from input 1 will be sent to the output. If it's set to 2, the signal from input 2 will be sent, and so on.

# Step 5

<script>
    import Clr from '../Clr.svelte';
</script>

Let's connect our oscillators to the <Clr nodeType="switch">Switch</Clr> node:

1. Connect the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator to input 1 of the <Clr nodeType="switch">Switch</Clr> node.
2. Connect the <Clr nodeType="triangle-oscillator">Triangle</Clr> oscillator to input 2.
3. Connect the <Clr nodeType="square-oscillator">Square</Clr> oscillator to input 3.
4. Connect the <Clr nodeType="saw-oscillator">Saw</Clr> oscillator to input 4.

# Step 6

<script>
    import Clr from '../Clr.svelte';
</script>

Now, let's create a <Clr nodeType="gain">Gain</Clr> node and connect the output of the <Clr nodeType="switch">Switch</Clr> node to it.

Then, create an <Clr nodeType="destination">Output</Clr> node and connect the <Clr nodeType="gain">Gain</Clr> node to it.

# Step 7

<script>
    import Clr from '../Clr.svelte';
</script>

Press the play button and slowly increase the volume on the <Clr nodeType="destination">Output</Clr> node.

You should hear the sound of the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator, since the input parameter of the <Clr nodeType="switch">Switch</Clr> node is set to 1 by default.

Try changing the input parameter on the <Clr nodeType="switch">Switch</Clr> node to 2, 3, and 4 to hear the different oscillator types.

# Step 8

<script>
    import Clr from '../Clr.svelte';
</script>

Manually changing the <Clr nodeType="switch">Switch</Clr> parameter works, but it would be more interesting if the oscillator type changed automatically with each note.

To achieve this, we'll use a <Clr nodeType="clock">Clock</Clr> node to generate regular triggers and a <Clr nodeType="count">Count</Clr> node to cycle through our oscillator options.

Create a <Clr nodeType="clock">Clock</Clr> node.

# Step 9

<script>
    import Clr from '../Clr.svelte';
</script>

Now, create a <Clr nodeType="count">Count</Clr> node. You can find it in the <Clr nodeType="count">Utility</Clr> section.

The <Clr nodeType="count">Count</Clr> node counts incoming triggers and outputs the current count. It has a modulo parameter that determines when the count resets to 1.

For example, if the modulo is set to 4, the <Clr nodeType="count">Count</Clr> node will output 1, 2, 3, 4, 1, 2, 3, 4, and so on.

# Step 10

<script>
    import Clr from '../Clr.svelte';
</script>

Connect the <Clr nodeType="clock">Clock</Clr> node to the input of the <Clr nodeType="count">Count</Clr> node.

Set the modulo parameter of the <Clr nodeType="count">Count</Clr> node to 4, since we have four oscillator types.

# Step 11

<script>
    import Clr from '../Clr.svelte';
</script>

Now, connect the output of the <Clr nodeType="count">Count</Clr> node to the input parameter of the <Clr nodeType="switch">Switch</Clr> node.

With this setup, each time the <Clr nodeType="clock">Clock</Clr> node sends a trigger, the <Clr nodeType="count">Count</Clr> node will increment its count and output the new value, which will then be used by the <Clr nodeType="switch">Switch</Clr> node to select a different oscillator.

# Step 12

<script>
    import Clr from '../Clr.svelte';
</script>

Press the play button if it's not already on.

You should now hear the oscillator type changing automatically with each tick of the <Clr nodeType="clock">Clock</Clr> node.

Try adjusting the tempo parameter of the <Clr nodeType="clock">Clock</Clr> node to change how quickly the oscillator types cycle.

# Step 13

<script>
    import Clr from '../Clr.svelte';
</script>

Currently, the sound plays continuously. Let's add an <Clr nodeType="ad-envelope">AD Envelope</Clr> to shape the amplitude of each note, just like we did in previous tutorials.

Create an <Clr nodeType="ad-envelope">AD Envelope</Clr> node.

# Step 14

<script>
    import Clr from '../Clr.svelte';
</script>

Connect the <Clr nodeType="clock">Clock</Clr> node to the trigger input of the <Clr nodeType="ad-envelope">AD Envelope</Clr> node.

Then, connect the output of the <Clr nodeType="ad-envelope">AD Envelope</Clr> node to the gain parameter of the <Clr nodeType="gain">Gain</Clr> node.

Set the gain parameter itself to 0, as we want the envelope to fully control the amplitude.

# Step 15

<script>
    import Clr from '../Clr.svelte';
</script>

Now we have a patch that cycles through different oscillator types with each note, but all the notes have the same pitch.

Let's add a <Clr nodeType="sequencer">Sequencer</Clr> node to create a melody. You can find it in the <Clr nodeType="sequencer">Pitch</Clr> section.

Create a <Clr nodeType="sequencer">Sequencer</Clr> node.

# Step 16

<script>
    import Clr from '../Clr.svelte';
</script>

Connect the <Clr nodeType="clock">Clock</Clr> node to the input of the <Clr nodeType="sequencer">Sequencer</Clr> node.

This will make the <Clr nodeType="sequencer">Sequencer</Clr> advance to the next step with each tick of the <Clr nodeType="clock">Clock</Clr>.

# Step 17

<script>
    import Clr from '../Clr.svelte';
</script>

Now we need to connect the <Clr nodeType="sequencer">Sequencer</Clr> to the frequency parameters of all four oscillators.

Connect the output of the <Clr nodeType="sequencer">Sequencer</Clr> to the frequency parameter of each oscillator: <Clr nodeType="sine-oscillator">Sine</Clr>, <Clr nodeType="triangle-oscillator">Triangle</Clr>, <Clr nodeType="square-oscillator">Square</Clr>, and <Clr nodeType="saw-oscillator">Saw</Clr>.

# Step 18

<script>
    import Clr from '../Clr.svelte';
</script>

Set the frequency parameter of each oscillator to 0, since we want the <Clr nodeType="sequencer">Sequencer</Clr> to fully control the pitch.

# Step 19

<script>
    import Clr from '../Clr.svelte';
</script>

Let's add a <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr> to ensure our melody uses musical notes. You can find it in the <Clr nodeType="pitch-quantizer">Pitch</Clr> section.

Create a <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr> node.

# Step 20

<script>
    import Clr from '../Clr.svelte';
</script>

We need to insert the <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr> between the <Clr nodeType="sequencer">Sequencer</Clr> and the oscillators.

First, disconnect the <Clr nodeType="sequencer">Sequencer</Clr> from all the oscillators.

Then, connect the output of the <Clr nodeType="sequencer">Sequencer</Clr> to the input of the <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr>.

Finally, connect the output of the <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr> to the frequency parameter of each oscillator.

# Step 21

<script>
    import Clr from '../Clr.svelte';
</script>

On the <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr>, select a few notes to create a scale. For example, you might choose C, E, G, and A for a C major pentatonic feel.

Also, adjust the frequency knobs on the <Clr nodeType="sequencer">Sequencer</Clr> to create an interesting melody.

You should now hear a melody that changes oscillator type with each note!

# Step 22

<script>
    import Clr from '../Clr.svelte';
</script>

Let's add some reverb to make our sound more polished.

Create a <Clr nodeType="convolution">Convolution</Clr> node from the <Clr nodeType="convolution">Effect</Clr> section.

Insert it between the <Clr nodeType="gain">Gain</Clr> node and the <Clr nodeType="destination">Output</Clr> node.

# Step 23

<script>
    import Clr from '../Clr.svelte';
</script>

Now let's experiment with different modulo values on the <Clr nodeType="count">Count</Clr> node.

Try setting it to 2, which will make the patch alternate between just two oscillator types.

Then try 3, which will cycle through three oscillator types.

Notice how these changes affect the overall character of the melody.

# Step 24

<script>
    import Clr from '../Clr.svelte';
</script>

Let's also experiment with different tempo settings.

Adjust the tempo parameter on the <Clr nodeType="clock">Clock</Clr> node to find a setting that works well with your melody.

A slower tempo will give each note more time to be heard, while a faster tempo will create a more rapid, arpeggio-like effect.

# Step 25

<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="ad-envelope">AD Envelope</Clr> parameters can dramatically change the character of each note.

Try different attack and decay settings:
- Short attack and decay for a plucky, percussive sound
- Longer attack for a softer, pad-like sound
- Longer decay to let notes overlap more

Find settings that complement your melody and oscillator sequence.

# Step 26

<script>
    import Clr from '../Clr.svelte';
</script>

One more creative variation we can try is to change the order of the oscillators.

Disconnect the oscillators from the <Clr nodeType="switch">Switch</Clr> node and reconnect them in a different order. For example:
1. <Clr nodeType="saw-oscillator">Saw</Clr> to input 1
2. <Clr nodeType="sine-oscillator">Sine</Clr> to input 2
3. <Clr nodeType="triangle-oscillator">Triangle</Clr> to input 3
4. <Clr nodeType="square-oscillator">Square</Clr> to input 4

Listen to how this changes the pattern of timbres in your melody.

# Step 27

<script>
    import Clr from '../Clr.svelte';
</script>

Congratulations! You've created a dynamic patch that cycles through different oscillator types with each note.

This technique of using a <Clr nodeType="count">Count</Clr> node to control a <Clr nodeType="switch">Switch</Clr> node can be applied to many other aspects of sound design, not just oscillator selection.

For example, you could use it to cycle through different filter types, envelope shapes, or effect settings.

# Step 28

<script>
    import Clr from '../Clr.svelte';
</script>

In this tutorial, we've learned:
- How to use the <Clr nodeType="switch">Switch</Clr> node to select between different audio sources
- How to use the <Clr nodeType="count">Count</Clr> node to create cycling patterns
- How to combine these techniques with sequencing to create a melody that changes timbre with each note

Feel free to continue experimenting with this patch. Try adding more oscillators, using different scales in the <Clr nodeType="pitch-quantizer">Pitch Quantizer</Clr>, or creating more complex melodies with the <Clr nodeType="sequencer">Sequencer</Clr>.

The possibilities for creative sound design are endless!
