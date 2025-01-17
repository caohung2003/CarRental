import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-car-list-view',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './car-list-view.component.html',
  styleUrl: './car-list-view.component.css'
})
export class CarListViewComponent {
  public slideIndex: number = 1;

  public plusSlides(n: number, i: any, next: string) {
    this.showSlides(this.slideIndex += n, i, next);
  }

  public oldIndex: any;

  public showSlides(n: number, i: any, next: string) {
    if (this.slideIndex > 4) {
      this.slideIndex = 1;
    }
    if (this.oldIndex != i) {
      this.slideIndex = 1;
      this.oldIndex = i;
    }
    let slides = document.getElementsByClassName("mySlides" + i);
    if (slides != null) {
      if (n != this.slideIndex) {
        n = this.slideIndex;
        ``
      }
      if (n > 4) {
        this.slideIndex = 1;
      }
      if (n < 1) {
        this.slideIndex = slides.length;
      }
      for (var j = 0; j < slides.length; j++) {
        if (!slides[j].classList.contains("hide")) {
          slides[j].classList.add("hide");
          var a = slides[j].querySelector('.numbertext');
          if (a != null) {
            switch (a.innerHTML) {
              case '1 / 4': {
                if (next == 'next') {
                  this.slideIndex = 2;
                } else {
                  this.slideIndex = 4;
                }
                break;
              }
              case '2 / 4': {
                if (next == 'next') {
                  this.slideIndex = 3;
                } else {
                  this.slideIndex = 1;
                }
                break;
              }
              case '3 / 4': {
                if (next == 'next') {
                  this.slideIndex = 4;
                } else {
                  this.slideIndex = 2;
                }
                break;
              }
              case '4 / 4': {
                if (next == 'next') {
                  this.slideIndex = 1;
                } else {
                  this.slideIndex = 3;
                }
                break;
              }
            }
          }
        }
      }
      slides[this.slideIndex - 1].classList.remove("hide");
    }
  }

}
