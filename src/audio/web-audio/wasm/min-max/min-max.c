#include <emscripten.h>
#include <math.h>

#define WEBEAUDIO_FRAME_SIZE 128

static double minMax[2];
double* min = &(minMax[0]);
double* max = &(minMax[1]);

static double inputBuffer[WEBEAUDIO_FRAME_SIZE];
static double outputBuffer[WEBEAUDIO_FRAME_SIZE];

EMSCRIPTEN_KEEPALIVE
    double* minMaxPtr() {
        return minMax;
    }
EMSCRIPTEN_KEEPALIVE
    double* inputBufferPtr() {
        return inputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    double* outputBufferPtr() {
        return outputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    void process(int currentFrame, int sampleRate) {
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            outputBuffer[i] = inputBuffer[i] < *min ? *min : (inputBuffer[i] > *max ? *max : inputBuffer[i]);
        }
    }

// EMSCRIPTEN_KEEPALIVE
//     double debug() {
//         return leftCurrentStep;
//     }