#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128
#define NUMBER_OF_STEPS 8

static float steps[NUMBER_OF_STEPS];

static float leftInputBuffer[WEBEAUDIO_FRAME_SIZE];
static float leftOutputBuffer[WEBEAUDIO_FRAME_SIZE];

static float rightInputBuffer[WEBEAUDIO_FRAME_SIZE];
static float rightOutputBuffer[WEBEAUDIO_FRAME_SIZE];

static float leftLastValueOfPreviousProcess = 0;
static unsigned int leftCurrentStep = -1;

static float rightLastValueOfPreviousProcess = 0;
static unsigned int rightCurrentStep = -1;

EMSCRIPTEN_KEEPALIVE
    float* stepsPtr() {
        return steps;
    }
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
        unsigned int* currentStep,
        float* lastValueOfPreviousProcess
    ) {
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {

            if ((i == 0 && lastValueOfPreviousProcess == 0 && inputBuffer[0] == 1) || (i > 0 && inputBuffer[i] == 1 && inputBuffer[i-1] == 0)) {
                *currentStep = (*currentStep + 1) % NUMBER_OF_STEPS;

                outputBuffer[i] = steps[*currentStep];
            } else {
                outputBuffer[i] = 0;
            }
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
            &leftCurrentStep,
            &leftLastValueOfPreviousProcess,
        );
        processChannel(
            rightInputBuffer, 
            rightOutputBuffer, 
            currentFrame, 
            sampleRate, 
            &rightCurrentStep,
            &rightLastValueOfPreviousProcess,
        );
    }

// EMSCRIPTEN_KEEPALIVE
//     float debug() {
//         return leftCurrentStep;
//     }