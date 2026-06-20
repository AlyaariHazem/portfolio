import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const Typed: {
  new (selector: string, options: Record<string, unknown>): unknown;
};

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements AfterViewInit {
  private readonly heroNameRef = viewChild<ElementRef<HTMLElement>>('heroName');

  ngAfterViewInit(): void {
    this.splitName();
    this.initTyped();
  }

  private splitName(): void {
    const el = this.heroNameRef()?.nativeElement;
    if (!el) {
      return;
    }

    const words = el.textContent?.trim().split(/\s+/) ?? [];
    el.textContent = '';
    let index = 0;

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      const wordSpan = document.createElement('span');
      wordSpan.className = 'hero__word';

      for (const char of word) {
        const letter = document.createElement('span');
        letter.className = 'hero__letter';
        letter.style.setProperty('--i', String(index++));
        letter.textContent = char;
        wordSpan.appendChild(letter);
      }

      el.appendChild(wordSpan);

      if (wi < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    }
  }

  private initTyped(): void {
    if (typeof Typed === 'undefined') {
      return;
    }

    new Typed('.typed', {
      strings: ['from Yemen', 'a Software Developer', 'an Engineering Student'],
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
      loop: true
    });
  }
}
