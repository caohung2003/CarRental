import { Component, OnInit } from "@angular/core";
import { BookingService } from "../../../../services/booking.service";
import { initFlowbite } from 'flowbite';

@Component({
    styleUrl: './view-edit-booking-details.component.scss',
    templateUrl: './view-edit-booking-details.component.html'
})
export class ViewEditBookingDetailsComponent implements OnInit{
    constructor(private bookingService:BookingService){

    }
    
    ngOnInit(): void {
        initFlowbite();
    }
}