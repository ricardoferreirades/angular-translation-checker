import { 
  ReporterPlugin, 
  PluginContext, 
  AnalysisResult,
  Logger 
} from '../../types';
import { promises as fs } from 'fs';
import * as path from 'path';

export class FileReporter implements ReporterPlugin {
  readonly name = 'file-reporter';
  readonly version = '1.0.0';
  readonly description = 'Saves analysis reports to files';

  private logger!: Logger;
  private outputDir: string = './reports';

  async initialize(context: PluginContext): Promise<void> {
    this.logger = context.logger;
    this.outputDir = context.config.outputDir || './reports';
    this.logger.debug('File reporter initialized');
  }

  async report(result: AnalysisResult, output: string): Promise<void> {
    try {
      // Ensure output directory exists
      await fs.mkdir(this.outputDir, { recursive: true });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const format = this.detectFormat(output);
      const filename = `translation-analysis-${timestamp}.${format}`;
      const filepath = path.join(this.outputDir, filename);

      // Write the report
      await fs.writeFile(filepath, output, 'utf-8');

      this.logger.info(`Report saved to: ${filepath}`);

      // Also create a latest report link
      const latestPath = path.join(this.outputDir, `latest.${format}`);
      await fs.writeFile(latestPath, output, 'utf-8');

      // Generate index file for multiple reports
      await this.generateIndexFile(result);

    } catch (error) {
      this.logger.error(`Failed to save report: ${error}`);
      throw error;
    }
  }

  private detectFormat(output: string): string {
    if (output.trim().startsWith('<!DOCTYPE html')) {
      return 'html';
    } else if (output.trim().startsWith('{')) {
      return 'json';
    } else {
      return 'txt';
    }
  }

  private async generateIndexFile(result: AnalysisResult): Promise<void> {
    try {
      const files = await fs.readdir(this.outputDir);
      const reportFiles = files.filter(f => f.startsWith('translation-analysis-') && f !== 'index.html');
      
      const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Translation Analysis Reports</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #007acc; border-bottom: 3px solid #007acc; padding-bottom: 10px; }
        .report-list { list-style: none; padding: 0; }
        .report-item { background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 6px; border-left: 4px solid #007acc; }
        .report-item a { text-decoration: none; color: #007acc; font-weight: bold; }
        .report-item a:hover { text-decoration: underline; }
        .report-meta { color: #666; font-size: 0.9em; margin-top: 5px; }
        .latest-badge { background: #4caf50; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; margin-left: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Translation Analysis Reports</h1>
        <p>Generated reports for project: <strong>${result.config.srcPath}</strong></p>
        
        <ul class="report-list">
            ${reportFiles.reverse().map((file, index) => {
              const timestamp = file.match(/translation-analysis-(.+)\./)?.[1]?.replace(/-/g, ':') || '';
              const date = new Date(timestamp).toLocaleString();
              const isLatest = index === 0;
              
              return `
                <li class="report-item">
                  <a href="${file}">${file}</a>
                  ${isLatest ? '<span class="latest-badge">Latest</span>' : ''}
                  <div class="report-meta">Generated: ${date}</div>
                </li>
              `;
            }).join('')}
        </ul>
        
        <div style="margin-top: 30px; padding: 20px; background: #e3f2fd; border-radius: 6px;">
          <h3>Quick Links</h3>
          <p><a href="latest.html">📄 Latest HTML Report</a></p>
          <p><a href="latest.json">📊 Latest JSON Report</a></p>
          <p><a href="latest.txt">📝 Latest Text Report</a></p>
        </div>
    </div>
</body>
</html>`;

      await fs.writeFile(path.join(this.outputDir, 'index.html'), indexHtml, 'utf-8');
    } catch (error) {
      this.logger.warn(`Failed to generate index file: ${error}`);
    }
  }
}
