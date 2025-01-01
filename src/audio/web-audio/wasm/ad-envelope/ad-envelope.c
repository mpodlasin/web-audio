#include <emscripten.h>
#include <math.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float attackDecay[2];

static float inputBuffer[WEBEAUDIO_FRAME_SIZE];
static float outputBuffer[WEBEAUDIO_FRAME_SIZE];

static float lastValueOfPreviousProcess = 0;

static float lastEnvelopeValue = 0;

static int envelopeEventStart = -1;
static float envelopeEventStartValue = -1;
static float envelopeEventAttack = -1;
static float envelopeEventDecay = -1;

EMSCRIPTEN_KEEPALIVE
    float* attackDecayPtr() {
        return attackDecay;
    }
EMSCRIPTEN_KEEPALIVE
    float* inputBufferPtr() {
        return inputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    float* outputBufferPtr() {
        return outputBuffer;
    }
    int millisecondsToSamples(float milliseconds, int sampleRate) {
        return (int)((milliseconds / 1000.0) * sampleRate);
    }
    float attackFn(int x, int attack, float startingValue) {
        return (x / (float)attack) * (1 - startingValue) + startingValue;
    }
    float decayFn(int x, int decay) {
        float e = 7;
        return ((pow(e, (x / (float)(-decay))) - 1 / e) * e) / (e - 1);
    }
EMSCRIPTEN_KEEPALIVE
    void process(int currentFrame, int sampleRate) {
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            if ((i == 0 && lastValueOfPreviousProcess == 0 && inputBuffer[0] == 1) || (i > 0 && inputBuffer[i] == 1 && inputBuffer[i-1] == 0)) {
                envelopeEventStart = currentFrame + i;
                envelopeEventStartValue = lastEnvelopeValue;
                envelopeEventAttack = attackDecay[0];
                envelopeEventDecay = attackDecay[1];
            }
        }

        if (envelopeEventStart != -1) {
            int attackInSamples = millisecondsToSamples(envelopeEventAttack, sampleRate);
            int decayInSamples = millisecondsToSamples(envelopeEventDecay, sampleRate);
            int start = envelopeEventStart;
            int middle = start + attackInSamples;
            int end = middle + decayInSamples;

             for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
                int currentSample = currentFrame + i;

                if (start < currentSample && currentSample <= middle) {
                    outputBuffer[i] = attackFn(currentSample - start, attackInSamples, envelopeEventStartValue);
                }

                if (middle < currentSample && currentSample <= end) {
                    outputBuffer[i] = decayFn(currentSample - middle, decayInSamples);
                }

                if (end < currentSample) {
                    envelopeEventStart = -1;
                    envelopeEventStartValue = -1;
                    envelopeEventAttack = -1;
                    envelopeEventDecay = -1;
                }
            }
        } else {
             for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
                    outputBuffer[i] = 0;
            }
        }

        lastEnvelopeValue = outputBuffer[WEBEAUDIO_FRAME_SIZE - 1];
        lastValueOfPreviousProcess = inputBuffer[WEBEAUDIO_FRAME_SIZE - 1];
    }

// EMSCRIPTEN_KEEPALIVE
//     float debug() {
//         return leftCurrentStep;
//     }