import { Injectable, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme = signal<'light' | 'dark'>('light');
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const saved = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
    const theme = saved ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this._theme.set(theme);
    this.applyTheme();
  }

  toggleTheme(): void {
    this._theme.update(t => (t === 'light' ? 'dark' : 'light'));
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('app-theme', this._theme());
    }
    this.applyTheme();
  }

  private applyTheme(): void {
    const body = this.document.body;
    body.classList.toggle('dark', this._theme() === 'dark');
    body.classList.toggle('light', this._theme() === 'light');
  }
}
