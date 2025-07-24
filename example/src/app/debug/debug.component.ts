import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-debug',
  template: `
    <div>
      {{ 'DEBUG.CONSOLE' | translate }}
      {{ 'INTERNAL.SYSTEM' | translate }}
      {{ 'DEV_TOOLS.PROFILER' | translate }}
    </div>
  `
})
export class DebugComponent {
  constructor(private translate: TranslateService) {
    // These keys should be excluded when debug directory is ignored
    this.translate.instant('DEBUG.LOG');
    this.translate.get('INTERNAL.CONFIG');
    this.translate.instant('DEV_TOOLS.INSPECTOR');
    
    // Dynamic pattern in debug component
    const debugLevel = 'trace';
    this.translate.instant(`DEBUG.${debugLevel.toUpperCase()}`);
  }
}
