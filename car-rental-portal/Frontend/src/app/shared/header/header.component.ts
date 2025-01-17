import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/entities/user.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

    @ViewChild('mobileMenu') mobileMenu!: ElementRef;
    @ViewChild('openMenu') openMenu!: ElementRef;
    @ViewChild('closeMenu') closeMenu!: ElementRef;
    @ViewChild('profileDropdown') profileDropdown!: ElementRef;
    @ViewChild('mycar_content') mycar_content!: ElementRef;


    in = ['tw-hidden', 'tw-ease-in', 'tw-duration-75', 'tw-opacity-0', 'tw-scale-95'];
    out = ['tw-ease-out', 'tw-duration-100', 'tw-opacity-100', 'tw-scale-100'];
    currentPage = '';
    isUserLoggedIn: boolean = false;
    isLoading = true;
    user: User = new User();
    name: string = '';
    request: number = 0;
    split: string = '///'

    constructor(
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private storageService: StorageService,
    ) {
        this.currentPage = this.router.url;
    }

    ngOnInit() {
        if (this.storageService.get('userInfo')) {
            this.name = this.storageService.get('userInfo').split(this.split)[0];
            this.role = this.storageService.get('userInfo').split(this.split)[1];
            this.user.avatar = this.storageService.get('userInfo').split(this.split)[2];
            this.user.email = this.storageService.get('userInfo').split(this.split)[3];
            this.isLoading = false;
            this.isUserLoggedIn = true;
        } else {
            this.getUser();
        }
    }

    public role: string;

    getUser() {
        this.isLoading = true;
        this.userService.getUserInfoX().subscribe(
            (response: any) => {
                // console.log('header user', response);
                this.isUserLoggedIn = true;
                this.user.firstName = response.firstName;
                this.user.lastName = response.lastName;
                this.user.email = response.email;
                this.user.avatar = response.avatar;
                this.role = response.role;
                this.storageService.set('userInfo', this.user.firstName + ' ' + this.user.lastName
                    + this.split + response.role
                    + this.split + this.user.avatar
                    + this.split + this.user.email);
            },
            (error: any) => {
                console.error('error header', error);
                this.isUserLoggedIn = false;
            }
        );
        this.isLoading = false;
    }

    getRequest() {
        this.userService.getUserRequest().subscribe(
            (response: any) => {
                //  this.request = response;
                console.log('response', response);
                console.log('rq', this.request);
            },
            (error: any) => {
                this.request = 0;
            },
            () => {
                console.log('okela');
            }
        );
    }

    logout() {
        this.authService.logout(true);
    }


    dropProfile() {
        if (this.profileDropdown.nativeElement.classList.contains('tw-ease-out')) {
            this.in.forEach(className => {
                this.profileDropdown.nativeElement.classList.add(className);
            });
            this.out.forEach(className => {
                this.profileDropdown.nativeElement.classList.remove(className);
            });
        } else {
            this.in.forEach(className => {
                this.profileDropdown.nativeElement.classList.remove(className);
            });
            this.out.forEach(className => {
                this.profileDropdown.nativeElement.classList.add(className);
            });
        }
    }

    isMenuOpen: boolean = false;

    menuMobile() {
        const element = this.mobileMenu.nativeElement;
        this.isMenuOpen = !this.isMenuOpen;

        if (this.isMenuOpen) {
            element.classList.add('show-md');
            this.closeMenu.nativeElement.classList.remove('tw-hidden');
            this.closeMenu.nativeElement.classList.add('tw-block');
            this.openMenu.nativeElement.classList.remove('tw-block');
            this.openMenu.nativeElement.classList.add('tw-hidden');
        } else {
            element.classList.remove('show-md');
            this.closeMenu.nativeElement.classList.add('tw-hidden');
            this.closeMenu.nativeElement.classList.remove('tw-block');
            this.openMenu.nativeElement.classList.add('tw-block');
            this.openMenu.nativeElement.classList.remove('tw-hidden');
        }
    }

    showMycar() {
        if (this.mycar_content.nativeElement.classList.contains('open')) {
            this.mycar_content.nativeElement.classList.remove('open');
        } else {
            this.mycar_content.nativeElement.classList.add('open');
        }
    }
}