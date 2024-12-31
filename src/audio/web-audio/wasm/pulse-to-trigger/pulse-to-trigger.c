#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float leftInputBuffer[WEBEAUDIO_FRAME_SIZE];
static float leftOutputBuffer[WEBEAUDIO_FRAME_SIZE];

static float rightInputBuffer[WEBEAUDIO_FRAME_SIZE];
static float rightOutputBuffer[WEBEAUDIO_FRAME_SIZE];

EMSCRIPTEN_KEEPALIVE
    float* leftInputBufferPtr() {
        return leftInputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    float* leftOutputBufferPtr() {
        return leftOutputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    float* rightInputBufferPtr() {
        return rightInputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    float* rightOutputBufferPtr() {
        return rightOutputBuffer;
    }

    void processChannel(float inputBuffer[], float outputBuffer[]) {
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            float input = inputBuffer[i];

            if (input <= 0) {
                outputBuffer[i] = 0;
            } else {
                outputBuffer[i] = 1;
            }
        }
    }
EMSCRIPTEN_KEEPALIVE
    void process() {
        processChannel(rightInputBuffer, rightOutputBuffer);
        processChannel(leftInputBuffer, leftOutputBuffer);
    }