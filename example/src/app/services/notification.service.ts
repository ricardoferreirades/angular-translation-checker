import { Injectable, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Mock services for demonstration
@Injectable({
  providedIn: 'root'
})
class NotificationTranslateService {
  constructor(private translateService: TranslateService) {}
  
  instant(key: string) { 
    return this.translateService.instant(key); 
  }
  
  get(key: string) { 
    return this.translateService.instant(key); 
  }
}

@Injectable({
  providedIn: 'root'
})
class ToastMessageService {
  showError(title: string, message: string) {
    console.log(`Error Toast - ${title}: ${message}`);
  }
  showSuccess(title: string, message: string) {
    console.log(`Success Toast - ${title}: ${message}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor(
    private notificationTranslate: NotificationTranslateService,
    private toastService: ToastMessageService
  ) {}

  // Example 1: Email notification method
  sendEmailNotification(notificationType: string) {
    // Dynamic pattern with concatenation
    const titleKey = 'NOTIFICATIONS.' + notificationType.toUpperCase() + '.TITLE';
    const messageKey = 'NOTIFICATIONS.' + notificationType.toUpperCase() + '.MESSAGE';
    
    const title = this.notificationTranslate.get(titleKey);
    const message = this.notificationTranslate.instant(messageKey);
    
    console.log(`Email notification: ${title} - ${message}`);
  }

  // Example 2: System notification with template literal
  sendSystemNotification(eventType: string) {
    const dynamicKey = `NOTIFICATIONS.SYSTEM.${eventType.toUpperCase()}`;
    const notification = this.notificationTranslate.instant(dynamicKey);
    
    // Standalone key passed to helper function
    this.logNotification('NOTIFICATIONS.SYSTEM.TITLE', notification);
  }

  // Example 3: Error handling method (similar to user's real code)
  handleNotificationErrors(
    error: any,
    generalMessageTranslationKey: string
  ): void {
    if (Array.isArray(error)) {
      error.forEach((err: any) => {
        try {
          // Multiline translation call
          this.toastService.showError(
            this.notificationTranslate.instant('COMMON.TOAST.ERROR.TITLE'),
            err.message || err.description
          );
        } catch (error) {
          console.error('Error handling notification errors:', error);
        }
      });
    } else {
      // Variable key usage (standalone key detection)
      this.toastService.showError(
        this.notificationTranslate.instant('COMMON.TOAST.ERROR.TITLE'),
        this.notificationTranslate.instant(generalMessageTranslationKey)
      );
    }
  }

  // Example 4: Dynamic pattern generation
  generateDynamicNotification(category: string, type: string, action: string) {
    // Complex template literal
    const complexKey = `${category.toUpperCase()}.${type.toUpperCase()}.${action.toUpperCase()}`;
    const message = this.notificationTranslate.get(complexKey);
    
    // String concatenation pattern
    const fallbackKey = category + '.' + type + '.MESSAGE';
    const fallbackMessage = this.notificationTranslate.instant(fallbackKey);
    
    return message || fallbackMessage;
  }

  private logNotification(titleKey: string, message: string) {
    // Example 5: Function parameter usage
    const title = this.notificationTranslate.instant(titleKey);
    console.log(`[NOTIFICATION] ${title}: ${message}`);
  }
}

@Component({
  selector: 'app-notification-service',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="notification-demo">
      <h3>{{ 'NOTIFICATIONS.EMAIL.TITLE' | translate }}</h3>
      <div class="demo-buttons">
        <button (click)="testEmailNotification()">{{ emailButtonLabel }}</button>
        <button (click)="testSystemNotification()">{{ systemButtonLabel }}</button>
        <button (click)="testErrorHandling()">{{ errorButtonLabel }}</button>
      </div>
      <div class="demo-output">
        <p *ngFor="let log of demoLogs">{{ log }}</p>
      </div>
    </div>
  `,
  styles: [`
    .notification-demo {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f8f9fa;
    }
    .demo-buttons {
      display: flex;
      gap: 10px;
      margin: 15px 0;
    }
    .demo-buttons button {
      padding: 8px 16px;
      background-color: #17a2b8;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .demo-output {
      max-height: 200px;
      overflow-y: auto;
      background-color: white;
      padding: 10px;
      border-radius: 4px;
      margin-top: 15px;
    }
    .demo-output p {
      margin: 5px 0;
      font-family: monospace;
      font-size: 12px;
    }
  `]
})
export class NotificationServiceComponent implements OnInit {
  emailButtonLabel: string = '';
  systemButtonLabel: string = '';
  errorButtonLabel: string = '';
  demoLogs: string[] = [];

  constructor(
    private notificationService: NotificationService,
    private demoTranslateService: NotificationTranslateService
  ) {}

  ngOnInit() {
    // Example 1: Component initialization with translations
    this.emailButtonLabel = this.demoTranslateService.instant('COMMON.BUTTONS.SAVE');
    this.systemButtonLabel = this.demoTranslateService.get('COMMON.BUTTONS.EDIT');
    this.errorButtonLabel = this.demoTranslateService.instant('COMMON.BUTTONS.DELETE');
  }

  testEmailNotification() {
    // Example 2: Testing email notification
    this.notificationService.sendEmailNotification('email');
    this.addLog('Email notification test executed');
    
    // Standalone key usage
    this.handleSuccess('COMMON.SUCCESS.SAVED');
  }

  testSystemNotification() {
    // Example 3: Testing system notification
    this.notificationService.sendSystemNotification('maintenance');
    this.addLog('System notification test executed');
  }

  testErrorHandling() {
    // Example 4: Testing error handling with standalone key
    const errorData = [
      { message: 'Network error' },
      { description: 'Validation failed' }
    ];
    
    // Pass standalone key as parameter
    this.notificationService.handleNotificationErrors(
      errorData,
      'COMMON.TOAST.ERROR.MESSAGE.NETWORK_FAILURE'
    );
    
    this.addLog('Error handling test executed');
  }

  private handleSuccess(successKey: string) {
    // Example 5: Function parameter with translation key
    const successMessage = this.demoTranslateService.instant(successKey);
    this.addLog(`Success: ${successMessage}`);
  }

  private addLog(message: string) {
    this.demoLogs.push(`${new Date().toLocaleTimeString()}: ${message}`);
    if (this.demoLogs.length > 10) {
      this.demoLogs.shift(); // Keep only last 10 logs
    }
  }
}
