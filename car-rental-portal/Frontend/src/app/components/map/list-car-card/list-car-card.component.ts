import {Component, HostListener, Input, OnInit, SimpleChange, SimpleChanges, ViewChild} from '@angular/core';
import {CarBasic} from "../../../models/interfaces/carbasic";
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {Router, RouterLink} from "@angular/router";
import {Carousel, CarouselModule} from 'primeng/carousel';
import {TagModule} from "primeng/tag";
import {ButtonModule} from "primeng/button";
import {SearchcarService} from "../../../services/searchcar.service";

@Component({
  selector: 'app-list-car-card',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule, CarouselModule, TagModule, ButtonModule,
  ],
  templateUrl: './list-car-card.component.html',
  styleUrl: './list-car-card.component.css'
})
export class ListCarCardComponent implements OnInit {
  @Input() public cars: CarBasic[] = [];
  responsiveOptions: any[] | undefined;
  public numScroll = 1;
  public numVisible = 1;
  public page = 1;
  @ViewChild("carousel") public carousel: Carousel

  ngOnChanges(changes: SimpleChanges): void {
    //this.carousel.page = 0;
  }

  constructor(private route:Router) {
  }

  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  detail(id: number) {
    window.open(this.route.createUrlTree(['/car/detail/' + id], { queryParams: { } }).toString(), '_blank');
  }
}
