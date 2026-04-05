import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const STORAGE_KEY = 'portfolio-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly themeSignal = signal<'light' | 'dark'>('light');

  readonly theme = this.themeSignal.asReadonly();

  /** Read in templates; tracks the theme signal for change detection. */
  isDark(): boolean {
    return this.themeSignal() === 'dark';
  }

  init(): void {
    let stored: 'light' | 'dark' | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
    } catch {
      /* private / blocked storage */
    }
    if (stored === 'light' || stored === 'dark') {
      this.applyTheme(stored);
      return;
    }
    /* Default for new visitors: light (ignore OS prefers-color-scheme). */
    this.applyTheme('light');
  }

  toggle(): void {
    this.applyTheme(this.themeSignal() === 'dark' ? 'light' : 'dark');
  }

  applyTheme(theme: 'light' | 'dark'): void {
    this.themeSignal.set(theme);
    const html = this.document.documentElement;
    html.setAttribute('data-theme', theme);
    html.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private mode */
    }
    const meta = this.document.querySelector<HTMLMetaElement>('#meta-theme-color');
    if (meta) {
      meta.content = theme === 'dark' ? '#12161d' : '#f4f5f7';
    }
  }
}
