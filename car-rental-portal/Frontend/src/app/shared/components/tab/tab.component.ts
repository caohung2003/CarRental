import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [
    NgForOf, NgIf
  ],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class TabComponent {
  @Input() public activeTab = 'Dashboard';

  changeActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
