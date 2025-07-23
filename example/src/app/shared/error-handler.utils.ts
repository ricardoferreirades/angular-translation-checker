// Shared error handling utilities demonstrating translation usage patterns

// Mock services for demonstration
class SharedTranslateService {
  instant(key: string) { return key; }
  get(key: string) { return key; }
}

class SharedToastService {
  showError(title: string, message: string) {
    console.log(`[ERROR TOAST] ${title}: ${message}`);
  }
  showSuccess(title: string, message: string) {
    console.log(`[SUCCESS TOAST] ${title}: ${message}`);
  }
  showWarning(title: string, message: string) {
    console.log(`[WARNING TOAST] ${title}: ${message}`);
  }
}

/**
 * Enhanced error handler demonstrating various translation patterns
 * This is similar to the user's real handleErrorsResponse function
 */
export function handleErrorsResponse(
  error: any,
  toastMessageService: SharedToastService,
  translateService: SharedTranslateService,
  generalMessageTranslationKey: string,
): void {
  if (Array.isArray(error)) {
    error.forEach((err: any) => {
      try {
        // Example 1: Multiline translateService.instant() call
        toastMessageService.showError(
          translateService.instant('COMMON.TOAST.ERROR.TITLE'),
          err.message || err.description,
        );
      } catch (error) {
        console.error('Error handling errors response:', error);
        
        // Example 2: Fallback error message
        const fallbackMessage = translateService.instant(
          'COMMON.ERROR.MESSAGE'
        );
        toastMessageService.showError('Error', fallbackMessage);
      }
    });
  } else {
    // Example 3: Variable key used in translateService.instant()
    // This demonstrates standalone key detection when passed as parameter
    toastMessageService.showError(
      translateService.instant('COMMON.TOAST.ERROR.TITLE'),
      translateService.instant(generalMessageTranslationKey),
    );
  }
}

/**
 * Utility function for handling validation errors
 */
export function handleValidationErrors(
  validationErrors: string[],
  toastService: SharedToastService,
  translationService: SharedTranslateService
): void {
  validationErrors.forEach(errorType => {
    // Example 4: Dynamic key generation with template literal
    const errorKey = `FORMS.VALIDATION.${errorType.toUpperCase()}`;
    const errorMessage = translationService.get(errorKey);
    
    // Example 5: String concatenation pattern
    const titleKey = 'COMMON.TOAST.' + 'ERROR' + '.TITLE';
    const title = translationService.instant(titleKey);
    
    toastService.showError(title, errorMessage);
  });
}

/**
 * Access rights confirmation handler demonstrating enterprise patterns
 */
export function handleAccessRightsConfirmation(
  accessType: string,
  translationService: SharedTranslateService,
  toastService: SharedToastService
): void {
  // Example 6: Enterprise SCREAMING_SNAKE_CASE pattern
  const toScreamingSnakeCase = (str: string) => str.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  
  // This simulates the user's real enterprise pattern:
  // ACCESS_RIGHTS_CONFIRMATION.INFO.${toScreamingSnakeCase(key)}
  const confirmationKey = `ACCESS_RIGHTS_CONFIRMATION.INFO.${toScreamingSnakeCase(accessType)}`;
  const confirmationMessage = translationService.instant(confirmationKey);
  
  // Example 7: Success toast with multiline call
  const successTitle = translationService.instant(
    'COMMON.TOAST.SUCCESS.TITLE'
  );
  
  toastService.showSuccess(successTitle, confirmationMessage);
}

/**
 * Dynamic notification generator
 */
export function generateNotificationMessage(
  category: string,
  type: string,
  action: string,
  translationService: SharedTranslateService
): string {
  // Example 8: Complex dynamic pattern generation
  const dynamicKey = `${category.toUpperCase()}.${type.toUpperCase()}.${action.toUpperCase()}`;
  const message = translationService.get(dynamicKey);
  
  if (!message) {
    // Example 9: Fallback pattern with concatenation
    const fallbackKey = category + '.' + type + '.MESSAGE';
    return translationService.instant(fallbackKey);
  }
  
  return message;
}

/**
 * User action logger with translation support
 */
export class UserActionLogger {
  constructor(
    private loggerTranslateService: SharedTranslateService
  ) {}

  logUserAction(action: string, details: any) {
    // Example 10: Method with dynamic key generation
    const actionKey = `USER.ACTIONS.${action.toUpperCase()}`;
    const actionLabel = this.loggerTranslateService.instant(actionKey);
    
    // Example 11: Template literal with nested translation
    const logMessage = `Action: ${actionLabel} - Details: ${JSON.stringify(details)}`;
    
    console.log(logMessage);
  }

  logSystemEvent(eventType: string, severity: 'info' | 'warning' | 'error') {
    // Example 12: Nested dynamic patterns
    const eventKey = `SYSTEM.EVENTS.${eventType.toUpperCase()}`;
    const severityKey = `SYSTEM.SEVERITY.${severity.toUpperCase()}`;
    
    const eventMessage = this.loggerTranslateService.get(eventKey);
    const severityLabel = this.loggerTranslateService.instant(severityKey);
    
    console.log(`[${severityLabel}] ${eventMessage}`);
  }
}

/**
 * Standalone utility functions
 */

// Example 13: Function that takes translation key as parameter
export function showUserMessage(messageKey: string, translationService: SharedTranslateService): void {
  const message = translationService.instant(messageKey);
  console.log('User Message:', message);
}

// Example 14: Function with multiple standalone keys
export function validateAndNotify(
  validationKey: string,
  successKey: string,
  translationService: SharedTranslateService,
  toastService: SharedToastService
): boolean {
  const validationMessage = translationService.instant(validationKey);
  const successMessage = translationService.get(successKey);
  
  // Simulate validation
  const isValid = Math.random() > 0.5;
  
  if (isValid) {
    toastService.showSuccess('Success', successMessage);
  } else {
    toastService.showError('Validation Error', validationMessage);
  }
  
  return isValid;
}

// Example 15: Constants with translation keys (standalone key detection)
export const COMMON_TRANSLATION_KEYS = {
  SAVE_SUCCESS: 'COMMON.SUCCESS.SAVED',
  DELETE_SUCCESS: 'COMMON.SUCCESS.DELETED',
  UPDATE_SUCCESS: 'COMMON.SUCCESS.UPDATED',
  NETWORK_ERROR: 'COMMON.ERROR.NETWORK',
  VALIDATION_ERROR: 'COMMON.ERROR.VALIDATION'
};

// Example 16: Function using constants
export function handleCommonActions(
  actionType: 'save' | 'delete' | 'update',
  translationService: SharedTranslateService
): void {
  let messageKey: string;
  
  switch (actionType) {
    case 'save':
      messageKey = COMMON_TRANSLATION_KEYS.SAVE_SUCCESS;
      break;
    case 'delete':
      messageKey = COMMON_TRANSLATION_KEYS.DELETE_SUCCESS;
      break;
    case 'update':
      messageKey = COMMON_TRANSLATION_KEYS.UPDATE_SUCCESS;
      break;
    default:
      messageKey = 'COMMON.ERROR.MESSAGE';
  }
  
  const message = translationService.instant(messageKey);
  console.log('Action result:', message);
}
