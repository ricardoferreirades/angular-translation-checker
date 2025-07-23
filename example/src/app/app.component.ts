import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NotificationServiceComponent } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TranslateModule, NotificationServiceComponent],
  template: `
    <div class="app-container">
      <header class="header">
        <div class="logo">
          <h1>✈️ FlightFinder</h1>
        </div>
        <nav class="navigation">
          <button 
            *ngFor="let item of navigationItems" 
            (click)="navigateTo(item.key)"
            class="nav-button">
            {{ item.label }}
          </button>
          <div class="language-switcher">
            <select (change)="switchLanguage($event)" [value]="currentLanguage" class="language-select">
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
            </select>
          </div>
          <button class="sign-in-button">{{ signInLabel }}</button>
        </nav>
      </header>
      
      <main class="main-content">
        <section class="hero-section">
          <h1>{{ heroTitle }}</h1>
          <p>{{ heroSubtitle }}</p>
          <div class="language-info">
            <p>Current Language: <strong>{{ currentLanguageLabel }}</strong></p>
          </div>
        </section>
        
        <section class="search-section">
          <div class="search-placeholder">
            <h3>{{ searchSectionTitle }}</h3>
            <p>{{ searchSectionDescription }}</p>
          </div>
        </section>
        
        <section class="features-section">
          <div class="results-placeholder">
            <h3>{{ resultsSectionTitle }}</h3>
            <p>{{ resultsSectionDescription }}</p>
          </div>
        </section>
        
        <section class="demo-section">
          <app-notification-service></app-notification-service>
        </section>
      </main>
      
      <footer class="footer">
        <p>{{ footerText }}</p>
      </footer>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FlightFinder - Angular Translation Checker Example';
  heroTitle: string = '';
  heroSubtitle: string = '';
  signInLabel: string = '';
  footerText: string = '';
  currentLanguage: string = 'en';
  currentLanguageLabel: string = '';
  searchSectionTitle: string = '';
  searchSectionDescription: string = '';
  resultsSectionTitle: string = '';
  resultsSectionDescription: string = '';
  
  navigationItems = [
    { key: 'flights', label: '' },
    { key: 'hotels', label: '' },
    { key: 'cars', label: '' },
    { key: 'trips', label: '' }
  ];

  constructor(private translateService: TranslateService) {
    // Set default language
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  ngOnInit() {
    // Load translations for current language
    this.loadTranslations();
    
    // Example 3: Demonstrate dynamic translation patterns
    this.demonstrateTranslationPatterns();
  }

  private loadTranslations() {
    // Example 1: Basic translation loading
    this.heroTitle = this.translateService.instant('FLIGHT.SEARCH.TITLE');
    this.heroSubtitle = this.translateService.instant('FLIGHT.SEARCH.SUBTITLE');
    this.signInLabel = this.translateService.instant('NAVIGATION.SIGN_IN');
    this.footerText = this.translateService.instant('NAVIGATION.HELP');
    
    // Load section titles
    this.searchSectionTitle = this.translateService.instant('FLIGHT.SEARCH.TITLE');
    this.searchSectionDescription = this.translateService.instant('FLIGHT.SEARCH.SUBTITLE');
    this.resultsSectionTitle = this.translateService.instant('FLIGHT.RESULTS.TITLE');
    this.resultsSectionDescription = this.translateService.instant('FLIGHT.RESULTS.FOUND_FLIGHTS').replace('{count}', '15');
    
    // Update current language label
    this.updateCurrentLanguageLabel();
    
    // Example 2: Loading navigation items with dynamic keys
    this.navigationItems.forEach(item => {
      const navKey = `NAVIGATION.${item.key.toUpperCase()}`;
      item.label = this.translateService.instant(navKey);
    });
  }

  switchLanguage(event: any) {
    const selectedLanguage = event.target.value;
    this.currentLanguage = selectedLanguage;
    
    // Example: Dynamic language switching with translation service
    this.translateService.use(selectedLanguage).subscribe(() => {
      // Reload all translations after language change
      this.loadTranslations();
      
      // Example: Dynamic translation key for language change confirmation
      const confirmationKey = `COMMON.LANGUAGE.${selectedLanguage.toUpperCase()}_SELECTED`;
      const confirmationMessage = this.translateService.instant(confirmationKey);
      console.log('Language switched:', confirmationMessage);
    });
  }

  private updateCurrentLanguageLabel() {
    // Example: Dynamic key generation for current language
    const languageKey = `COMMON.LANGUAGE.${this.currentLanguage.toUpperCase()}`;
    this.currentLanguageLabel = this.translateService.instant(languageKey);
  }

  private demonstrateTranslationPatterns() {
    // Example 4: Template literal pattern
    const searchKey = `FLIGHT.SEARCH.SEARCH_BUTTON`;
    const searchLabel = this.translateService.instant(searchKey);
    
    // Example 5: String concatenation pattern
    const priceKey = 'FLIGHT.RESULTS.' + 'PRICE';
    const priceLabel = this.translateService.instant(priceKey);
    
    // Example 6: Dynamic key with variable
    const keyType = 'DURATION';
    const durationKey = `FLIGHT.RESULTS.${keyType}`;
    const durationLabel = this.translateService.instant(durationKey);
    
    // Example 7: Nested function calls
    const airlineKey = this.getAirlineTranslationKey('AMERICAN');
    const airlineLabel = this.translateService.instant(airlineKey);
    
    // Example 8: Complex pattern with multiple services
    this.translateWithMultipleServices();
    
    console.log('Translation examples loaded:', {
      search: searchLabel,
      price: priceLabel, 
      duration: durationLabel,
      airline: airlineLabel
    });
  }

  private getAirlineTranslationKey(airline: string): string {
    // Example 9: Method returning dynamic key
    return `AIRLINES.${airline}`;
  }

  private translateWithMultipleServices() {
    // Example 10: Simulating multiple translation services
    // In real apps, these might be different service instances
    const primaryTranslate = this.translateService;
    const secondaryTranslate = this.translateService;
    
    // Example 11: Loading with different service references
    const bookingKey = 'FLIGHT.BOOKING.BOOKING_SUCCESS';
    const bookingMessage = primaryTranslate.instant(bookingKey);
    
    const errorKey = 'COMMON.ERROR.VALIDATION';
    const errorMessage = secondaryTranslate.instant(errorKey);
    
    // Example 12: Function parameters for translations
    this.handleTranslationResult('COMMON.SUCCESS.UPDATED', bookingMessage);
  }

  private handleTranslationResult(key: string, value: string) {
    // Example 13: Function parameter usage
    const resultMessage = this.translateService.instant(key);
    console.log(`Translation result for ${key}: ${resultMessage}`);
  }

  navigateTo(section: string) {
    // Example 4: Dynamic translation key usage
    const notificationKey = `NAVIGATION.${section.toUpperCase()}`;
    const message = this.translateService.instant(notificationKey);
    
    // Example 5: Toast notification with dynamic content
    this.showNavigationFeedback(section, message);
    
    console.log(`Navigating to: ${message}`);
  }

  private showNavigationFeedback(section: string, sectionName: string) {
    // Example 6: Dynamic pattern with template literal
    const loadingKey = `COMMON.LOADING.${section.toUpperCase()}`;
    const loadingMessage = this.translateService.instant(loadingKey);
    
    // Example 7: Multiline translation call for error handling
    const fallbackMessage = this.translateService.instant(
      'COMMON.LOADING.LOADING'
    );
    
    // Example 8: Conditional translation with fallback
    const finalMessage = loadingMessage || fallbackMessage;
    console.log(`Loading: ${finalMessage}`);
    
    // Example 9: String concatenation pattern
    const statusKey = 'COMMON.LOADING.' + 'PLEASE_WAIT';
    const statusMessage = this.translateService.instant(statusKey);
    console.log(`Status: ${statusMessage}`);
  }

  // Example 10: Method demonstrating enterprise pattern
  handleFlightSearch(searchCriteria: any) {
    const searchType = searchCriteria.tripType || 'round_trip';
    
    // Example 11: SCREAMING_SNAKE_CASE pattern for enterprise usage
    const toScreamingSnakeCase = (str: string) => str.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    const searchKey = `FLIGHT_SEARCH_${toScreamingSnakeCase(searchType)}_INITIATED`;
    
    // Simulate the enterprise pattern from user's real code
    const enterpriseMessage = this.translateService.instant(searchKey);
    console.log('Search initiated:', enterpriseMessage);
  }
}
