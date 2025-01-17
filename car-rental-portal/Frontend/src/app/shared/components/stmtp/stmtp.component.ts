import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-stmtp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stmtp.component.html',
  styleUrl: './stmtp.component.css'
})
export class StmtpComponent {
  @Input() steps: string[] = [];
  @Input() active: number = 0;
}
