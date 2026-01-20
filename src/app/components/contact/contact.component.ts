import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, AfterViewInit {
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

  constructor() {}

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
          charCountElement.style.color = '#149ddd';
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
