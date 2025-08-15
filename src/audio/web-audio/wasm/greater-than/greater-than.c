#include <emscripten.h>
#include <math.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float frequency;

static float leftInputBuffer[WEBEAUDIO_FRAME_SIZE];
static float rightInputBuffer[WEBEAUDIO_FRAME_SIZE];
static float outputBuffer[WEBEAUDIO_FRAME_SIZE];

static double phase = 0;

EMSCRIPTEN_KEEPALIVE
    float* frequencyPtr() {
        return &frequency;
    }
EMSCRIPTEN_KEEPALIVE
    float* leftInputBufferPtr() {
        return leftInputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    float* rightInputBufferPtr() {
        return rightInputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    float* outputBufferPtr() {
        return outputBuffer;
    }

EMSCRIPTEN_KEEPALIVE
    void process(int currentFrame, int sampleRate) {
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            outputBuffer[i] = leftInputBuffer[i] > rightInputBuffer[i];
        }
    }

// EMSCRIPTEN_KEEPALIVE
//     float debug() {
//         return (float)cycleStart;
//     }