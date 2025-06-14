import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styles: `
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .fade-in.show {
    opacity: 1;
    transform: translateY(0);
  }`,
})
export class AboutComponent implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });

    this.el.nativeElement.querySelectorAll('.fade-in').forEach((el: Element) => {
      observer.observe(el);
    });
  }
}
