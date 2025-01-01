#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float frequency;

static float inputBuffer[WEBEAUDIO_FRAME_SIZE];
static float outputBuffer[WEBEAUDIO_FRAME_SIZE];

static int cycleStart = 0;
static int cycleLength = -1;

EMSCRIPTEN_KEEPALIVE
    float* frequencyPtr() {
        return &frequency;
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
        if (cycleLength == -1) {
            cycleLength = (int)(sampleRate / (float)frequency);
        }

        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            int currentSample = i + currentFrame;

            outputBuffer[i] = -1;

            if (cycleStart <= currentSample && currentSample <= cycleStart + cycleLength / 2) {
                outputBuffer[i] = 1;
            } else if (cycleStart + cycleLength < currentSample) {
                cycleStart = currentSample;
                cycleLength = (int)(sampleRate / (float)frequency);
            }
        }
    }

// EMSCRIPTEN_KEEPALIVE
//     float debug() {
//         return (float)cycleStart;
//     }