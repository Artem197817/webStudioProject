import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { RequestEnumType, RequestType } from '../../types/request.types';
import { provideHttpClient } from '@angular/common/http';

describe('OrderService', () => {
    let service: OrderService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            OrderService,
            provideHttpClient(),
            provideHttpClientTesting()
          ]
        });
    
        service = TestBed.inject(OrderService);
        httpMock = TestBed.inject(HttpTestingController);
      });
    
      afterEach(() => {
        httpMock.verify();
      });

    it('should be created with default signal values', () => {
        expect(service.activeService).toBeNull();
        expect(service.isPopupActiveSignal()).toBeFalse();
        expect(service.consultationPopupSignal()).toBeFalse();
        expect(service.orderPopupSignal()).toBeFalse();
        expect(service.isThanksPopupSignal()).toBeFalse();
    });

    it('should open consultation popup and set signals correctly', () => {
        service.openConsultationPopup();

        expect(service.isPopupActiveSignal()).toBeTrue();
        expect(service.consultationPopupSignal()).toBeTrue();
        expect(service.orderPopupSignal()).toBeFalse();
        expect(service.isThanksPopupSignal()).toBeFalse();
    });

    it('should close all popups and reset signals', () => {

        service.openConsultationPopup();
        service.thanksPopup();
        service.closePopup();

        expect(service.isPopupActiveSignal()).toBeFalse();
        expect(service.consultationPopupSignal()).toBeFalse();
        expect(service.orderPopupSignal()).toBeFalse();
        expect(service.isThanksPopupSignal()).toBeFalse();
    });

    it('should open thanks popup and set signals correctly', () => {
        service.thanksPopup();

        expect(service.isPopupActiveSignal()).toBeTrue();
        expect(service.consultationPopupSignal()).toBeFalse();
        expect(service.orderPopupSignal()).toBeFalse();
        expect(service.isThanksPopupSignal()).toBeTrue();
    });

    it('should open order popup and set active service and signals', () => {
        service.openOrderPopup(123, 'Test Service');

        expect(service.activeService).toEqual({ id: 123, name: 'Test Service' });
        expect(service.isPopupActiveSignal()).toBeTrue();
        expect(service.orderPopupSignal()).toBeTrue();
        expect(service.consultationPopupSignal()).toBeFalse();
        expect(service.isThanksPopupSignal()).toBeFalse();
    });

    it('should send addRequest and receive response', () => {
        const mockRequest: RequestType = {
            name: 'Dan',
            phone: '89871390711',
            service: 'Создание сайтов',
            type: RequestEnumType.order,
        };
        const mockResponse = {
            error: true,
            message: 'string',
        };

        service.addRequest(mockRequest).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(environment.api + 'requests');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockRequest);

        req.flush(mockResponse);
    });
});