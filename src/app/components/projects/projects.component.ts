import { AfterViewInit, Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProjectCard {
  title: string;
  url: string;
  description: string;
  tags: string[];
  githubUrl: string;
  icon: string;
  featured?: boolean;
  liveDemoUrl?: string;
  viewAll?: boolean;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly projects: ProjectCard[] = [
    {
      title: 'Portfolio Website',
      url: 'https://github.com/Hazemalyaari/portfolio',
      githubUrl: 'https://github.com/alyaarihazem/portfolio.git',
      icon: 'bx-user-circle',
      description:
        'A personal portfolio website featuring about me, contacts, live-map location services, message sending, certificates, and GitHub activity integration. Fully customizable and responsive design.',
      tags: ['HTML', 'CSS', 'JavaScript']
    },
    {
      title: 'MySchool',
      url: 'https://github.com/alyaarihazem/ASP.NET-with-Angular-18.git',
      githubUrl: 'https://github.com/alyaarihazem/ASP.NET-with-Angular-18.git',
      icon: 'bxs-school',
      description:
        'A comprehensive school management system developed with ASP.NET Core Web API and Angular 18. Features student management, course scheduling, and administrative tools.',
      tags: ['Angular 18', 'ASP.NET Core', 'Web API']
    },
    {
      title: 'MySchool (Desktop)',
      url: 'https://github.com/AlyaariHazem/My-School-.git',
      githubUrl: 'https://github.com/AlyaariHazem/My-School-.git',
      icon: 'bxs-school',
      description:
        'Desktop application for school management built with .NET Core. Provides offline capabilities and desktop-specific features for educational institutions.',
      tags: ['.NET Core', 'Desktop App', 'C#']
    },
    {
      title: 'E-Commerce Website',
      url: 'https://github.com/AlyaariHazem/E-Commerce',
      githubUrl: 'https://github.com/AlyaariHazem/E-Commerce',
      icon: 'bx-cart',
      liveDemoUrl: 'https://magenta-kitten-9a6e8a.netlify.app/',
      description:
        'Modern e-commerce platform with product management, shopping cart, and user authentication. Built with Angular and deployed on Netlify.',
      tags: ['Angular', 'TypeScript', 'Netlify']
    },
    {
      title: 'MediSync',
      url: 'https://github.com/AlyaariHazem/website-Medisync',
      githubUrl: 'https://github.com/AlyaariHazem/website-Medisync',
      icon: 'bxs-clinic',
      description:
        'Full-stack healthcare platform for patient data management and appointment scheduling. Built with ASP.NET Core backend and Angular frontend.',
      tags: ['ASP.NET Core', 'Angular', 'Healthcare']
    },
    {
      title: 'Hire-Me',
      url: 'https://github.com/AlyaariHazem/Hire-Me',
      githubUrl: 'https://github.com/AlyaariHazem/Hire-Me',
      icon: 'bx-briefcase-alt-2',
      description:
        'Interactive recruitment platform with job posting, candidate management, and real-time application tracking. Built with advanced Angular features.',
      tags: ['Angular', 'Real-time', 'Dashboard']
    },
    {
      title: 'Microservices',
      url: 'https://github.com/AlyaariHazem/Microservices',
      githubUrl: 'https://github.com/AlyaariHazem/Microservices',
      icon: 'bx-layer',
      description:
        'Learning project exploring microservices patterns with .NET. Includes distributed systems, cloud-native architecture, and advanced microservices concepts.',
      tags: ['.NET', 'Microservices', 'Distributed Systems']
    },
    {
      title: 'Clean Architecture .NET',
      url: 'https://github.com/AlyaariHazem/clean-architecture-dotnet',
      githubUrl: 'https://github.com/AlyaariHazem/clean-architecture-dotnet',
      icon: 'bx-code-alt',
      description:
        'Production-ready ASP.NET Core project implementing Clean Architecture with separation of concerns, generic repositories, async patterns, and DDD principles.',
      tags: ['ASP.NET Core', 'Clean Architecture', 'DDD']
    },
    {
      title: 'Tawzif Platform',
      url: 'https://github.com/AlyaariHazem/tawzif',
      githubUrl: 'https://github.com/AlyaariHazem/tawzif',
      icon: 'bx-grid-alt',
      description:
        'Microfrontend platform using Webpack Module Federation. Host application integrating remote modules for companies, jobs, and job seekers.',
      tags: ['Angular', 'Module Federation', 'Micro-Frontend']
    },
    {
      title: 'Companies Microfrontend',
      url: 'https://github.com/AlyaariHazem/Companies',
      githubUrl: 'https://github.com/AlyaariHazem/Companies',
      icon: 'bx-building',
      description:
        'Microfrontend application for managing company modules, built with Angular 20 and Module Federation. Designed as a remote app to be integrated into the Tawzif host shell.',
      tags: ['Angular 20', 'Module Federation', 'Micro-Frontend']
    },
    {
      title: 'Jobs Microfrontend',
      url: 'https://github.com/AlyaariHazem/Jobs',
      githubUrl: 'https://github.com/AlyaariHazem/Jobs',
      icon: 'bx-briefcase',
      description:
        'Angular microfrontend for job listings and management, built with Angular 20 and Webpack Module Federation. Designed as a remote module to integrate with the host application (Tawzif).',
      tags: ['Angular 20', 'Module Federation', 'Micro-Frontend']
    },
    {
      title: 'Task Manager',
      url: 'https://github.com/AlyaariHazem/Angular-Task-Manager',
      githubUrl: 'https://github.com/AlyaariHazem/Angular-Task-Manager',
      icon: 'bx-task',
      description:
        'Angular application for task management with RxJS state management. Features task creation, status updates, and component communication.',
      tags: ['Angular', 'RxJS', 'State Management']
    },
    {
      title: 'Eshop Modular Monolith',
      url: 'https://github.com/AlyaariHazem/EshopModularMonoliths',
      githubUrl: 'https://github.com/AlyaariHazem/EshopModularMonoliths',
      icon: 'bx-package',
      description:
        'E-commerce platform built as a modular monolith using ASP.NET Web API, Docker, PostgreSQL, Redis, RabbitMQ, CQRS, MediatR, and DDD patterns.',
      tags: ['.NET', 'Docker', 'CQRS']
    },
    {
      title: 'View All Projects',
      url: 'https://github.com/AlyaariHazem?tab=repositories',
      githubUrl: 'https://github.com/AlyaariHazem?tab=repositories',
      icon: 'bx-folder-open',
      viewAll: true,
      description:
        'Explore all my repositories and projects on GitHub. Including learning projects, experiments, and open-source contributions.',
      tags: []
    }
  ];

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (reducedMotion || !finePointer) {
      return;
    }

    const cards = document.querySelectorAll('#services .project-card');
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const onMove = (event: Event) => {
        const pointer = event as PointerEvent;
        const rect = card.getBoundingClientRect();
        (card as HTMLElement).style.setProperty('--mx', `${pointer.clientX - rect.left}px`);
        (card as HTMLElement).style.setProperty('--my', `${pointer.clientY - rect.top}px`);
      };

      card.addEventListener('pointermove', onMove);
      cleanups.push(() => card.removeEventListener('pointermove', onMove));
    });

    this.destroyRef.onDestroy(() => cleanups.forEach((cleanup) => cleanup()));
  }
}
