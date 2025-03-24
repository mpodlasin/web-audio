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
    int selectedInput = (int)(chosenInput + 0.5) - 1; // for some reason web audio api gives us number + 1;
    if (selectedInput < 1) selectedInput = 1;
    if (selectedInput > 4) selectedInput = 4;
    
    float* selectedBuffer;
    switch (selectedInput) {
        case 1:
            selectedBuffer = inputBufferA;
            break;
        case 2:
            selectedBuffer = inputBufferB;
            break;
        case 3:
            selectedBuffer = inputBufferC;
            break;
        case 4:
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
