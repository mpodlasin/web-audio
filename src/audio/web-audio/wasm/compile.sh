emcc -O3 -s WASM=1 ./src/audio/web-audio/wasm/pulse-to-trigger/pulse-to-trigger.c -o ./src/audio/web-audio/wasm/pulse-to-trigger/pulse-to-trigger.wasm --no-entry
emcc -O3 -s WASM=1 ./src/audio/web-audio/wasm/measure-gate/measure-gate.c -o ./src/audio/web-audio/wasm/measure-gate/measure-gate.wasm --no-entry
emcc -O3 -s WASM=1 ./src/audio/web-audio/wasm/clock-counter/clock-counter.c -o ./src/audio/web-audio/wasm/clock-counter/clock-counter.wasm --no-entry
emcc -O3 -s WASM=1 ./src/audio/web-audio/wasm/pattern/pattern.c -o ./src/audio/web-audio/wasm/pattern/pattern.wasm --no-entry