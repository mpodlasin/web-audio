export function rewriteStringWithNumber(inputString: string): string {
	// Define a regular expression pattern to match strings of the form "sometext<number>"
	const pattern = /(\D+)(\d+)/g;

	// Use the replace method to replace matches with the desired format
	const result = inputString.replace(pattern, '$1 $2');

	return result;
}
