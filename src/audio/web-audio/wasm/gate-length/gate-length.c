#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static double length;
static double inputBuffer[WEBEAUDIO_FRAME_SIZE];
static double outputBuffer[WEBEAUDIO_FRAME_SIZE];

static int triggerEvent[2] = { 0, 0 };
static double lastValueOfPreviousProcess = 0;

EMSCRIPTEN_KEEPALIVE
    double* lengthPtr() {
        return &length;
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
            if ((i == 0 && lastValueOfPreviousProcess == 0 && inputBuffer[0] == 1) || (i > 0 && inputBuffer[i] == 1 && inputBuffer[i-1] == 0)) {
                int lengthInSamples = (int)(length * sampleRate);

                triggerEvent[0] = currentFrame + i;
                triggerEvent[1] = currentFrame + i + lengthInSamples;
            }

            if (triggerEvent[0] <= (currentFrame + i) && (currentFrame + i) < triggerEvent[1]) {
                outputBuffer[i] = 1;
            } else {
                outputBuffer[i] = 0;
            }
        }

        lastValueOfPreviousProcess = inputBuffer[WEBEAUDIO_FRAME_SIZE - 1];
    }

// EMSCRIPTEN_KEEPALIVE
//     double debug() {
//         return (triggerEvent[1] - triggerEvent[0]) / (double)44100;
//     }