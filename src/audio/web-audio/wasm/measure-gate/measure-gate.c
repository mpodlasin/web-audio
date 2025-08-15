#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static double inputBuffer[WEBEAUDIO_FRAME_SIZE];
static double outputBuffer[WEBEAUDIO_FRAME_SIZE];

static double lastValueOfPreviousProcess = 0;
static int lastTriggerIndex = 0;
static int previousToLastTriggerIndex = 0;

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
                previousToLastTriggerIndex = lastTriggerIndex;
                lastTriggerIndex = i + currentFrame;
            }

            outputBuffer[i] = (lastTriggerIndex - previousToLastTriggerIndex) / (double)sampleRate;
        }

        lastValueOfPreviousProcess = inputBuffer[WEBEAUDIO_FRAME_SIZE - 1];
    }

// EMSCRIPTEN_KEEPALIVE
//     double debug() {
//         return (lastTriggerIndex - previousToLastTriggerIndex) / (double)48000;
//     }