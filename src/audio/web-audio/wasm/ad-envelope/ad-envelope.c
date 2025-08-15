#include <emscripten.h>
#include <math.h>

#define WEBEAUDIO_FRAME_SIZE 128

static double attackDecay[2];

static double inputBuffer[WEBEAUDIO_FRAME_SIZE];
static double outputBuffer[WEBEAUDIO_FRAME_SIZE];

static double lastValueOfPreviousProcess = 0;

static double lastEnvelopeValue = 0;

static int envelopeEventStart = -1;
static double envelopeEventStartValue = -1;
static double envelopeEventAttack = -1;
static double envelopeEventDecay = -1;

EMSCRIPTEN_KEEPALIVE
    double* attackDecayPtr() {
        return attackDecay;
    }
EMSCRIPTEN_KEEPALIVE
    double* inputBufferPtr() {
        return inputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    double* outputBufferPtr() {
        return outputBuffer;
    }
    int millisecondsToSamples(double milliseconds, int sampleRate) {
        return (int)((milliseconds / 1000.0) * sampleRate);
    }
    double attackFn(int x, int attack, double startingValue) {
        return (x / (double)attack) * (1 - startingValue) + startingValue;
    }
    double decayFn(int x, int decay) {
        double e = 7;
        return ((pow(e, (x / (double)(-decay))) - 1 / e) * e) / (e - 1);
    }
EMSCRIPTEN_KEEPALIVE
    void process(int currentFrame, int sampleRate) {
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            if ((i == 0 && lastValueOfPreviousProcess < 0.001 && inputBuffer[0] > 0.999) || (i > 0 && inputBuffer[i] >= 0.999 && inputBuffer[i-1] < 0.001)) {
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
//     double debug() {
//         return leftCurrentStep;
//     }