#include <emscripten.h>
#include <math.h>

#define WEBEAUDIO_FRAME_SIZE 128

static double frequency;

static double inputBuffer[WEBEAUDIO_FRAME_SIZE];
static double outputBuffer[WEBEAUDIO_FRAME_SIZE];

static double phase = 0;

EMSCRIPTEN_KEEPALIVE
    double* frequencyPtr() {
        return &frequency;
    }
EMSCRIPTEN_KEEPALIVE
    double* inputBufferPtr() {
        return inputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    double* outputBufferPtr() {
        return outputBuffer;
    }

    void updatePhase(int sampleRate) {
        double phaseIncrement = frequency / sampleRate;

        phase += phaseIncrement;

        phase = fmod(phase, 1.0);
    }

    double phaseToSaw() {
        return - 2 * phase + 1;
    }

EMSCRIPTEN_KEEPALIVE
    void process(int currentFrame, int sampleRate) {
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            updatePhase(sampleRate);
            outputBuffer[i] = phaseToSaw();
        }
    }

// EMSCRIPTEN_KEEPALIVE
//     double debug() {
//         return (double)cycleStart;
//     }