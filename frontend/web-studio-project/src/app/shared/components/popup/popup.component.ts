import { CommonModule } from '@angular/common';
import { Component, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { SERVICES } from '../../../constants';

@Component({
  selector: 'app-popup',
  imports: [
    CommonModule,
    ReactiveFormsModule,

  ],
  standalone: true,
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent implements OnInit {

  protected consultationForm: FormGroup;
  protected orderForm: FormGroup;
  protected services = SERVICES;

  constructor(private fb: FormBuilder,
    private fb2: FormBuilder,
    protected orderService: OrderService,
  ) {

    this.orderForm = this.fb.group({
      service: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$')]],

    });
    this.consultationForm = this.fb2.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$')]],

    });
    effect(() => {
      const activeService = this.orderService.activeService;
      if (activeService && activeService.name) {
        this.orderForm.patchValue({ service: activeService.name });
      }
    });
  }
    ngOnInit(): void {

    }

  closePopup() {
    this.orderService.closePopup();
  }
  consultation() {
    this.orderService.thanksPopup();
  }

  serviceOrder() {
    this.orderService.thanksPopup();
  }
}
