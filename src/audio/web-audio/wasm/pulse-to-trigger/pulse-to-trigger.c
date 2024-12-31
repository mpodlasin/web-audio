#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float inputBuffer[WEBEAUDIO_FRAME_SIZE];
static float outputBuffer[WEBEAUDIO_FRAME_SIZE];

EMSCRIPTEN_KEEPALIVE
    float* inputBufferPtr() {
        return inputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    float* outputBufferPtr() {
        return outputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    void process() {
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            float input = inputBuffer[i];

            if (input < 0) {
                outputBuffer[i] = 0;
            } else {
                outputBuffer[i] = 1;
            }
        }
    }