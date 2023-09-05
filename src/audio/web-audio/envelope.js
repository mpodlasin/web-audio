class Envelope extends AudioWorkletProcessor {
	constructor() {
		super();
	}

	process(inputList, outputList, parameters) {
		// Using the inputs (or not, as needed),
		// write the output into each of the outputs
		// 

    outputList.forEach(output => {
      output.forEach(out => {
        for (let i = 0; i < out.length; i++) {
          out[i] = Math.random()
        }
      })
    })
		return true;
	}
}

registerProcessor('envelope', Envelope);
