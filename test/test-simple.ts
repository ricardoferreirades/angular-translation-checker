import { TranslationChecker } from '../src/core/translation-checker';
import { TypeScriptExtractor } from '../src/plugins/extractors/typescript-extractor';

async function simpleTest(): Promise<void> {
  console.log('Simple TypeScript Architecture Test');
  
  try {
    console.log('Creating TypeScript extractor...');
    const extractor = new TypeScriptExtractor();
    console.log(`Created: ${extractor.name} v${extractor.version}`);
    
    console.log('Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

simpleTest();
