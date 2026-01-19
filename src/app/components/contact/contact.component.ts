import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var emailjs: any;

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
    email: '',
    subject: '',
    message: ''
  };
  charCount = 0;
  maxChars = 500;
  isSubmitting = false;
  showLoading = false;
  showError = false;
  showSuccess = false;

  ngOnInit() {
    if (typeof emailjs !== 'undefined') {
      emailjs.init("4zgK6KsOevGx8Mk6o");
    }
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
    this.isSubmitting = true;

    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.classList.add('loading');
    }

    if (typeof emailjs !== 'undefined') {
      emailjs.send("service_0nqimrv", "template_23tbe7o", {
        from_name: this.formData.name,
        from_email: this.formData.email,
        subject: this.formData.subject,
        message: this.formData.message
      }).then(() => {
        this.showLoading = false;
        this.showSuccess = true;
        this.isSubmitting = false;
        if (submitBtn) {
          submitBtn.classList.remove('loading');
        }
        
        // Reset form after 3 seconds
        setTimeout(() => {
          this.formData = { name: '', email: '', subject: '', message: '' };
          this.charCount = 0;
          const charCountElement = document.getElementById('charCount');
          if (charCountElement) charCountElement.textContent = '0';
          this.showSuccess = false;
        }, 3000);
      }).catch(() => {
        this.showLoading = false;
        this.showError = true;
        this.isSubmitting = false;
        if (submitBtn) {
          submitBtn.classList.remove('loading');
        }
      });
    } else {
      // Fallback if EmailJS is not loaded
      setTimeout(() => {
        this.showLoading = false;
        this.showSuccess = true;
        this.isSubmitting = false;
        if (submitBtn) {
          submitBtn.classList.remove('loading');
        }
      }, 2000);
    }
  }
}
