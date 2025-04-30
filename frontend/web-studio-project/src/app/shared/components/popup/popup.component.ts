import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
export class PopupComponent implements OnInit{
protected isPopupActive = false;
protected isChangePopup = false;
protected consultationForm: FormGroup;
protected orderForm: FormGroup;

constructor(private fb: FormBuilder,){

  this.orderForm = this.fb.group({
    service:[''],
    name:['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$')]],

  });
  this.consultationForm = this.fb.group({
    name:['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$')]],

  });
}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
