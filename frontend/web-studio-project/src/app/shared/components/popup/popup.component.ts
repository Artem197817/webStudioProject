import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';

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
protected isConsultationPopup = false;
protected isOrderPopup = false;
protected isThanksPopup = false;
protected consultationForm: FormGroup;
protected orderForm: FormGroup;

constructor(private fb: FormBuilder,
            private fb2: FormBuilder,
            protected orderService: OrderService,
            ){

  this.orderForm = this.fb.group({
    service:[''],
    name:['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$')]],

  });
  this.consultationForm = this.fb2.group({
    name:['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$')]],

  });
}
  ngOnInit(): void {

  }

  closePopup(){
    this.orderService.closePopup();
  }
  consultation(){
    this.orderService.thanksPopup();
  }

  serviceOrder(){
    this.orderService.thanksPopup();
  }
}
/**1. Структура данных
typescript
// Пример массива услуг
export const SERVICES = [
  { id: 1, name: 'Услуга 1', price: 1000, description: 'Краткое описание услуги 1' },
  { id: 2, name: 'Услуга 2', price: 2000, description: 'Краткое описание услуги 2' },
  // ... и так далее
];
2. Карточка услуги (ServiceCardComponent)
typescript
@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h3>{{service.name}}</h3>
      <p>{{service.description}}</p>
      <div>от {{service.price}} рублей</div>
      <button (click)="showDetails()">Подробнее</button>
    </div>
  `
})
export class ServiceCardComponent {
  @Input() service!: { id: number, name: string, price: number, description: string };

  constructor(private orderService: OrderService) {}

  showDetails() {
    this.orderService.openOrderPopup(this.service);
  }
}
3. OrderService для управления модальным окном
typescript
@Injectable({ providedIn: 'root' })
export class OrderService {
  private _activeService = signal<{ id: number, name: string } | null>(null);
  private _isPopupActive = signal(false);

  get activeService() { return this._activeService(); }
  get isPopupActive() { return this._isPopupActive(); }

  openOrderPopup(service: { id: number, name: string }) {
    this._activeService.set(service);
    this._isPopupActive.set(true);
  }

  closePopup() {
    this._isPopupActive.set(false);
    this._activeService.set(null);
  }
}
4. Модальное окно (OrderModalComponent)
typescript
@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" *ngIf="orderService.isPopupActive">
      <div class="modal">
        <form [formGroup]="form" *ngIf="!success" (ngSubmit)="submit()">
          <label>
            Услуга:
            <select formControlName="service">
              <option *ngFor="let s of services" [value]="s.name">{{s.name}}</option>
            </select>
          </label>
          <label>
            Имя:
            <input formControlName="name" />
          </label>
          <label>
            Телефон:
            <input formControlName="phone" />
          </label>
          <button type="submit" [disabled]="form.invalid || loading">Оставить заявку</button>
          <div *ngIf="error" class="error">произошла ошибка при отправке формы, попробуйте еще раз.</div>
        </form>
        <div *ngIf="success" class="thanks">
          Спасибо за заказ!
        </div>
        <button class="close" (click)="close()">×</button>
      </div>
    </div>
  `,
  styleUrls: ['./order-modal.component.scss']
})
export class OrderModalComponent implements OnInit {
  form: FormGroup;
  services = SERVICES;
  loading = false;
  error = false;
  success = false;

  constructor(
    public orderService: OrderService,
    private fb: FormBuilder,
    private commentService: CommentService // Ваш сервис для отправки формы
  ) {
    this.form = this.fb.group({
      service: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$')]]
    });
  }

  ngOnInit() {
    // При открытии попапа - подставить нужную услугу
    if (this.orderService.activeService) {
      this.form.patchValue({ service: this.orderService.activeService.name });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = false;
    this.commentService.addComment(this.form.value).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  close() {
    this.orderService.closePopup();
    this.success = false;
    this.error = false;
    this.form.reset();
  }
}
5. Вставьте модальное окно в AppComponent
typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [OrderModalComponent, RouterOutlet, ...],
  template: `
    <router-outlet></router-outlet>
    <app-order-modal></app-order-modal>
  `
})
export class AppComponent {}
6. Валидация
Все поля в форме - с Validators.required.

Для телефона - паттерн, как выше.

7. Список услуг
Используйте отдельный массив (например, SERVICES).

Передавайте его в выпадающий список.

8. Обработка ошибок и успешной отправки
При успехе - показывайте блок "Спасибо за заказ".

При ошибке - выводите ошибку под кнопкой.

9. Открытие модального окна
При клике на "Подробнее" вызывайте orderService.openOrderPopup(service).

Итог
Карточки показывают услуги и кнопку.

Клик по "Подробнее" открывает модальное окно с формой, выбранная услуга подставляется автоматически.

Валидация и обработка ошибок реализованы.

Модальное окно и список услуг - отдельные компоненты/модули.

Если нужен полный рабочий пример или есть вопросы по интеграции - дайте знать! */