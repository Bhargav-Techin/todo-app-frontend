import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="navbar">
      <a class="brand" routerLink="/">TodoApp</a>
      <div class="actions">
        <button
          class="theme-toggle"
          (click)="themeService.toggleTheme()"
          [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          {{ themeService.isDark() ? 'Light Mode' : 'Dark Mode' }}
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      height: 3.5rem;
      background-color: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    .brand {
      font-weight: 700;
      font-size: 1.125rem;
      color: var(--text-primary);
      text-decoration: none;
      letter-spacing: -0.01em;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .theme-toggle {
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      padding: 0.375rem 0.875rem;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.8125rem;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }

    .theme-toggle:hover {
      background-color: var(--bg-accent);
    }
  `]
})
export class NavbarComponent {
  protected readonly themeService = inject(ThemeService);
}
