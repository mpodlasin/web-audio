#include <emscripten.h>
#include <math.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float frequency;

static float inputBuffer[WEBEAUDIO_FRAME_SIZE];
static float outputBuffer[WEBEAUDIO_FRAME_SIZE];

static double phase = 0;

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
//     float debug() {
//         return (float)cycleStart;
//     }