import {Injectable, signal} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isShowed$ = new Subject<boolean>()
  public isPopupActive = signal(false);

  constructor() {
  }

  show() {
    this.isShowed$.next(true);
  }

  hide() {
    this.isShowed$.next(false);
  }
}
