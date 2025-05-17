import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Renumbers all "# Step X" headers in a tutorial file to be sequential
 * @param {string} filePath - Path to the tutorial file
 * @returns {number} - The number of steps after renumbering
 */
function renumberSteps(filePath) {
  console.log(`Renumbering steps in: ${filePath}`);
  
  // Read file content
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find all step headers
  const stepRegex = /^# Step \d+/gm;
  const matches = [...content.matchAll(stepRegex)];
  
  if (matches.length === 0) {
    console.error(`Error: No "# Step X" headers found in ${filePath}`);
    process.exit(1);
  }
  
  // Replace with sequential numbers
  // Convert to character array to make precise replacements by position
  const contentChars = [...content];
  let replacements = 0;
  
  // Sort matches by their position in the file (to ensure we process them in order)
  // Process in REVERSE order to prevent position shifts
  matches.sort((a, b) => b.index - a.index);
  
  matches.forEach((match, i) => {
    // Calculate the correct step number (processing in reverse order)
    const stepNumber = matches.length - i;
    const oldHeader = match[0];
    const newHeader = `# Step ${stepNumber}`;
    
    if (oldHeader !== newHeader) {
      replacements++;
      console.log(`Replacing "${oldHeader}" with "${newHeader}" at position ${match.index}`);
    }
    
    // Replace the exact characters at the exact position
    const startIndex = match.index;
    const endIndex = startIndex + oldHeader.length;
    
    // Remove old header characters
    contentChars.splice(startIndex, oldHeader.length);
    
    // Insert new header characters
    const newHeaderChars = [...newHeader];
    contentChars.splice(startIndex, 0, ...newHeaderChars);
  });
  
  // Convert back to string
  const newContent = contentChars.join('');
  
  // Write back to file
  fs.writeFileSync(filePath, newContent);
  
  if (replacements > 0) {
    console.log(`Successfully renumbered ${replacements} steps in ${filePath}`);
  } else {
    console.log(`All ${matches.length} steps were already correctly numbered in ${filePath}`);
  }
  
  console.log(`Total steps: ${matches.length}`);
  return matches.length;
}

/**
 * Splits a tutorial markdown file into separate Copy*.md files
 * @param {string} sourceFilePath - Path to the source tutorial markdown file
 * @param {string} targetDir - Directory where the Copy*.md files should be created
 * @param {boolean} skipRenumbering - Whether to skip the renumbering step
 * @returns {number} - The number of files created
 */
function splitTutorial(sourceFilePath, targetDir, skipRenumbering = false) {
  // First, renumber the steps in the source file if not skipped
  if (!skipRenumbering) {
    renumberSteps(sourceFilePath);
  }
  
  // Create the target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Created directory: ${targetDir}`);
  }

  // Read the source file
  const content = fs.readFileSync(sourceFilePath, 'utf8');
  
  // Split the content by "# Step X" headers
  const stepRegex = /^# Step (\d+)/m;
  const steps = content.split(stepRegex).filter(Boolean);
  
  // Process the steps (they come in pairs: step number, step content)
  const processedSteps = [];
  for (let i = 0; i < steps.length; i += 2) {
    if (i + 1 < steps.length) {
      const stepNumber = parseInt(steps[i], 10);
      const stepContent = steps[i + 1].trim();
      processedSteps.push({ number: stepNumber, content: stepContent });
    }
  }
  
  // Sort steps by number (just in case they're not in order)
  processedSteps.sort((a, b) => a.number - b.number);
  
  // Write each step to a separate file
  for (const step of processedSteps) {
    const fileName = `Copy${step.number}.md`;
    const filePath = path.join(targetDir, fileName);
    
    // Add the script import at the top if it's not already there
    let finalContent = step.content;
    if (!finalContent.startsWith('<script>')) {
      finalContent = '<script>\n    import Clr from \'../Clr.svelte\';\n</script>\n\n' + finalContent;
    }
    
    fs.writeFileSync(filePath, finalContent);
    console.log(`Created: ${filePath}`);
  }
  
  console.log(`Successfully split tutorial into ${processedSteps.length} files`);
  return processedSteps.length;
}

/**
 * Main function to process tutorial files
 * @param {Array} args - Command line arguments
 * @param {Object} options - Additional options
 * @returns {void}
 */
function processFiles(args, options = {}) {
  const { skipRenumbering = false, renumberOnly = false } = options;
  
  let sourceFilePath, targetDir;

  // Check if we have a single argument (tutorial number)
  if (args.length === 1 && /^\d+$/.test(args[0])) {
    const tutorialNumber = args[0];
    sourceFilePath = `memory-bank/tutorial${tutorialNumber}copy.md`;
    targetDir = `src/components/Tutorial/Tutorial${tutorialNumber}`;
    console.log(`Using simplified syntax for Tutorial ${tutorialNumber}`);
    console.log(`- Source file: ${sourceFilePath}`);
    console.log(`- Target directory: ${targetDir}`);
  } else if (args.length >= 2 && !renumberOnly) {
    // Original syntax with source file and target directory
    sourceFilePath = args[0];
    targetDir = args[1];
  } else if (args.length >= 1 && renumberOnly) {
    // Renumber only mode
    sourceFilePath = args[0];
  } else {
    console.error('Error: Invalid arguments');
    showUsage();
    process.exit(1);
  }

  // Validate source file exists
  if (!fs.existsSync(sourceFilePath)) {
    console.error(`Error: Source file not found: ${sourceFilePath}`);
    process.exit(1);
  }

  // If renumber only mode, just renumber the steps
  if (renumberOnly) {
    const stepCount = renumberSteps(sourceFilePath);
    console.log(`Renumbering complete! Found ${stepCount} steps in ${sourceFilePath}`);
    return;
  }

  // Otherwise, split the tutorial
  const stepCount = splitTutorial(sourceFilePath, targetDir, skipRenumbering);
  console.log(`Tutorial processing complete! Created ${stepCount} Copy*.md files in ${targetDir}`);
}

function showUsage() {
  console.error('Usage:');
  console.error('  Process (renumber and split) a tutorial:');
  console.error('    node tutorial-splitter-v2.js <tutorial-number>');
  console.error('    node tutorial-splitter-v2.js <source-file> <target-directory>');
  console.error('  Skip renumbering:');
  console.error('    node tutorial-splitter-v2.js --skip-renumbering <tutorial-number>');
  console.error('    node tutorial-splitter-v2.js --skip-renumbering <source-file> <target-directory>');
  console.error('  Renumber steps only (no splitting):');
  console.error('    node tutorial-splitter-v2.js --renumber-only <tutorial-number>');
  console.error('    node tutorial-splitter-v2.js --renumber-only <file-path>');
  console.error('Examples:');
  console.error('  node tutorial-splitter-v2.js 6');
  console.error('  node tutorial-splitter-v2.js memory-bank/tutorial5copy.md src/components/Tutorial/Tutorial5');
  console.error('  node tutorial-splitter-v2.js --skip-renumbering 6');
  console.error('  node tutorial-splitter-v2.js --renumber-only memory-bank/tutorial6copy.md');
}

// Process command line arguments
if (process.argv.length < 3) {
  showUsage();
  process.exit(1);
}

// Parse options
const args = [];
let options = {};

for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === '--skip-renumbering') {
    options.skipRenumbering = true;
  } else if (arg === '--renumber-only') {
    options.renumberOnly = true;
  } else {
    args.push(arg);
  }
}

// Execute
processFiles(args, options);
