import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit {
  @Input() images: string[] = [];
  param = 'data-carousel-item="active"';
  ngOnInit(): void {
    // console.log('image ',this.images);
    initFlowbite();
  }
}
