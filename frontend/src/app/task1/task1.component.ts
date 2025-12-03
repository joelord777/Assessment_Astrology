import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartService, Chart } from '../services/chart.service';

@Component({
  selector: 'app-task1',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task1-container">
      <h2>Astrological Charts</h2>
      <p class="task-description">
        Explore birth charts and discover planetary positions.
      </p>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading charts...</p>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="errorMessage">
        <div class="error-icon">⚠️</div>
        <p>{{ errorMessage }}</p>
        <button class="retry-btn" (click)="loadCharts()">Try Again</button>
      </div>

      <!-- Empty State -->
      <div class="empty-container" *ngIf="!isLoading && !errorMessage && charts.length === 0">
        <p>No charts found.</p>
      </div>

      <!-- Charts Grid -->
      <div class="charts-grid" *ngIf="!isLoading && !errorMessage && charts.length > 0">
        <div class="chart-card" *ngFor="let chart of charts">
          <div class="card-header">
            <h3>{{ chart.name || 'Birth Chart' }}</h3>
            <span class="sun-badge">☉ {{ chart.sunSign }}</span>
          </div>

          <div class="card-body">
            <div class="birth-info">
              <div class="info-row">
                <span class="label">Date:</span>
                <span class="value">{{ formatDate(chart.birthDate) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Time:</span>
                <span class="value">{{ chart.birthTime }}</span>
              </div>
              <div class="info-row">
                <span class="label">Location:</span>
                <span class="value">{{ chart.birthLocation }}</span>
              </div>
            </div>

            <div class="signs-section">
              <h4>Major Signs</h4>
              <div class="signs-grid">
                <div class="sign-item">
                  <span class="sign-icon">☉</span>
                  <span class="sign-label">Sun</span>
                  <span class="sign-value">{{ chart.sunSign }}</span>
                </div>
                <div class="sign-item">
                  <span class="sign-icon">☽</span>
                  <span class="sign-label">Moon</span>
                  <span class="sign-value">{{ chart.moonSign }}</span>
                </div>
                <div class="sign-item">
                  <span class="sign-icon">↑</span>
                  <span class="sign-label">Rising</span>
                  <span class="sign-value">{{ chart.risingSign }}</span>
                </div>
              </div>
            </div>

            <div class="planets-section">
              <h4>Planetary Positions</h4>
              <div class="planets-list">
                <div class="planet-item" *ngFor="let planet of getPlanetsList(chart)">
                  <span class="planet-name">{{ planet.name }}</span>
                  <span class="planet-position">{{ planet.sign }} {{ planet.degree }}°</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task1-container {
      max-width: 1100px;
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
      color: #666;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e0e0e0;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-container {
      text-align: center;
      padding: 3rem;
      background: #fff5f5;
      border-radius: 8px;
      border: 1px solid #feb2b2;
    }

    .error-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .error-container p {
      color: #c53030;
      margin-bottom: 1rem;
    }

    .retry-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .retry-btn:hover {
      background: #5a67d8;
    }

    .empty-container {
      text-align: center;
      padding: 3rem;
      background: #f5f5f5;
      border-radius: 8px;
      color: #666;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .chart-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .chart-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .sun-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
    }

    .card-body {
      padding: 1.25rem;
    }

    .birth-info {
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .info-row {
      display: flex;
      margin-bottom: 0.4rem;
    }

    .info-row .label {
      color: #888;
      width: 70px;
      font-size: 0.9rem;
    }

    .info-row .value {
      color: #333;
      font-size: 0.9rem;
    }

    .signs-section, .planets-section {
      margin-bottom: 1rem;
    }

    .signs-section h4, .planets-section h4 {
      font-size: 0.85rem;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.75rem;
    }

    .signs-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }

    .sign-item {
      background: #f7f8fc;
      padding: 0.75rem;
      border-radius: 8px;
      text-align: center;
    }

    .sign-icon {
      display: block;
      font-size: 1.2rem;
      margin-bottom: 0.25rem;
    }

    .sign-label {
      display: block;
      font-size: 0.75rem;
      color: #888;
    }

    .sign-value {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #333;
    }

    .planets-list {
      display: grid;
      gap: 0.5rem;
    }

    .planet-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      background: #f7f8fc;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .planet-name {
      color: #555;
      font-weight: 500;
    }

    .planet-position {
      color: #667eea;
      font-weight: 500;
    }

    @media (max-width: 600px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }

      .signs-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `]
})
export class Task1Component implements OnInit {
  charts: Chart[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    this.loadCharts();
  }

  loadCharts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.chartService.getAllCharts().subscribe({
      next: (response: any) => {
        this.charts = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load charts. Please check your connection and try again.';
        this.isLoading = false;
        console.error('Error loading charts:', error);
      }
    });
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

  getPlanetsList(chart: Chart): { name: string; sign: string; degree: number }[] {
    const planets = chart.planets;
    if (!planets) return [];

    const planetNames: { [key: string]: string } = {
      sun: 'Sun',
      moon: 'Moon',
      mercury: 'Mercury',
      venus: 'Venus',
      mars: 'Mars',
      jupiter: 'Jupiter',
      saturn: 'Saturn',
      uranus: 'Uranus',
      neptune: 'Neptune',
      pluto: 'Pluto'
    };

    return Object.entries(planets)
      .filter(([key, value]) => planetNames[key] && value)
      .map(([key, value]) => ({
        name: planetNames[key],
        sign: value!.sign,
        degree: value!.degree
      }));
  }
}

