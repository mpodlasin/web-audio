import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Splits a tutorial markdown file into separate Copy*.md files
 * @param {string} sourceFilePath - Path to the source tutorial markdown file
 * @param {string} targetDir - Directory where the Copy*.md files should be created
 */
function splitTutorial(sourceFilePath, targetDir) {
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

// Check command line arguments
if (process.argv.length < 4) {
  console.error('Usage: node tutorial-splitter.js <source-file> <target-directory>');
  console.error('Example: node tutorial-splitter.js memory-bank/tutorial5copy.md src/components/Tutorial/Tutorial5');
  process.exit(1);
}

const sourceFilePath = process.argv[2];
const targetDir = process.argv[3];

// Validate source file exists
if (!fs.existsSync(sourceFilePath)) {
  console.error(`Error: Source file not found: ${sourceFilePath}`);
  process.exit(1);
}

// Split the tutorial
const stepCount = splitTutorial(sourceFilePath, targetDir);
console.log(`Tutorial splitting complete! Created ${stepCount} Copy*.md files in ${targetDir}`);
