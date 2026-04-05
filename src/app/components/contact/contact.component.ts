import { Component, OnInit, AfterViewInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement | string, parameters: { sitekey: string; theme?: 'light' | 'dark' }) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, AfterViewInit {
  /** Exposed for template; empty in production until you set environment.prod.ts */
  readonly recaptchaSiteKey = environment.recaptchaSiteKey;

  private readonly themeService = inject(ThemeService);
  private recaptchaWidgetId: number | undefined;
  private lastRenderedTheme: 'light' | 'dark' | null = null;

  formData = {
    name: '',
    subject: '',
    message: ''
  };
  charCount = 0;
  maxChars = 500;
  isSubmitting = false;
  showLoading = false;
  showError = false;
  showSuccess = false;
  errorMessage = '';
  mailtoLink = '';

  constructor() {
    effect(() => {
      const theme = this.themeService.theme();
      queueMicrotask(() => this.syncRecaptchaWidget(theme));
    });
  }

  private syncRecaptchaWidget(theme: 'light' | 'dark'): void {
    if (!this.recaptchaSiteKey) {
      return;
    }
    const el = document.getElementById('recaptcha-container');
    if (!el) {
      setTimeout(() => this.syncRecaptchaWidget(theme), 50);
      return;
    }
    const grecaptcha = window.grecaptcha;
    if (!grecaptcha?.render) {
      setTimeout(() => this.syncRecaptchaWidget(theme), 50);
      return;
    }
    if (this.recaptchaWidgetId !== undefined && this.lastRenderedTheme === theme) {
      return;
    }
    if (this.recaptchaWidgetId !== undefined) {
      try {
        grecaptcha.reset(this.recaptchaWidgetId);
      } catch {
        /* ignore */
      }
    }
    el.innerHTML = '';
    this.recaptchaWidgetId = grecaptcha.render(el, {
      sitekey: this.recaptchaSiteKey,
      theme: theme === 'dark' ? 'dark' : 'light'
    });
    this.lastRenderedTheme = theme;
  }

  ngOnInit() {
    // No initialization needed
  }

  ngAfterViewInit() {
    // Character counter for message textarea
    const messageTextarea = document.getElementById('message');
    const charCountElement = document.getElementById('charCount');
    
    if (messageTextarea && charCountElement) {
      messageTextarea.addEventListener('input', (e: any) => {
        const currentLength = e.target.value.length;
        this.charCount = currentLength;
        charCountElement.textContent = currentLength.toString();
        
        if (currentLength > this.maxChars) {
          charCountElement.style.color = '#dc3545';
          messageTextarea.style.borderColor = '#dc3545';
        } else if (currentLength > this.maxChars * 0.9) {
          charCountElement.style.color = '#ffc107';
        } else {
          charCountElement.style.color = '#1a4a6e';
        }
      });
    }
  }

  isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
  }

  createEmailLink(): string {
    const recipient = 'alyaarihazem@gmail.com';
    const subject = encodeURIComponent(this.formData.subject);
    const body = encodeURIComponent(
      `Hello Hazem,\n\n` +
      `My name is ${this.formData.name}.\n\n` +
      `${this.formData.message}\n\n` +
      `Best regards,\n${this.formData.name}`
    );

    // Always use mailto for both desktop and mobile to open the default email app
    return `mailto:${recipient}?subject=${subject}&body=${body}`;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;
    
    this.showLoading = true;
    this.showError = false;
    this.showSuccess = false;
    this.errorMessage = '';
    this.isSubmitting = true;

    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.classList.add('loading');
    }

    // Simulate network delay for better UX
    setTimeout(() => {
      this.showLoading = false;
      this.showSuccess = true;
      this.isSubmitting = false;
      if (submitBtn) {
        submitBtn.classList.remove('loading');
      }
      
      // Create email link (Gmail for mobile, mailto for desktop)
      this.mailtoLink = this.createEmailLink();
    }, 1000);
  }
}
