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

<AudioCanvas projectNames={[]} chosenProjectName="dupa" project={{audioCanvas: introductionExample}} />

Because AudioCanvas is entirely web based, it allows you to have fun with making electronic music without installing anything. This makes it great for educational purposes.

## Overview

### Types Of Signals

## Devices
