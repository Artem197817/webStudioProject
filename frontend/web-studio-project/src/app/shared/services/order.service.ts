import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

private _activeService = signal<{ id: number, name: string } | null>(null);

public isPopupActiveSignal = signal<boolean>(false);
public consultationPopupSignal = signal<boolean>(false);
public orderPopupSignal = signal<boolean>(false);
public isThanksPopupSignal = signal<boolean>(false);




get activeService() { return this._activeService(); }

constructor() {
 }

 openConsultationPopup() {
  this.isPopupActiveSignal.set(true);
  this.consultationPopupSignal.set(true);
 

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

openOrderPopup(id: number, name: string ) {
  const service = {id: id, name: name}
  this._activeService.set(service);
  this.isPopupActiveSignal.set(true);
  this.orderPopupSignal.set(true);
  console.log(this.activeService)
}

/**
addRequest()  addComment(comment: RequestType): Observable<DefaultResponseType> {
  return this.http.post<DefaultResponseType>(environment.api + 'comments', comment);
} */

}
