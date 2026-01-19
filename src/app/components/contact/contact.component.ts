import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

  private apiUrl = `${environment.apiUrl}/contact/`;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // No EmailJS initialization needed
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

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post<any>(this.apiUrl, this.formData, { headers }).subscribe({
      next: (response) => {
        this.showLoading = false;
        this.showSuccess = true;
        this.isSubmitting = false;
        if (submitBtn) {
          submitBtn.classList.remove('loading');
        }
        
        // Create mailto link with pre-filled message
        const recipient = 'alyaarihazem@gmail.com';
        const subject = encodeURIComponent(this.formData.subject);
        const body = encodeURIComponent(
          `Hello Hazem,\n\n` +
          `My name is ${this.formData.name}.\n\n` +
          `${this.formData.message}\n\n` +
          `Best regards,\n${this.formData.name}`
        );
        this.mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
        
        // Don't auto-reset form - let user send email first
      },
      error: (error) => {
        this.showLoading = false;
        this.showError = true;
        this.isSubmitting = false;
        if (submitBtn) {
          submitBtn.classList.remove('loading');
        }
        
        // Extract error message from response
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.error && error.error.errors) {
          const errors = error.error.errors;
          const errorMessages = Object.values(errors).flat();
          this.errorMessage = errorMessages.join(', ');
        } else {
          this.errorMessage = 'Error sending message. Please try again.';
        }
      }
    });
  }
}
