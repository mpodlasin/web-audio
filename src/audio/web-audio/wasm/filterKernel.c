/*
 *  compilation directive
 *
 *  emcc -O3 -s WASM=1 filterKernel.c -o filterKernel.wasm --no-entry
 */

#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float leftInputBuffer[WEBEAUDIO_FRAME_SIZE];
static float leftOutputBuffer[WEBEAUDIO_FRAME_SIZE];

static float rightInputBuffer[WEBEAUDIO_FRAME_SIZE];
static float rightOutputBuffer[WEBEAUDIO_FRAME_SIZE];

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
EMSCRIPTEN_KEEPALIVE
    void filter() {
        //  just copy in to out !
        for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
            rightOutputBuffer[i] = rightInputBuffer[i];
            leftOutputBuffer[i] = leftInputBuffer[i];
        }
    }