#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float chosenInput;

static float inputBuffer[WEBEAUDIO_FRAME_SIZE];
static float outputBuffer[WEBEAUDIO_FRAME_SIZE];

static float lastValueOfPreviousProcess = 0;
static unsigned int currentStep = -1;

EMSCRIPTEN_KEEPALIVE
    float* chosenInputPtr() {
        return &chosenInput;
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
        }
    }

// EMSCRIPTEN_KEEPALIVE
//     float debug() {
//         return currentStep;
//     }