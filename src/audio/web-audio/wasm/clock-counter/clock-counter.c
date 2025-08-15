#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float moduloParameter;

static float inputBuffer[WEBEAUDIO_FRAME_SIZE];
static float outputBuffer[WEBEAUDIO_FRAME_SIZE];

static float lastValueOfPreviousProcess = 0;
static unsigned int count = 0;

EMSCRIPTEN_KEEPALIVE
    float* moduloParameterPtr() {
        return &moduloParameter;
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
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {

            if ((i == 0 && lastValueOfPreviousProcess == 0 && inputBuffer[0] == 1) || (i > 0 && inputBuffer[i] == 1 && inputBuffer[i-1] == 0)) {
                count = (count + 1) % (int)moduloParameter;
            }

            outputBuffer[i] = count;
        }

        lastValueOfPreviousProcess = inputBuffer[WEBEAUDIO_FRAME_SIZE - 1];
    }

// EMSCRIPTEN_KEEPALIVE
//     float debug() {
//         return count;
//     }