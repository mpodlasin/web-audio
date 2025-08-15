#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static double chosenChannel;

static double inputBufferA[WEBEAUDIO_FRAME_SIZE];
static double inputBufferB[WEBEAUDIO_FRAME_SIZE];
static double inputBufferC[WEBEAUDIO_FRAME_SIZE];
static double inputBufferD[WEBEAUDIO_FRAME_SIZE];
static double outputBuffer[WEBEAUDIO_FRAME_SIZE];

EMSCRIPTEN_KEEPALIVE
double* chosenChannelPtr() {
    return &chosenChannel;
}

EMSCRIPTEN_KEEPALIVE
double* inputBufferPtrA() {
    return inputBufferA;
}

EMSCRIPTEN_KEEPALIVE
double* inputBufferPtrB() {
    return inputBufferB;
}

EMSCRIPTEN_KEEPALIVE
double* inputBufferPtrC() {
    return inputBufferC;
}

EMSCRIPTEN_KEEPALIVE
double* inputBufferPtrD() {
    return inputBufferD;
}

EMSCRIPTEN_KEEPALIVE
double* outputBufferPtr() {
    return outputBuffer;
}

EMSCRIPTEN_KEEPALIVE
void process(int currentFrame, int sampleRate) {
    int selectedChannel = (int)(chosenChannel + 0.5);
    if (selectedChannel < 0) selectedChannel = 0;
    if (selectedChannel > 3) selectedChannel = 3;
    
    double* selectedBuffer;
    switch (selectedChannel) {
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
// double debug() {
//     return chosenChannel;
// }
