import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
const defaultColor = '#4caf50';
const heighlightColor = '#46a14a';
@Component({
    standalone: true,
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [RouterModule]
})

export class FooterComponent implements OnInit {
    loginUser: any;
    @Output() goToTopEventEmit=new EventEmitter<boolean>();
    @Input() position: string = ''
    constructor(
        private router: Router,
        private title: Title,
        private meta: Meta,
    ) {
    }
    ngOnInit() {

    }
    goToTop(){
       this.goToTopEventEmit.emit(true);
    }
}
