import { AfterViewInit, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  isMobileMenuOpen = false;
  isScrolled = false;

  constructor(readonly theme: ThemeService) {}

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const onScroll = () => {
      this.isScrolled = window.scrollY > 24;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
    });
  }

  ngAfterViewInit(): void {
    this.syncHeaderHeight();

    const header = this.document.getElementById('header');
    if (!header) {
      return;
    }

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => this.syncHeaderHeight());
      observer.observe(header);
      this.destroyRef.onDestroy(() => observer.disconnect());
    } else {
      window.addEventListener('resize', () => this.syncHeaderHeight());
    }
  }

  private syncHeaderHeight(): void {
    const header = this.document.getElementById('header');
    if (!header) {
      return;
    }
    this.document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.document.body.classList.toggle('mobile-nav-active', this.isMobileMenuOpen);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.document.body.classList.remove('mobile-nav-active');
  }
}
