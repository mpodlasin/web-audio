#include <emscripten.h>
#include <math.h>
#include <float.h>

#define NUMBER_OF_OCTAVES 8
#define WEBEAUDIO_FRAME_SIZE 128
#define NUMBER_OF_NOTES 12

static float notes[NUMBER_OF_NOTES];

static float inputBuffer[WEBEAUDIO_FRAME_SIZE];
static float outputBuffer[WEBEAUDIO_FRAME_SIZE];

EMSCRIPTEN_KEEPALIVE
    float* notesPtr() {
        return notes;
    }
EMSCRIPTEN_KEEPALIVE
    float* inputBufferPtr() {
        return inputBuffer;
    }
EMSCRIPTEN_KEEPALIVE
    float* outputBufferPtr() {
        return outputBuffer;
    }

static float baseFrequencies[NUMBER_OF_NOTES] = {
    440.00, // A
    466.16, // A#
    493.88, // B
    523.25, // C
    554.37, // C#
    587.33, // D
    622.25, // D#
    659.25, // E
    698.46, // F
    739.99, // F#
    783.99, // G
    830.61  // G#
};

float findClosestNoteFrequency(float frequency) {
    float closestFreq = 0.0f;
    float minDifference = FLT_MAX;

    for (int octave = -NUMBER_OF_OCTAVES / 2; octave <= NUMBER_OF_OCTAVES / 2; ++octave) {
        float octaveMultiplier = pow(2.0, octave);

        for (int i = 0; i < NUMBER_OF_NOTES; ++i) {
            if (notes[i] == 1) {
                float noteFreq = baseFrequencies[i] * octaveMultiplier;
                float diff = fabs(frequency - noteFreq);

                if (diff < minDifference) {
                    minDifference = diff;
                    closestFreq = noteFreq;
                }
            }
        }
    }

    return closestFreq;
}
EMSCRIPTEN_KEEPALIVE
    void process(int currentFrame, int sampleRate) {
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            outputBuffer[i] = findClosestNoteFrequency(inputBuffer[i]);
        }
    }

// EMSCRIPTEN_KEEPALIVE
//     float debug() {
//         return currentStep;
//     }


