So far we've seen 4 types of signals:

- `Number` node emitting numbers
- `Sine` node emitting audio
- `Clock` emitting triggers
- `Gate Length` emitting gates

Even though those nodes differ in function so much, all of them in the end simply emit streams of numbers.

- `Number` emits arbitrary numbers
- `Sine` emits numbers in range -1 to 1
- `Clock` and `Gate Length` nodes both emit only numbers 0 and 1
