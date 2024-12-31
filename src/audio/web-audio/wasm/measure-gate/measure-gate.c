#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float leftInputBuffer[WEBEAUDIO_FRAME_SIZE];
static float leftOutputBuffer[WEBEAUDIO_FRAME_SIZE];

static float rightInputBuffer[WEBEAUDIO_FRAME_SIZE];
static float rightOutputBuffer[WEBEAUDIO_FRAME_SIZE];

static float leftLastValueOfPreviousProcess = 0;
static int leftLastTriggerIndex = 0;
static int leftPreviousToLastTriggerIndex = 0;

static float rightLastValueOfPreviousProcess = 0;
static int rightLastTriggerIndex = 0;
static int rightPreviousToLastTriggerIndex = 0;

EMSCRIPTEN_KEEPALIVE
    float* leftInputBufferPtr() {
        return leftInputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    float* leftOutputBufferPtr() {
        return leftOutputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    float* rightInputBufferPtr() {
        return rightInputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    float* rightOutputBufferPtr() {
        return rightOutputBuffer;
    }

    void processChannel(
        float inputBuffer[], 
        float outputBuffer[], 
        int currentFrame, 
        int sampleRate, 
        int* previousToLastTriggerIndex,
        int* lastTriggerIndex,
        float* lastValueOfPreviousProcess
    ) {
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {

            if ((i == 0 && lastValueOfPreviousProcess == 0 && inputBuffer[0] == 1) || (i > 0 && inputBuffer[i] == 1 && inputBuffer[i-1] == 0)) {
                *previousToLastTriggerIndex = *lastTriggerIndex;
                *lastTriggerIndex = i + currentFrame;
            }

            outputBuffer[i] = (*lastTriggerIndex - *previousToLastTriggerIndex) / (float)sampleRate;
        }

        *lastValueOfPreviousProcess = inputBuffer[WEBEAUDIO_FRAME_SIZE - 1];
    }
EMSCRIPTEN_KEEPALIVE
    void process(int currentFrame, int sampleRate) {
        processChannel(
            leftInputBuffer, 
            leftOutputBuffer, 
            currentFrame, 
            sampleRate, 
            &leftPreviousToLastTriggerIndex, 
            &leftLastTriggerIndex,
            &leftLastValueOfPreviousProcess,
        );
        processChannel(
            rightInputBuffer, 
            rightOutputBuffer, 
            currentFrame, 
            sampleRate, 
            &rightPreviousToLastTriggerIndex, 
            &rightLastTriggerIndex,
            &rightLastValueOfPreviousProcess,
        );
    }

// EMSCRIPTEN_KEEPALIVE
//     float debug() {
//         return (lastTriggerIndex - previousToLastTriggerIndex) / (float)48000;
//     }