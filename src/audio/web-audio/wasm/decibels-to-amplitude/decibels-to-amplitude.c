#include <emscripten.h>
#include <math.h>

#define WEBEAUDIO_FRAME_SIZE 128

static double inputBuffer[WEBEAUDIO_FRAME_SIZE];
static double outputBuffer[WEBEAUDIO_FRAME_SIZE];

double output;

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
            outputBuffer[i] = pow(10, inputBuffer[i] / (double)20);
        }
        output = inputBuffer[0];
    }

EMSCRIPTEN_KEEPALIVE
    double debug() {
        return output;
    }