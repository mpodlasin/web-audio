#include <emscripten.h>
#include <math.h>

#define WEBEAUDIO_FRAME_SIZE 128

static double frequency;

static double leftInputBuffer[WEBEAUDIO_FRAME_SIZE];
static double rightInputBuffer[WEBEAUDIO_FRAME_SIZE];
static double outputBuffer[WEBEAUDIO_FRAME_SIZE];

static double phase = 0;

EMSCRIPTEN_KEEPALIVE
    double* frequencyPtr() {
        return &frequency;
    }
EMSCRIPTEN_KEEPALIVE
    double* leftInputBufferPtr() {
        return leftInputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    double* rightInputBufferPtr() {
        return rightInputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    double* outputBufferPtr() {
        return outputBuffer;
    }

EMSCRIPTEN_KEEPALIVE
    void process(int currentFrame, int sampleRate) {
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            outputBuffer[i] = leftInputBuffer[i] > rightInputBuffer[i];
        }
    }

// EMSCRIPTEN_KEEPALIVE
//     double debug() {
//         return (double)cycleStart;
//     }