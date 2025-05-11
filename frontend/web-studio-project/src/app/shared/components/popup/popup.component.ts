import {CommonModule} from '@angular/common';
import {Component, effect, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {OrderService} from '../../services/order.service';
import {SERVICES} from '../../../constants';
import {RequestEnumType} from '../../../types/request.types';


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
  protected thanksTitle = 'Спасибо за вашу заявку!';
  protected thanksText = 'Мы свяжемся с вами при первой же возможности.';

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
        this.orderForm.patchValue({service: activeService.name});
      }
    });
  }

  public ngOnInit(): void {

  }

  protected closePopup() {
    this.orderService.closePopup();
  }

  protected consultation() {
    if (this.consultationForm.valid) {
      const request = {
        name: this.consultationForm.value.name,
        phone: this.consultationForm.value.phone,
        type: RequestEnumType.consultation,
      }

      this.orderService.addRequest(request)
        .subscribe((response) => {
          if (!response.error) {
            this.consultationForm.reset();
            this.orderService.thanksPopup();
          } else {
            this.thanksTitle = 'Что то пошло не так!';
            this.thanksText = 'Свяжитесь с нами по телефону +7 (499) 343-13-34';
            this.orderService.thanksPopup();
          }
        });
    }
  }

  protected serviceOrder() {
    if (this.orderForm.valid) {
      const request = {
        service: this.orderForm.value.service,
        name: this.orderForm.value.name,
        phone: this.orderForm.value.phone,
        type: RequestEnumType.order,
      }

      this.orderService.addRequest(request)
        .subscribe((response) => {
          if (!response.error) {
            this.orderForm.reset();
            this.orderService.thanksPopup();
          } else {
            this.thanksTitle = 'Что то пошло не так!';
            this.thanksText = 'Свяжитесь с нами по телефону +7 (499) 343-13-34';
            this.orderService.thanksPopup();
          }
        });
    }
  }
}

