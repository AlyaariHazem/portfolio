import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var Typed: any;

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements AfterViewInit {
  ngAfterViewInit() {
    if (typeof Typed !== 'undefined') {
      new Typed('.typed', {
        strings: ['From Yemen', 'Software Developer', 'Engineering Student'],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        loop: true
      });
    }
  }
}
