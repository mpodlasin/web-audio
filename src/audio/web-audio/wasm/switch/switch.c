#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float chosenInput;

static float inputBufferA[WEBEAUDIO_FRAME_SIZE];
static float inputBufferB[WEBEAUDIO_FRAME_SIZE];
static float inputBufferC[WEBEAUDIO_FRAME_SIZE];
static float inputBufferD[WEBEAUDIO_FRAME_SIZE];
static float outputBuffer[WEBEAUDIO_FRAME_SIZE];

EMSCRIPTEN_KEEPALIVE
float* chosenInputPtr() {
    return &chosenInput;
}

EMSCRIPTEN_KEEPALIVE
float* inputBufferPtrA() {
    return inputBufferA;
}

EMSCRIPTEN_KEEPALIVE
float* inputBufferPtrB() {
    return inputBufferB;
}

EMSCRIPTEN_KEEPALIVE
float* inputBufferPtrC() {
    return inputBufferC;
}

EMSCRIPTEN_KEEPALIVE
float* inputBufferPtrD() {
    return inputBufferD;
}

EMSCRIPTEN_KEEPALIVE
float* outputBufferPtr() {
    return outputBuffer;
}

EMSCRIPTEN_KEEPALIVE
void process(int currentFrame, int sampleRate) {
    int selectedInput = (int)(chosenInput + 0.5);
    if (selectedInput < 0) selectedInput = 0;
    if (selectedInput > 3) selectedInput = 3;
    
    float* selectedBuffer;
    switch (selectedInput) {
        case 0:
            selectedBuffer = inputBufferA;
            break;
        case 1:
            selectedBuffer = inputBufferB;
            break;
        case 2:
            selectedBuffer = inputBufferC;
            break;
        case 3:
            selectedBuffer = inputBufferD;
            break;
        default:
            selectedBuffer = inputBufferA; // Default to first input
    }
    
    for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
        outputBuffer[i] = selectedBuffer[i];
    }
}

// EMSCRIPTEN_KEEPALIVE
// float debug() {
//     return chosenInput;
// }
