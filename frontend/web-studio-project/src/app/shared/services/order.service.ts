import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


public isPopupActiveSignal = signal<boolean>(false);
public consultationPopupSignal = signal<boolean>(false);
public orderPopupSignal = signal<boolean>(false);
public isThanksPopupSignal = signal<boolean>(false);


constructor() {
 }

 openPopup(type: 'consultation' | 'order') {
  this.isPopupActiveSignal.set(true);
  this.consultationPopupSignal.set(type === 'consultation');
  this.orderPopupSignal.set(type === 'order');

}

closePopup() {
  this.isPopupActiveSignal.set(false);
  this.consultationPopupSignal.set(false);
  this.orderPopupSignal.set(false);
  this.isThanksPopupSignal.set(false);

}

thanksPopup(){
  this.isPopupActiveSignal.set(true);
  this.consultationPopupSignal.set(false);
  this.orderPopupSignal.set(false);
  this.isThanksPopupSignal.set(true);
}
}
