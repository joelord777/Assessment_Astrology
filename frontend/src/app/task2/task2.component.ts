import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartService, Chart, CalculateChartRequest } from '../services/chart.service';

@Component({
  selector: 'app-task2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="task2-container">
      <h2>Birth Chart Calculator</h2>
      <p class="task-description">
        Enter your birth details below to calculate your astrological birth chart.
      </p>

      <div class="content-wrapper">
        <!-- Form Section -->
        <div class="form-section">
          <form [formGroup]="birthForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="birthDate">Birth Date *</label>
              <input
                type="date"
                id="birthDate"
                formControlName="birthDate"
                [class.invalid]="isFieldInvalid('birthDate')"
              >
              <span class="error-message" *ngIf="isFieldInvalid('birthDate')">
                Birth date is required
              </span>
            </div>

            <div class="form-group">
              <label for="birthTime">Birth Time *</label>
              <input
                type="time"
                id="birthTime"
                formControlName="birthTime"
                [class.invalid]="isFieldInvalid('birthTime')"
              >
              <span class="error-message" *ngIf="isFieldInvalid('birthTime')">
                Birth time is required
              </span>
            </div>

            <div class="form-group">
              <label for="birthLocation">Birth Location *</label>
              <input
                type="text"
                id="birthLocation"
                formControlName="birthLocation"
                placeholder="e.g., New York, NY, USA"
                [class.invalid]="isFieldInvalid('birthLocation')"
              >
              <span class="error-message" *ngIf="isFieldInvalid('birthLocation')">
                Birth location is required
              </span>
            </div>

            <button
              type="submit"
              class="submit-btn"
              [disabled]="isLoading || birthForm.invalid"
            >
              <span *ngIf="!isLoading">Calculate Chart</span>
              <span *ngIf="isLoading" class="btn-loading">
                <span class="spinner-small"></span>
                Calculating...
              </span>
            </button>
          </form>

          <!-- Error Message -->
          <div class="error-alert" *ngIf="errorMessage">
            <span class="error-icon">⚠️</span>
            {{ errorMessage }}
          </div>
        </div>

        <!-- Result Section -->
        <div class="result-section" *ngIf="chartResult">
          <div class="result-card">
            <div class="result-header">
              <h3>Your Birth Chart</h3>
              <button class="clear-btn" (click)="clearResult()">Clear</button>
            </div>

            <div class="result-body">
              <div class="birth-details">
                <div class="detail-item">
                  <span class="detail-label">Date</span>
                  <span class="detail-value">{{ formatDate(chartResult.birthDate) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Time</span>
                  <span class="detail-value">{{ chartResult.birthTime }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Location</span>
                  <span class="detail-value">{{ chartResult.birthLocation }}</span>
                </div>
              </div>

              <div class="major-signs">
                <h4>Major Signs</h4>
                <div class="signs-row">
                  <div class="sign-box sun">
                    <span class="sign-symbol">☉</span>
                    <span class="sign-type">Sun Sign</span>
                    <span class="sign-name">{{ chartResult.sunSign }}</span>
                  </div>
                  <div class="sign-box moon">
                    <span class="sign-symbol">☽</span>
                    <span class="sign-type">Moon Sign</span>
                    <span class="sign-name">{{ chartResult.moonSign }}</span>
                  </div>
                  <div class="sign-box rising">
                    <span class="sign-symbol">↑</span>
                    <span class="sign-type">Rising Sign</span>
                    <span class="sign-name">{{ chartResult.risingSign }}</span>
                  </div>
                </div>
              </div>

              <div class="planets-section">
                <h4>Planetary Positions</h4>
                <div class="planets-grid">
                  <div class="planet-row" *ngFor="let planet of getPlanets()">
                    <span class="planet-icon">{{ planet.icon }}</span>
                    <span class="planet-name">{{ planet.name }}</span>
                    <span class="planet-info">{{ planet.sign }} at {{ planet.degree }}°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task2-container {
      max-width: 900px;
      margin: 0 auto;
    }

    h2 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .task-description {
      color: #666;
      margin-bottom: 2rem;
    }

    .content-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    .form-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-group input.invalid {
      border-color: #e53e3e;
    }

    .error-message {
      display: block;
      color: #e53e3e;
      font-size: 0.85rem;
      margin-top: 0.35rem;
    }

    .submit-btn {
      width: 100%;
      padding: 0.875rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
    }

    .submit-btn:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .spinner-small {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-alert {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      background: #fff5f5;
      border: 1px solid #feb2b2;
      border-radius: 8px;
      color: #c53030;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .result-section {
      position: sticky;
      top: 1rem;
    }

    .result-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .result-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .result-header h3 {
      margin: 0;
      font-size: 1.1rem;
    }

    .clear-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      padding: 0.35rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85rem;
    }

    .clear-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .result-body {
      padding: 1.25rem;
    }

    .birth-details {
      display: grid;
      gap: 0.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
      margin-bottom: 1rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
    }

    .detail-label {
      color: #888;
      font-size: 0.9rem;
    }

    .detail-value {
      color: #333;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .major-signs h4, .planets-section h4 {
      font-size: 0.85rem;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.75rem;
    }

    .signs-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .sign-box {
      text-align: center;
      padding: 0.75rem 0.5rem;
      border-radius: 8px;
      background: #f7f8fc;
    }

    .sign-symbol {
      display: block;
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
    }

    .sign-type {
      display: block;
      font-size: 0.7rem;
      color: #888;
      margin-bottom: 0.15rem;
    }

    .sign-name {
      display: block;
      font-weight: 600;
      color: #333;
      font-size: 0.85rem;
    }

    .planets-grid {
      display: grid;
      gap: 0.4rem;
    }

    .planet-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      background: #f7f8fc;
      border-radius: 6px;
    }

    .planet-icon {
      font-size: 1rem;
    }

    .planet-name {
      font-weight: 500;
      color: #333;
      flex: 1;
    }

    .planet-info {
      color: #667eea;
      font-weight: 500;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .content-wrapper {
        grid-template-columns: 1fr;
      }

      .result-section {
        position: static;
      }

      .signs-row {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `]
})
export class Task2Component implements OnInit {
  birthForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  chartResult: Chart | null = null;

  constructor(
    private fb: FormBuilder,
    private chartService: ChartService
  ) {}

  ngOnInit(): void {
    this.birthForm = this.fb.group({
      birthDate: ['', Validators.required],
      birthTime: ['', Validators.required],
      birthLocation: ['', Validators.required]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.birthForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  onSubmit(): void {
    if (this.birthForm.invalid) {
      Object.keys(this.birthForm.controls).forEach(key => {
        this.birthForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Format time to HH:MM (remove seconds if present)
    let timeValue = this.birthForm.value.birthTime;
    if (timeValue && timeValue.length > 5) {
      timeValue = timeValue.substring(0, 5);
    }

    const request: CalculateChartRequest = {
      birthDate: this.birthForm.value.birthDate,
      birthTime: timeValue,
      birthLocation: this.birthForm.value.birthLocation
    };

    this.chartService.calculateChart(request).subscribe({
      next: (response: any) => {
        this.chartResult = response.data || response;
        this.isLoading = false;
        this.birthForm.reset();
      },
      error: (error) => {
        this.errorMessage = 'Failed to calculate chart. Please try again.';
        this.isLoading = false;
        console.error('Error calculating chart:', error);
      }
    });
  }

  clearResult(): void {
    this.chartResult = null;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getPlanets(): { name: string; icon: string; sign: string; degree: number }[] {
    if (!this.chartResult?.planets) return [];

    const planetData: { [key: string]: { name: string; icon: string } } = {
      sun: { name: 'Sun', icon: '☉' },
      moon: { name: 'Moon', icon: '☽' },
      mercury: { name: 'Mercury', icon: '☿' },
      venus: { name: 'Venus', icon: '♀' },
      mars: { name: 'Mars', icon: '♂' },
      jupiter: { name: 'Jupiter', icon: '♃' },
      saturn: { name: 'Saturn', icon: '♄' },
      uranus: { name: 'Uranus', icon: '♅' },
      neptune: { name: 'Neptune', icon: '♆' },
      pluto: { name: 'Pluto', icon: '♇' }
    };

    const planets = this.chartResult.planets;
    return Object.entries(planets)
      .filter(([key, value]) => planetData[key] && value)
      .map(([key, value]) => ({
        name: planetData[key].name,
        icon: planetData[key].icon,
        sign: value!.sign,
        degree: value!.degree
      }));
  }
}

