#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float leftInputBuffer[WEBEAUDIO_FRAME_SIZE];
static float leftOutputBuffer[WEBEAUDIO_FRAME_SIZE];

static float rightInputBuffer[WEBEAUDIO_FRAME_SIZE];
static float rightOutputBuffer[WEBEAUDIO_FRAME_SIZE];

static float triggers[WEBEAUDIO_FRAME_SIZE];

static float lastValueOfPreviousProcess = 0;

static int lastTriggerIndex = 0;
static int previousToLastTriggerIndex = 0;

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

    void cleanTriggers() {
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            triggers[i] = -1;
        }
    }

    void detectTriggers(float inputBuffer[]) {
        cleanTriggers();

        int triggersIndex = 1;

        if (lastValueOfPreviousProcess == 0 && inputBuffer[0] == 1) {
            triggers[0] = 0;
        }

        for (int i = 1; i < WEBEAUDIO_FRAME_SIZE; i++) {
            if (inputBuffer[i] == 1 && inputBuffer[i - 1] == 0) {
                triggers[triggersIndex] = i;
                triggersIndex++;
            }
        }

        lastValueOfPreviousProcess = inputBuffer[WEBEAUDIO_FRAME_SIZE - 1];
    }

    void processChannel(float inputBuffer[], float outputBuffer[], int currentFrame, int sampleRate) {
        detectTriggers(inputBuffer);

        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            for (int t = 0; t < WEBEAUDIO_FRAME_SIZE; t++) {
                if (triggers[t] == i) {
                    previousToLastTriggerIndex = lastTriggerIndex;
                    lastTriggerIndex = i + currentFrame;
                }

                outputBuffer[i] = (lastTriggerIndex - previousToLastTriggerIndex) / sampleRate;
            }
        }
    }
EMSCRIPTEN_KEEPALIVE
    void process(int currentFrame, int sampleRate) {
        processChannel(rightInputBuffer, rightOutputBuffer, currentFrame, sampleRate);
        processChannel(leftInputBuffer, leftOutputBuffer, currentFrame, sampleRate);
    }