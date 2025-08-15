#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static double fromTo[4];

static double* aFrom = &(fromTo[0]);
static double* aTo = &(fromTo[1]);
static double* bFrom = &(fromTo[2]);
static double* bTo = &(fromTo[3]);

static double inputBuffer[WEBEAUDIO_FRAME_SIZE];
static double outputBuffer[WEBEAUDIO_FRAME_SIZE];

EMSCRIPTEN_KEEPALIVE
    double* fromToPtr() {
        return fromTo;
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
            // ((value - aFromValue) / (bFromValue - aFromValue)) * (bToValue - aToValue) + aToValue;
            outputBuffer[i] = ((inputBuffer[i] - *aFrom) / (*bFrom - *aFrom)) * (*bTo - *aTo) + *aTo;
        }
    }

// EMSCRIPTEN_KEEPALIVE
//     double debug() {
//         return leftCurrentStep;
//     }