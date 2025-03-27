# Step 1

Welcome in the second chapter of the `AudioCanvas` electronic music tutorial.

In the previous chapter we learned how to create nodes and how to connect them in order to achieve musical results.

Today we will focus more on those connections themselves.

Nodes connected with a line exchange information between eachother - a signal. But what exactly is that signal?

Learning this will help us understand how exactly `AudioCanvas` works and how audio is processed on computers in general.

Let's begin!

# Step 2

<script>
    import Clr from '../Clr.svelte';
</script>

The easiest way to learn what is happening under the hood of `AudioCanvas` is with the two following nodes:

The <Clr nodeType="number">Number</Clr> node which simply emits a number that is set on its knob. You can find the <Clr nodeType="number">Number</Clr> node in the <Clr nodeType="number">Math</Clr> section.

The <Clr nodeType="value">Value</Clr> node which displays whatever signal is being sent to it via its input. You can find the <Clr nodeType="value">Value</Clr> node in the <Clr nodeType="value">Visualisation</Clr> section.

Create both of those nodes and connect them together.

# Step 3

<script>
    import Clr from '../Clr.svelte';
</script>

Before we do anything else, we need to press the play button above.

That's because it starts and stops not only the audio being played, but also any signals flowing between nodes.

After you do that, move around the knob on <Clr nodeType="number">Number</Clr> node and note how it affects the <Clr nodeType="value">Value</Clr> node.

# Step 4

<script>
    import Clr from '../Clr.svelte';
</script>

It's probably quite easy to conceptualize what is happening here.

<Clr nodeType="number">Number</Clr> node emits a number. This number then travels via the line connecting the nodes and ends up displayed by <Clr nodeType="value">Value</Clr> node.

You may think that a new number is sent only when the value knob on the <Clr nodeType="number">Number</Clr> node is being moved. However that's not true.

In fact numbers are being constantly transmitted between the nodes right now - even if it's the same number all the time.

Most likely your device processes audio with the frequency of 44100 Hz. This means that every second 44100 numbers are being sent from <Clr nodeType="number">Number</Clr> to <Clr nodeType="value">Value</Clr> node!

Let's now use another tool from <Clr nodeType="oscilloscope">Visualization</Clr> category - <Clr nodeType="oscilloscope">Oscilloscope</Clr> - which will further alow us to see what is going on.

Create <Clr nodeType="oscilloscope">Oscilloscope</Clr> and connect <Clr nodeType="number">Number</Clr> node to it.

# Step 5

<script>
    import Clr from '../Clr.svelte';
</script>

<Clr nodeType="oscilloscope">Oscilloscope</Clr> draws a graph of the incoming signal.

It expects numbers between -1 and 1.

Play around with the knob on <Clr nodeType="number">Number</Clr> node a bit more, while keeping it between -1 and 1 and try to get a feel of how the <Clr nodeType="oscilloscope">Oscilloscope</Clr> works.

At the end, leave the knob somewhere between -1 and 1.

# Step 6

<script>
    import Clr from '../Clr.svelte';
</script>

Horizonstal axis of the <Clr nodeType="oscilloscope">Oscilloscope</Clr> window represents time. As you were moving the mouse, you could see the whole graph moving to the left.

Vertical axis represents the value of the number sent to the input of the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node.

If the number sent is between 0 and 1, we see it drawn in the upper half of the window

If the number sent is between -1 and 0, we see it drawn at the bottom.

If the number is 0, we see it exactly in the middle of the window.

Convince yourself that it the last sentence is true by setting value on <Clr nodeType="number">Number</Clr> node to 0.

_(You can do it by hand or by double clicking on the parameter knob, which will reset it to its default value.)_

# Step 7

<script>
    import Clr from '../Clr.svelte';
</script>

Since <Clr nodeType="oscilloscope">Oscilloscope</Clr> shows now constantly the same number - number 0 - it gives an impression that it is not moving.

But it _does_ move to the left all the time, just as it did when we were moving the knob on the <Clr nodeType="number">Number</Clr> node.

You can validate that by nudging <Clr nodeType="number">Number</Clr> knob slightly and immediately moving back to 0.

That is what we meant previously about nodes exchanging numbers constantly - even if this is the same number.s

If the play button is on, <Clr nodeType="number">Number</Clr> node is constantly sending numbers (currently zeros) to the <Clr nodeType="oscilloscope">Oscilloscope</Clr> and <Clr nodeType="value">Value</Clr> nodes.

# Step 8

<script>
    import Clr from '../Clr.svelte';
</script>

Things have been fairly obvious so far when working with a <Clr nodeType="number">Number</Clr> node.

But what whould happen if we replaced it with a <Clr nodeType="sine-oscillator">Sine</Clr> node, that we used in the previous tutorial to generate sound?

Let's check!

Start by deleting the <Clr nodeType="number">Number</Clr> node.

You can do that by clicking on it once and choosing "Delete" from the menu that will appear.

# Step 9

<script>
    import Clr from '../Clr.svelte';
</script>

Now create a <Clr nodeType="sine-oscillator">Sine</Clr> node and connect it to both <Clr nodeType="value">Value</Clr> and <Clr nodeType="oscilloscope">Oscilloscope</Clr> nodes.

# Step 10

<script>
    import Clr from '../Clr.svelte';
</script>

Don't trust the output of the <Clr nodeType="oscilloscope">Oscilloscope</Clr> just yet. It is not reliable for fast changing signals.

Note also the <Clr nodeType="value">Value</Clr> node - the numbers displayed there change too fast to see any patterns.

Let's slow down the <Clr nodeType="sine-oscillator">Sine</Clr> oscillator _a lot_.

Reduce the frequency parameter until it's is below 0.10 Hz, like 0.09 or 0.08.

# Step 11

<script>
    import Clr from '../Clr.svelte';
</script>

It is now much easier to see what is going on.

Look at the <Clr nodeType="value">Value</Clr> node first.

You can see that the numbers displayed there move gradually between -1 and 1.

This is further confirmed by the <Clr nodeType="oscilloscope">Oscilloscope</Clr> which graphs how this change occurs.

# Step 12

<script>
    import Clr from '../Clr.svelte';
</script>

This shows us that the <Clr nodeType="number">Number</Clr> node, which simply emits numbers, and the <Clr nodeType="sine-oscillator">Sine</Clr> node, which outputs audio signal, aren't that different from eachother after all.

That's because on the computer, an audio signal is stored and processed as precisely what we've seen - a stream of numbers.

Usually those numbers are in the -1 and 1 range, as it is the case here.

# Step 13

<script>
    import Clr from '../Clr.svelte';
</script>

In future tutorials we will explain in more detail how the stream of numbers represents a sound.

For now it is only important to note that _all_ signals flowing in `AudioCanvas` - so all signals flowing in cables connecting nodes - are simply of numbers, no matter what they represent.

We will now keep driving this point home, by investigating other nodes and that we used in the previous tutorial and their outputs.

Let's start by deleting the <Clr nodeType="sine-oscillator">Sine</Clr> node.

# Step 14

<script>
    import Clr from '../Clr.svelte';
</script>

Create a <Clr nodeType="clock">Clock</Clr> node and connect it to both <Clr nodeType="value">Value</Clr> and <Clr nodeType="oscilloscope">Oscilloscope</Clr> nodes.

Now reduce the tempo parameter to be _exactly_ 15 BPM.

Most likely you won't be able to do it by dragging the knob with your mouse.

You can however click on the value (120 BPM) displayed under the knob, enter the value with the keyboard and then press enter.

Setting the <Clr nodeType="clock">Clock</Clr> node to 15 BPM means that the clock will "tick" exactly once per second.

# Step 15

<script>
    import Clr from '../Clr.svelte';
</script>

Most of the time <Clr nodeType="clock">Clock</Clr> emits the number 0.

You can tell that's true by looking at the <Clr nodeType="value">Value</Clr> node.

Also, if you'll look at the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node you will see that most of the time the graph is located in the middle of the window.

# Step 16

<script>
    import Clr from '../Clr.svelte';
</script>

Every second however, the <Clr nodeType="clock">Clock</Clr> node emits the number 1 for an extremely brief moment.

This moment is so brief that you _might_ see only a brief flicker when looking at the number displayed by the <Clr nodeType="value">Value</Clr> node.

This moment is also so brief that, depending on the device you are using, the <Clr nodeType="oscilloscope">Oscilloscope</Clr> may not even catch it!

If it does, it shows a vertical line, signifying sudden jump to the value 1.

# Step 17

<script>
    import Clr from '../Clr.svelte';
</script>

Since <Clr nodeType="oscilloscope">Oscilloscope</Clr> is not 100% reliable with such short signals, we would like to prolong the tick moment of the <Clr nodeType="clock">Clock</Clr> node.

We would like to have a node that detects the moment the signal from the <Clr nodeType="clock">Clock</Clr> changes from 0 to 1 and then outputs number 1 for as long as we tell it to.

That is precisely what <Clr nodeType="gate-length">Gate Length</Clr> node is doing. You will find it in the <Clr nodeType="clock">Clock</Clr> section of the node creation menu.

Create <Clr nodeType="gate-length">Gate Length</Clr> node.

# Step 18

<script>
    import Clr from '../Clr.svelte';
</script>

We want to insert <Clr nodeType="gate-length">Gate Length</Clr> between <Clr nodeType="clock">Clock</Clr> and the two other nodes.

In order to do that, delete all the connections we have so far.

Next, connect <Clr nodeType="clock">Clock</Clr> to <Clr nodeType="gate-length">Gate Length</Clr>.

Then, connect <Clr nodeType="gate-length">Gate Length</Clr> to both <Clr nodeType="value">Value</Clr> and <Clr nodeType="oscilloscope">Oscilloscope</Clr> nodes.

# Step 19

<script>
    import Clr from '../Clr.svelte';
</script>

Now we see that the <Clr nodeType="value">Value</Clr> node displays the number 1 constantly.

Graph on the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node is always in its "up" position.

This makes sense, since we said that <Clr nodeType="gate-length">Gate Length</Clr> will prolong the time that the number 1 is emitted by the clock.

Since the <Clr nodeType="clock">Clock</Clr> node emits number 1 every second and <Clr nodeType="gate-length">Gate Length</Clr> stretches that time to 1 second also, in effect we see number 1 being emitted constantly.

# Step 20

<script>
    import Clr from '../Clr.svelte';
</script>

Now lets slowly decrease the length parameter on the <Clr nodeType="gate-length">Gate Length</Clr> node, while observing the graph on the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node.

Decrease the parameter until it reaches exactly 0.25 seconds.

# Step 21

<script>
    import Clr from '../Clr.svelte';
</script>

As you decreased the knob, you saw how the graph displayed in the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node was in the "up" position for shorter and shorter periods of time.

Now, in each cycle, graph is up for 1/4th of the period and in the middle for 3/4th of the period - that's because we've set <Clr nodeType="gate-length">Gate Length</Clr> parameter to quarter of a second.

# Step 22

<script>
    import Clr from '../Clr.svelte';
</script>

As we now see, both <Clr nodeType="clock">Clock</Clr> and <Clr nodeType="gate-length">Gate Length</Clr> nodes can only emit one of two numbers - 0 or 1.

You can think of the 0 representing the "off" state, while 1 representing the "on" state.

Another way to think about it is in terms of pressing the key on the piano.

In that case, 1 would signify a key being pressed, while 0 would mean that the key is not pressed at the moment.

# Step 23

<script>
    import Clr from '../Clr.svelte';
</script>

The state where number 1 is being emitted is called a _gate_ and overall this kind of binary, on/off signal is called a gate signal.

So we can say that <Clr nodeType="gate-length">Gate Length</Clr> node emits gates of specified length.

On the other hand, if the length of the gate is irrelevant, or if the gate is extremely short, we call it a _trigger_ signal, since it is usually used to trigger some action.

So we can say that <Clr nodeType="clock">Clock</Clr> node emits triggers.

# Step 24

<script>
    import Clr from '../Clr.svelte';
</script>

So far we've seen 4 types of signals:

- <Clr nodeType="number">Number</Clr> node emitting numbers;
- <Clr nodeType="sine-oscillator">Sine</Clr> node emitting audio;
- <Clr nodeType="clock">Clock</Clr> emitting triggers;
- <Clr nodeType="gate-length">Gate Length</Clr> emitting gates.

Even though those nodes differ in function so much, all of them in the end simply emit streams of numbers:

- <Clr nodeType="number">Number</Clr> emits arbitrary numbers;
- <Clr nodeType="sine-oscillator">Sine</Clr> emits numbers in range -1 to 1;
- <Clr nodeType="clock">Clock</Clr> and <Clr nodeType="gate-length">Gate Length</Clr> nodes both emit only either 0 or 1, with nothing inbetween.

# Step 25

<script>
    import Clr from '../Clr.svelte';
</script>

Let's show yet another example of a signal type and prove that it also consists simply of numbers.

In the previous tutorial we used an <Clr nodeType="ad-envelope">AD Envelope</Clr> node in order to control the volume of the sound to give it a guitar-like "pluck" sound.

Remove the <Clr nodeType="gate-length">Gate Length</Clr> node, but keep the <Clr nodeType="clock">Clock</Clr> node.

Next, create <Clr nodeType="ad-envelope">AD Envelope</Clr> node.

# Step 26

<script>
    import Clr from '../Clr.svelte';
</script>

<Clr nodeType="ad-envelope">AD Envelope</Clr> node needs a trigger signal in order to function, that's why we have left the <Clr nodeType="clock">Clock</Clr> node.

Connect <Clr nodeType="clock">Clock</Clr> node to <Clr nodeType="ad-envelope">AD Envelope</Clr>.

Then connect <Clr nodeType="ad-envelope">AD Envelope</Clr> to <Clr nodeType="value">Value</Clr> and <Clr nodeType="oscilloscope">Oscilloscope</Clr> nodes.

# Step 27

<script>
    import Clr from '../Clr.svelte';
</script>

Now set the decay paramter of the <Clr nodeType="ad-envelope">AD Envelope</Clr> node to exactly 500ms.

_(Again, remember that you can just type it in, instead of dialing the value using the knob.)_

# Step 28

<script>
    import Clr from '../Clr.svelte';
</script>

We said that <Clr nodeType="ad-envelope">AD Envelope</Clr> emulates plucking a guitar string.

When the pluck happens, at the beginning the sound is the loudest and then it gradually becomes quieter and quieter.

That's exactly what we are seeing on the <Clr nodeType="oscilloscope">Oscilloscope</Clr>, where numbers emitted from <Clr nodeType="ad-envelope">AD Envelope</Clr> suddenly jump to 1 and then gradually decrease until they reach 0, over the span of half a second.

This happens in reaction to trigger signal from the <Clr nodeType="clock">Clock</Clr> node, which happens every second.

# Step 29

<script>
    import Clr from '../Clr.svelte';
</script>

Now increase the attack parameter of <Clr nodeType="ad-envelope">AD Envelope</Clr> node to also equal 500ms.

# Step 30

<script>
    import Clr from '../Clr.svelte';
</script>

We see on the <Clr nodeType="oscilloscope">Oscilloscope</Clr> node that the shape of the envelope changed.

Now the attack phase of the envelope is more of a buildup rather than immediate jump to value 1.

That being said we see that the range of numbers emitted from the <Clr nodeType="ad-envelope">AD Envelope</Clr> is unchanged. Meaning that we are still dealing with numbers from 0 to 1.

# Step 31

<script>
    import Clr from '../Clr.svelte';
</script>

In general an _envelope_ is a signal that is supposed to represent change of loudness of a sound.

We see however that in `AudioCanvas` an envelope signal is nothing more than stream of numbers, as it is the case with all other signals.

That means that we can - and will! - use `AudioCanvas` envelopes to control other aspects of sound - like tembre or pitch.

In general we will loosely define an envelope signal as a signal in range from 0 to 1.

# Step 32

<script>
    import Clr from '../Clr.svelte';
</script>

To summarise, in this tutorial we learned of several different types of signals.

We also learned that all those signals are simply represented as streams of numbers. This is true both for `AudioCanvas` and for computer music in general.

Let's list all of signal types we learnt so far, with examples of related nodes and how they are represented in numbers.

| Signal type   | Nodes                                                                            | Numbers           |
| ------------- | -------------------------------------------------------------------------------- | ----------------- |
| number        | <Clr nodeType="number">Number</Clr>                                              | arbitrary numbers |
| audio         | <Clr nodeType="sine-oscillator">Sine</Clr>                                       | in range -1 to 1  |
| gate, trigger | <Clr nodeType="clock">Clock</Clr>, <Clr nodeType="gate-length">Gate Length</Clr> | either 0 or 1     |
| envelope      | <Clr nodeType="ad-envelope">AD Envelope</Clr>                                    | in range 0 to 1   |

