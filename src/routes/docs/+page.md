<script>
 	import { loadCustomNodes } from '../../audio/web-audio/utils';
	import AudioCanvas from '../../components/AudioCanvas.svelte';

	import { introductionExample } from '../../examples/introduction';

	loadCustomNodes();
</script>

# Docs

## Introduction

Hi! Welcome to AudioCanvas.

AudioCanvas is a browser-based environment for sound synthesis and manipulation.

It is basically a set of small, simple devices, like oscillators, filters, effects and others, which you can connect in any way you'd like, allowing for fast and easy musical experimentation.

Here is a simple example. Simply press play and listen to the results:

<AudioCanvas projectNames={[]} chosenProjectName="Introductory Example" project={{audioCanvas: introductionExample}} />

This window is fairly small, so click on fullscreen button in order to better see what is happening here.

This example is fully interactive, both in fullscreen and window form.

You can also drag the canvas around, simply by clicking and dragging with mouse anywhere on the screen.

If this example seems daunting, don't worry! We have prepared an [online resource](/learn) that will teach you AudioCanvas and basics of electronic music, even if you don't have any previous experience with those topics!

If you have however some experience with music patching environments or electronic music in general, this document is probably better suited for you.

## Overview

### Types Of Signals

## Devices
