import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { SkillsComponent } from './components/skills/skills.component';
import { EducationComponent } from './components/education/education.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactComponent } from './components/contact/contact.component';
import { ScrollProgressComponent } from './components/scroll-progress/scroll-progress.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    EducationComponent,
    ProjectsComponent,
    ContactComponent,
    ScrollProgressComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Portfolio';
  readonly showBackToTop = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.init();
    this.initBackToTop();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private initBackToTop(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const onScroll = () => {
      this.showBackToTop.set(window.scrollY > 320);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
  }
}
