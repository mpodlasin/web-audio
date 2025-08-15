#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float fromTo[4];

static float* aFrom = &(fromTo[0]);
static float* aTo = &(fromTo[1]);
static float* bFrom = &(fromTo[2]);
static float* bTo = &(fromTo[3]);

static float inputBuffer[WEBEAUDIO_FRAME_SIZE];
static float outputBuffer[WEBEAUDIO_FRAME_SIZE];

EMSCRIPTEN_KEEPALIVE
    float* fromToPtr() {
        return fromTo;
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
            // ((value - aFromValue) / (bFromValue - aFromValue)) * (bToValue - aToValue) + aToValue;
            outputBuffer[i] = ((inputBuffer[i] - *aFrom) / (*bFrom - *aFrom)) * (*bTo - *aTo) + *aTo;
        }
    }

// EMSCRIPTEN_KEEPALIVE
//     float debug() {
//         return leftCurrentStep;
//     }