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
