# Step 1

Welcome to the third chapter of the `AudioCanvas` tutorial!

In the previous chapter, we explored different types of signals and learned that all of them - whether audio, envelopes, or triggers - are simply streams of numbers.

In this chapter, we’ll put that knowledge into practice by building a fun and dynamic techno kick.

Along the way, we’ll use signals in atypical ways to further demonstrate that all signal types can be mixed freely.

Let’s dive in!

# Step 2

<script>
    import Clr from '../Clr.svelte';
</script>

Perhaps when creating a <Clr nodeType="sine-oscillator">Sine</Clr> oscillator in previous tutorials, you noticed that there are several oscillator types in the <Clr nodeType="sine-oscillator">Oscillator</Clr> section.

This time, we will use a <Clr nodeType="triangle-oscillator">Triangle</Clr> oscillator as the base of our sound.

Create a <Clr nodeType="triangle-oscillator">Triangle</Clr> node and a <Clr nodeType="destination">Output</Clr> node, and connect them together to hear how the <Clr nodeType="triangle-oscillator">Triangle</Clr> oscillator sounds.

# Step 3

<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="triangle-oscillator">Triangle</Clr> oscillator produces a slightly richer tone, making it perfect for creating a grittier techno kick.

Before we go any further, it will be useful to see the oscillator's waveform on the oscilloscope.

Create an <Clr nodeType="oscilloscope">Oscilloscope</Clr> node.

Connect the <Clr nodeType="triangle-oscillator">Triangle</Clr> node to the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node.

Reduce the frequency parameter of the <Clr nodeType="triangle-oscillator">Triangle</Clr> node to below 1 hertz.

# Step 4

<script>
    import Clr from '../Clr.svelte';
</script>

Unsurprisingly, you can see that the shape of the <Clr nodeType="triangle-oscillator">Triangle</Clr> waveform is... a triangle!

Now detach the <Clr nodeType="triangle-oscillator">Triangle</Clr> node from the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node.

However, leave the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node off to the side - we’ll need it later.

# Step 5

<script>
    import Clr from '../Clr.svelte';
</script>

Let’s set the frequency of the <Clr nodeType="triangle-oscillator">Triangle</Clr> node to 55 Hz.

This will give the oscillator a deep tone, perfect for the base of our kick drum.

# Step 6

<script>
    import Clr from '../Clr.svelte';
</script>

Let’s add a <Clr nodeType="gain">Gain</Clr> node to control the volume of our oscillator.

Insert the <Clr nodeType="gain">Gain</Clr> node between the <Clr nodeType="triangle-oscillator">Triangle</Clr> node and the <Clr nodeType="destination">Output</Clr> node.

The sound should remain the same for now, but we’ll use the <Clr nodeType="gain">Gain</Clr> node to shape the loudness in the next steps.

# Step 7

<script>
    import Clr from '../Clr.svelte';
</script>

We now want to control the volume of the oscillator.

In previous tutorials, we used an <Clr nodeType="ad-envelope">AD Envelope</Clr> for this. This time, we’ll take a different approach.

For variety, and to show that different signal types can achieve the same result, we’ll use a new node type: the <Clr nodeType="saw-lfo">LFO</Clr>.

# Step 8

<script>
    import Clr from '../Clr.svelte';
</script>

An <Clr nodeType="saw-lfo">LFO</Clr> is nothing more than a slowed-down oscillator - a "low-frequency oscillator", hence the name.

Instead of producing audible sounds, LFOs are used to modulate other parameters.

Each node in the <Clr nodeType="sine-oscillator">Oscillator</Clr> category has a counterpart in the <Clr nodeType="sine-lfo">LFO</Clr> category.

For example, you could create a <Clr nodeType="sine-lfo">Sine LFO</Clr> and use its characteristic wave shape to modulate a parameter of another node.

# Step 9

<script>
    import Clr from '../Clr.svelte';
</script>

This time, we will use a <Clr nodeType="saw-lfo">Saw LFO</Clr>.

We haven’t encountered a saw waveform yet, so before actually using the <Clr nodeType="saw-lfo">Saw LFO</Clr>, let’s observe its shape first.

Create a <Clr nodeType="saw-lfo">Saw LFO</Clr> node and connect it to the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node.

# Step 10

<script>
    import Clr from '../Clr.svelte';
</script>

Look at the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node.

Not surprisingly, the shape of the <Clr nodeType="saw-lfo">Saw LFO</Clr> looks like the teeth of a saw.

Notice that this shape is quite similar to the shape of the <Clr nodeType="ad-envelope">AD Envelope</Clr> that we used earlier.

# Step 11

<script>
    import Clr from '../Clr.svelte';
</script>

The key difference is that the <Clr nodeType="ad-envelope">AD Envelope</Clr> needed to be triggered with a <Clr nodeType="clock">Clock</Clr> node, whereas the <Clr nodeType="saw-lfo">Saw LFO</Clr> runs continuously on its own.

Additionally, the tail of the <Clr nodeType="ad-envelope">AD Envelope</Clr> was more concave, while the tail of the <Clr nodeType="saw-lfo">Saw LFO</Clr> is flat.

This flat tail will make the kick ring out for longer, giving it that characteristic techno bass tail sound.

# Step 12

<script>
    import Clr from '../Clr.svelte';
</script>

Before we can use the <Clr nodeType="saw-lfo">Saw LFO</Clr> to control the volume, there’s something we need to adjust.

By default, the <Clr nodeType="saw-lfo">Saw LFO</Clr> outputs a signal in the range of `-1` to `1`.

However, the <Clr nodeType="gain">Gain</Clr> node expects a value in the range of `0` to `1`.

To fix this, enable the unipolar option on the <Clr nodeType="saw-lfo">Saw LFO</Clr> by clicking the button with the "unipolar" label.

# Step 13

<script>
    import Clr from '../Clr.svelte';
</script>

Take a look at the <Clr nodeType="oscilloscope">Oscilloscope</Clr> now.

You’ll notice that the saw waveform has shifted upwards.

Instead of dipping below zero, the entire shape stays within the range of `0` to `1`.

# Step 14

<script>
    import Clr from '../Clr.svelte';
</script>

Now connect the output of the <Clr nodeType="saw-lfo">Saw LFO</Clr> to the gain parameter input of the <Clr nodeType="gain">Gain</Clr> node.

Also, reduce the value on the gain knob itself to `0`, just as we did when connecting an <Clr nodeType="ad-envelope">AD Envelope</Clr> node to it.

# Step 15

<script>
    import Clr from '../Clr.svelte';
</script>

You can hear a rhythmic pulsing effect, as the <Clr nodeType="saw-lfo">Saw LFO</Clr> modulates the volume of the oscillator.

The sharp rise in the saw waveform creates an immediate burst of volume, followed by a gradual decrease before the cycle repeats.

# Step 16

<script>
    import Clr from '../Clr.svelte';
</script>

The current tempo is a bit slow for a typical techno rhythm. Let’s increase it.

Do that by setting the frequency parameter on the <Clr nodeType="saw-lfo">Saw LFO</Clr> to `2 Hz`.

As you do this, observe how the waveform displayed in the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node changes.

# Step 17

<script>
    import Clr from '../Clr.svelte';
</script>

Note how in the case of <Clr nodeType="sine-oscillator">Oscillator</Clr> nodes, we used the frequency parameter to control pitch.

Meanwhile, here in the case of the <Clr nodeType="saw-lfo">LFO</Clr>, we control the length of the waveform.

It turns out that these two concepts are equivalent—shortening the waveform of an oscillator makes us perceive its pitch to be higher.

# Step 18

<script>
    import Clr from '../Clr.svelte';
</script>

Now that we’ve added rhythm to the kick, you might notice it’s missing a bit of punch in its tone.

To give the kick that characteristic "thump," we’ll create a quick pitch drop at the start of each cycle. For this, we’ll use an <Clr nodeType="ad-envelope">AD Envelope</Clr>.

Create an <Clr nodeType="ad-envelope">AD Envelope</Clr> node.

# Step 19

<script>
    import Clr from '../Clr.svelte';
</script>

To make the <Clr nodeType="ad-envelope">AD Envelope</Clr> work, we need a trigger signal of some sort.

Previously, we used the <Clr nodeType="clock">Clock</Clr> node for that purpose.

However, now we want to keep the <Clr nodeType="ad-envelope">AD Envelope</Clr> completely in sync with the <Clr nodeType="saw-lfo">Saw LFO</Clr>.

So what can we do?

# Step 20

<script>
    import Clr from '../Clr.svelte';
</script>

We need a trigger, but a trigger is nothing more than a sudden change from `0` to `1`.

We can see that type of change in the signal of the <Clr nodeType="saw-lfo">Saw LFO</Clr>. At the beginning of each cycle, it jumps from 0 to 1 immediately.

So, does that mean we can simply use the <Clr nodeType="saw-lfo">Saw LFO</Clr> signal as a trigger source for the <Clr nodeType="ad-envelope">AD Envelope</Clr>?

Absolutely! Connect the output of the <Clr nodeType="saw-lfo">Saw LFO</Clr> to the **trigger** input of the <Clr nodeType="ad-envelope">AD Envelope</Clr> node.

# Step 21

<script>
    import Clr from '../Clr.svelte';
</script>

Let’s make sure that the <Clr nodeType="ad-envelope">AD Envelope</Clr> is working as expected.

First, disconnect the <Clr nodeType="saw-lfo">Saw LFO</Clr> from the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node.

Next, connect the output of the <Clr nodeType="ad-envelope">AD Envelope</Clr> to the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node.

# Step 22

<script>
    import Clr from '../Clr.svelte';
</script>

As you can see, the <Clr nodeType="ad-envelope">AD Envelope</Clr> is emitting its signal, just as we wanted.

Not only that, it is perfectly in sync with the <Clr nodeType="saw-lfo">Saw LFO</Clr>, since it is directly triggered by it.

# Step 23

<script>
    import Clr from '../Clr.svelte';
</script>

Now, connect the output of the <Clr nodeType="ad-envelope">AD Envelope</Clr> to the frequency parameter of the <Clr nodeType="triangle-oscillator">Triangle</Clr> node.

# Step 24

<script>
    import Clr from '../Clr.svelte';
</script>

At this point, you are probably not hearing much change in the sound yet. Why is that?

Remind yourself of the range in which the signal is emitted from the <Clr nodeType="ad-envelope">AD Envelope</Clr>.

# Step 25

<script>
    import Clr from '../Clr.svelte';
</script>

The <Clr nodeType="ad-envelope">AD Envelope</Clr> emits a signal in the range of `0` to `1`.

This means that when we modulate the frequency parameter on the <Clr nodeType="triangle-oscillator">Triangle</Clr> oscillator, set at 55 Hz, the frequency only varies between 55 Hz and 56 Hz - a change too small to be noticeable.

# Step 26

<script>
    import Clr from '../Clr.svelte';
</script>

To make the modulation more noticeable, we need to amplify the signal coming from the <Clr nodeType="ad-envelope">AD Envelope</Clr>.

We can do this by using a <Clr nodeType="times">× (Times)</Clr> node. This node multiplies two signals (streams of numbers) together.

Create a <Clr nodeType="times">×</Clr> node, to be found in the <Clr nodeType="times">Math</Clr> section.

# Step 27

<script>
    import Clr from '../Clr.svelte';
</script>

As you can see, the <Clr nodeType="times">×</Clr> node has two inputs - it expects two streams of numbers to multiply.

We want to multiply the <Clr nodeType="ad-envelope">AD Envelope</Clr>, but by how much?

To control that, we can use a <Clr nodeType="number">Number</Clr> node, which allows us to set a constant value.

Create a <Clr nodeType="number">Number</Clr> node and connect it to one of the inputs of the <Clr nodeType="times">×</Clr> node.

# Step 28

<script>
    import Clr from '../Clr.svelte';
</script>

Now let’s complete the setup.

Disconnect the output of the <Clr nodeType="ad-envelope">AD Envelope</Clr> from the <Clr nodeType="triangle-oscillator">Triangle</Clr> node.

Connect the output of the <Clr nodeType="ad-envelope">AD Envelope</Clr> to one of the inputs of the <Clr nodeType="times">×</Clr> node.

Connect the output of the <Clr nodeType="times">×</Clr> node to the frequency parameter of the <Clr nodeType="triangle-oscillator">Triangle</Clr> node.

# Step 29

<script>
    import Clr from '../Clr.svelte';
</script>

Now start increasing the value of the <Clr nodeType="number">Number</Clr> node and listen to changes in the sound.

At the end set the value on the knob to be exactly `250`.

# Step 30

<script>
    import Clr from '../Clr.svelte';
</script>

Now, slowly decrease the decay parameter on the <Clr nodeType="ad-envelope">AD Envelope</Clr> node and listen to how it affects the sound.

Set the decay parameter to `60 ms` at the end.

# Step 31

<script>
    import Clr from '../Clr.svelte';
</script>

At this point, we already have a punchy and solid kick sound.

Before we end the tutorial, let's make a little cleanup.

# Step 32

<script>
    import Clr from '../Clr.svelte';
</script>

We used the <Clr nodeType="times">×</Clr> and <Clr nodeType="number">Number</Clr> nodes in order to multiply the signal coming from the <Clr nodeType="ad-envelope">AD Envelope</Clr> node.

This task is so common in `AudioCanvas`, that there is a faster, easier way to do that.

Delete the <Clr nodeType="times">×</Clr> and <Clr nodeType="number">Number</Clr> nodes.

# Step 33

<script>
    import Clr from '../Clr.svelte';
</script>

Now, simply connect the output of the <Clr nodeType="ad-envelope">AD Envelope</Clr> directly to the frequency parameter of the <Clr nodeType="triangle-oscillator">Triangle</Clr> node.

# Step 34

<script>
    import Clr from '../Clr.svelte';
</script>

Now, simply connect the output of the <Clr nodeType="ad-envelope">AD Envelope</Clr> directly to the frequency parameter of the <Clr nodeType="triangle-oscillator">Triangle</Clr> node.

Click on the line you've just created.

A menu will appear, from which you can choose the "Mult" option.

Clicking on it will show a knob that allows you to set the multiplication of the signal, which is set to `1` by default.

Set it to `250`, just as we did before.

# Step 35

<script>
    import Clr from '../Clr.svelte';
</script>

You can hear that we've achieved the same effect, but with less clutter.

# Step 36

<script>
    import Clr from '../Clr.svelte';
</script>

And that's it!

In this tutorial, we've learned how to make a simple but punchy techno kick.

We used the fact that signals are completely interchangeable in `AudioCanvas` by:

Controlling the <Clr nodeType="gain">Gain</Clr> node with the <Clr nodeType="saw-lfo">Saw LFO</Clr> instead of the <Clr nodeType="ad-envelope">AD Envelope</Clr>.

Using the <Clr nodeType="ad-envelope">AD Envelope</Clr> to control the frequency of the <Clr nodeType="triangle-oscillator">Triangle Oscillator</Clr> instead.

Triggering the <Clr nodeType="ad-envelope">AD Envelope</Clr> with the <Clr nodeType="saw-lfo">Saw LFO</Clr> instead of a <Clr nodeType="clock">Clock</Clr>.
