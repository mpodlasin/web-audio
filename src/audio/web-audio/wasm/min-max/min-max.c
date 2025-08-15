#include <emscripten.h>
#include <math.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float minMax[2];
float* min = &(minMax[0]);
float* max = &(minMax[1]);

static float inputBuffer[WEBEAUDIO_FRAME_SIZE];
static float outputBuffer[WEBEAUDIO_FRAME_SIZE];

EMSCRIPTEN_KEEPALIVE
    float* minMaxPtr() {
        return minMax;
    }
EMSCRIPTEN_KEEPALIVE
    float* inputBufferPtr() {
        return inputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    float* outputBufferPtr() {
        return outputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    void process(int currentFrame, int sampleRate) {
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            outputBuffer[i] = inputBuffer[i] < *min ? *min : (inputBuffer[i] > *max ? *max : inputBuffer[i]);
        }
    }

// EMSCRIPTEN_KEEPALIVE
//     float debug() {
//         return leftCurrentStep;
//     }