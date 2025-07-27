import { 
  FormatterPlugin, 
  PluginContext, 
  AnalysisResult, 
  OutputSection,
  Logger 
} from '../../types';

export class HtmlFormatter implements FormatterPlugin {
  readonly name = 'html-formatter';
  readonly version = '1.0.0';
  readonly description = 'Formats analysis results as interactive HTML report';
  readonly outputFormat = 'html' as const;

  private logger!: Logger;

  async initialize(context: PluginContext): Promise<void> {
    this.logger = context.logger;
    this.logger.debug('HTML formatter initialized');
  }

  async format(result: AnalysisResult, sections: OutputSection[]): Promise<string> {
    const timestamp = new Date().toLocaleString();
    const { summary } = result;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Translation Analysis Report</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 3px solid #007acc; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #007acc; margin: 0; font-size: 2.5em; }
        .header .meta { color: #666; margin-top: 10px; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-card.coverage { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .metric-card.missing { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
        .metric-card.unused { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
        .metric-value { font-size: 2.5em; font-weight: bold; margin-bottom: 5px; }
        .metric-label { font-size: 0.9em; opacity: 0.9; }
        .section { margin-bottom: 40px; }
        .section h2 { color: #333; border-left: 4px solid #007acc; padding-left: 15px; margin-bottom: 20px; }
        .key-list { background: #f8f9fa; border-radius: 6px; padding: 20px; }
        .key-item { background: white; margin-bottom: 10px; padding: 15px; border-radius: 4px; border-left: 4px solid #007acc; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .key-name { font-weight: bold; color: #333; font-size: 1.1em; }
        .key-location { color: #666; font-size: 0.9em; margin-top: 5px; }
        .key-context { background: #e3f2fd; color: #1976d2; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; margin-top: 8px; display: inline-block; }
        .unused-key { background: #fff3e0; border-left-color: #ff9800; }
        .missing-key { background: #ffebee; border-left-color: #f44336; }
        .dynamic-pattern { background: #f3e5f5; border-left-color: #9c27b0; }
        .progress-bar { background: #e0e0e0; border-radius: 10px; height: 20px; margin: 10px 0; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%); transition: width 0.3s ease; }
        .tabs { display: flex; border-bottom: 2px solid #e0e0e0; margin-bottom: 20px; }
        .tab { padding: 10px 20px; cursor: pointer; background: #f5f5f5; border: none; border-bottom: 2px solid transparent; }
        .tab.active { background: white; border-bottom-color: #007acc; color: #007acc; font-weight: bold; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Translation Analysis Report</h1>
            <div class="meta">
                Generated on ${timestamp} | 
                Source: ${result.config.srcPath} | 
                Locales: ${result.config.localesPath}
            </div>
        </div>

        <div class="summary-grid">
            <div class="metric-card">
                <div class="metric-value">${summary.totalTranslations}</div>
                <div class="metric-label">Total Translations</div>
            </div>
            <div class="metric-card coverage">
                <div class="metric-value">${summary.coverage}%</div>
                <div class="metric-label">Coverage</div>
            </div>
            <div class="metric-card missing">
                <div class="metric-value">${summary.totalMissingKeys}</div>
                <div class="metric-label">Missing Keys</div>
            </div>
            <div class="metric-card unused">
                <div class="metric-value">${summary.totalUnusedKeys}</div>
                <div class="metric-label">Unused Keys</div>
            </div>
        </div>

        <div class="section">
            <h2>Coverage Overview</h2>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${summary.coverage}%"></div>
            </div>
            <p>Used ${summary.totalUsedKeys} out of ${summary.totalTranslations} available translations (${summary.coverage}% coverage)</p>
        </div>

        <div class="tabs">
            <button class="tab active" onclick="showTab('missing')">Missing Keys</button>
            <button class="tab" onclick="showTab('unused')">Unused Keys</button>
            <button class="tab" onclick="showTab('dynamic')">Dynamic Patterns</button>
            <button class="tab" onclick="showTab('used')">Used Keys</button>
        </div>

        ${sections.includes('missing') ? this.generateMissingKeysSection(result) : ''}
        ${sections.includes('unused') ? this.generateUnusedKeysSection(result) : ''}
        ${sections.includes('dynamicPatterns') ? this.generateDynamicPatternsSection(result) : ''}
        ${sections.includes('usedKeys') ? this.generateUsedKeysSection(result) : ''}
    </div>

    <script>
        function showTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName + '-content').classList.add('active');
            
            // Add active class to selected tab
            event.target.classList.add('active');
        }
    </script>
</body>
</html>`;
  }

  private generateMissingKeysSection(result: AnalysisResult): string {
    if (!result.missingKeys || result.missingKeys.length === 0) {
      return '<div id="missing-content" class="tab-content active"><p>🎉 No missing keys found!</p></div>';
    }

    const keysHtml = result.missingKeys.map(key => `
      <div class="key-item missing-key">
        <div class="key-name">❌ ${key.key}</div>
        <div class="key-location">📍 ${key.file}:${key.line}${key.column ? `:${key.column}` : ''}</div>
        ${key.context ? `<span class="key-context">${key.context}</span>` : ''}
      </div>
    `).join('');

    return `
      <div id="missing-content" class="tab-content active">
        <div class="key-list">
          ${keysHtml}
        </div>
      </div>
    `;
  }

  private generateUnusedKeysSection(result: AnalysisResult): string {
    if (!result.unusedKeys || result.unusedKeys.length === 0) {
      return '<div id="unused-content" class="tab-content"><p>🎉 No unused keys found!</p></div>';
    }

    const keysHtml = result.unusedKeys.map(key => `
      <div class="key-item unused-key">
        <div class="key-name">🗑️ ${key}</div>
        <div class="key-location">Safe to remove - not found in source code</div>
      </div>
    `).join('');

    return `
      <div id="unused-content" class="tab-content">
        <div class="key-list">
          ${keysHtml}
        </div>
      </div>
    `;
  }

  private generateDynamicPatternsSection(result: AnalysisResult): string {
    if (!result.dynamicPatterns || result.dynamicPatterns.length === 0) {
      return '<div id="dynamic-content" class="tab-content"><p>No dynamic patterns detected.</p></div>';
    }

    const patternsHtml = result.dynamicPatterns.map(pattern => `
      <div class="key-item dynamic-pattern">
        <div class="key-name">🔄 ${pattern.pattern}</div>
        <div class="key-location">${pattern.matches.length} occurrences found</div>
        <div style="margin-top: 10px;">
          ${pattern.matches.slice(0, 5).map(match => `<code style="background: #f0f0f0; padding: 2px 6px; margin: 2px; border-radius: 3px; display: inline-block;">${match}</code>`).join('')}
          ${pattern.matches.length > 5 ? `<span style="color: #666;">... and ${pattern.matches.length - 5} more</span>` : ''}
        </div>
      </div>
    `).join('');

    return `
      <div id="dynamic-content" class="tab-content">
        <div class="key-list">
          ${patternsHtml}
        </div>
      </div>
    `;
  }

  private generateUsedKeysSection(result: AnalysisResult): string {
    if (!result.usedKeys || result.usedKeys.length === 0) {
      return '<div id="used-content" class="tab-content"><p>No used keys found.</p></div>';
    }

    const keysHtml = result.usedKeys.slice(0, 50).map(key => `
      <div class="key-item">
        <div class="key-name">✅ ${key.key}</div>
        <div class="key-location">📍 ${key.file}:${key.line}${key.column ? `:${key.column}` : ''}</div>
        ${key.context ? `<span class="key-context">${key.context}</span>` : ''}
      </div>
    `).join('');

    return `
      <div id="used-content" class="tab-content">
        <div class="key-list">
          ${keysHtml}
          ${result.usedKeys.length > 50 ? `<p style="text-align: center; color: #666; margin-top: 20px;">Showing first 50 of ${result.usedKeys.length} used keys</p>` : ''}
        </div>
      </div>
    `;
  }
}
