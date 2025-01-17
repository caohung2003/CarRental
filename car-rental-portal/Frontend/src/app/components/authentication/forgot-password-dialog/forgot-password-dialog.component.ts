import { Component, TemplateRef, inject } from '@angular/core';
import { ForgotPasswordFormComponent } from '../forgot-password-content/forgot-password.component';
import {
  ModalDismissReasons,
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  styleUrl: './forgot-password-dialog.component.scss',
  templateUrl: './forgot-password-dialog.component.html',
  imports: [ForgotPasswordFormComponent],
  standalone: true,
  selector: 'forgot-password-dialog',
})
export class ForgotPasswordDialogComponent {
  private modalService = inject(NgbModal);
  activeModal = inject(NgbActiveModal);

  private closeResult = '';

  constructor() {}

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'Forgot Password' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
