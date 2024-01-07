# Docs

## Introduction

Hi! Welcome to AudioCanvas.

AudioCanvas is a browser-based environment for sound synthesis and manipulation.

It is a set of small, simple devices, like oscillators, filters, effects and others, which you can connect in any way you'd like, allowing for fast and easy musical experimentation.

## Overview

### Types Of Signals

AudioCanvas does not have a built-in concept of a signal type. This means that you can connect any input to any output or knob, even if (on first glance!) it doesn't make much sense.

On top of that, in AudioCanvas every signal is an "audio-rate" signal. This means that an envelope signal that is triggered fast enough can become an oscillator. Meanwhile an oscillator that runs slowly enough, can be used as LFO, and so on.

That being said, signals can be loosely grouped into few categories.

We will list them here and say some more about their characteristics and gotcha's involved in working with them.

#### Audio signals

It's not a surprise that an audio signal is the most important, but also the most obvious to list here.

We (loosely) define audio signal as basically any signal that ranges from -1 to 1.

Note that this is a very broad definition, and doesn't necessarily correlate to an intuitive understanding of what an audio signal is. Not only that, many signals listed below also fall into that definition, even though they are their own, separate categories.

#### Trigger signals

Trigger signals are defined as signals that can have only two values - 0 and 1 (and nothing inbetween!).

1 means that the signal is "on", while 0 means that the signal is "off".

#### Frequency signals

#### Envelope signals

#### Other

## Devices

### Oscillators

### LFOs

### Filters
