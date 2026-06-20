import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  template: `
    <div class="progress" [style.width.%]="progress()" aria-hidden="true"></div>
  `,
  styles: [`
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 2px;
      width: 0;
      z-index: 60;
      background: var(--accent);
      transition: width 0.08s linear;
    }
  `]
})
export class ScrollProgressComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  readonly progress = signal(0);

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const update = () => {
      const scrollTop = window.pageYOffset || this.document.documentElement.scrollTop || 0;
      const docHeight = this.document.documentElement.scrollHeight - window.innerHeight;
      const value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      this.progress.set(Math.min(100, Math.max(0, value)));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    });
  }
}
