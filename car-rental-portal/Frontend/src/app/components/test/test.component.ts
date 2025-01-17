import { Component } from '@angular/core';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { DateRangeComponent } from '../../shared/components/date-range/date-range.component';
import { StmtpComponent } from '../../shared/components/stmtp/stmtp.component';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CarouselComponent, DateRangeComponent, DatePickerComponent, StmtpComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  images = [
    'https://images.hdqwalls.com/wallpapers/print-tech-lamborghini-aventador.jpg',
    'https://wallpapercave.com/wp/KTrfAfO.jpg',
    'https://www.hdcarwallpapers.com/walls/2013_lamborghini_aventador_by_print_tech_2-HD.jpg',
  ]

  handleResult(result: string): void {
    console.log('date: ', result); // Output the result to the console or use it as needed
  }
}
