import { AfterViewInit, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SkillItem {
  name: string;
  icon: string;
  percent: number;
}

interface AngularTopic {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly leftSkills: SkillItem[] = [
    { name: 'C#', icon: 'bxl-c-plus-plus', percent: 95 },
    { name: 'Data Structures and Algorithms', icon: 'bx-code-curly', percent: 90 },
    { name: 'MySQL, SQL Server, Oracle', icon: 'bx-data', percent: 80 },
    { name: 'Microservices & Clean Architecture', icon: 'bx-layer', percent: 85 }
  ];

  readonly rightSkills: SkillItem[] = [
    { name: 'Angular (v17, v18, v19, v20)', icon: 'bxl-angular', percent: 95 },
    { name: 'Micro-Frontend & Module Federation', icon: 'bx-grid-alt', percent: 85 },
    { name: 'Web Development', icon: 'bx-world', percent: 90 },
    { name: 'Git and GitHub', icon: 'bxl-git', percent: 80 }
  ];

  readonly angularFoundational: AngularTopic[] = [
    { label: 'Angular Fundamentals', icon: 'bx-book-open' },
    { label: 'Components', icon: 'bx-cube' },
    { label: 'Routing', icon: 'bx-git-branch' },
    { label: 'Forms', icon: 'bx-edit-alt' },
    { label: 'HTTP', icon: 'bx-cloud-download' },
    { label: 'Basic RxJS', icon: 'bx-pulse' }
  ];

  readonly angularMidLevel: AngularTopic[] = [
    { label: 'Advanced RxJS', icon: 'bx-network-chart' },
    { label: 'Signals', icon: 'bx-broadcast' },
    { label: 'State Management', icon: 'bx-layer' },
    { label: 'Testing', icon: 'bx-check-shield' },
    { label: 'Performance Optimization', icon: 'bx-tachometer' }
  ];

  barWidth(skill: SkillItem): number {
    return this.animatedSkills()[skill.name] ? skill.percent : 0;
  }

  private readonly animatedSkills = signal<Record<string, boolean>>({});

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      const all: Record<string, boolean> = {};
      [...this.leftSkills, ...this.rightSkills].forEach((s) => {
        all[s.name] = true;
      });
      this.animatedSkills.set(all);
      return;
    }

    const items = document.querySelectorAll('#skills .skill-item');
    if (!items.length) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const reveal = (item: Element) => {
      const name = item.getAttribute('data-skill');
      if (!name || this.animatedSkills()[name]) {
        return;
      }
      this.animatedSkills.update((current) => ({ ...current, [name]: true }));
    };

    if (reducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((item) => reveal(item));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -5% 0px' }
    );

    items.forEach((item) => {
      if (this.isInViewport(item)) {
        reveal(item);
        return;
      }
      observer.observe(item);
    });

    this.initSkillSpotlight(items);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private initSkillSpotlight(items: NodeListOf<Element>): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (reducedMotion || !finePointer) {
      return;
    }

    items.forEach((item) => {
      item.addEventListener('pointermove', (event) => {
        const pointer = event as PointerEvent;
        const rect = item.getBoundingClientRect();
        (item as HTMLElement).style.setProperty('--sx', `${pointer.clientX - rect.left}px`);
        (item as HTMLElement).style.setProperty('--sy', `${pointer.clientY - rect.top}px`);
      });
    });
  }

  private isInViewport(el: Element): boolean {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < vh * 0.92 && rect.bottom > vh * 0.05;
  }
}
