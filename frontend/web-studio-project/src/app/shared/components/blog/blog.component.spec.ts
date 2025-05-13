import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BlogComponent } from './blog.component';
import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ArticleType, ArticlesType } from '../../../types/article.types';
import { CategoryType } from '../../../types/category.types';

describe('BlogComponent', () => {
    let component: BlogComponent;
    let fixture: ComponentFixture<BlogComponent>;

    let articleServiceMock: any;
    let categoryServiceMock: any;
    let activatedRouteMock: any;
    let routerMock: any;

    beforeEach(async () => {
        articleServiceMock = {
            getArticles: jasmine.createSpy('getArticles').and.returnValue(of({
                items: [{
                    id: 'string',
                    title: 'Test Article',
                    description: 'string',
                    image: 'string',
                    date: 'string',
                    category: 'string',
                    url: 'dffhbxdgdrrxg',
                    text: 'string',
                    commentsCount: 10,
                } as ArticleType],
                count: 1,
                pages: 1
            } as ArticlesType))
        };

        categoryServiceMock = {
            getCategories: jasmine.createSpy('getCategories').and.returnValue(of([
                { id: '1', name: 'Category 1', url: 'cat1', isChange: false } as CategoryType
            ]))
        };
        const queryParamsSubject = new Subject<any>();
        activatedRouteMock = {
            queryParams: queryParamsSubject.asObservable()
        };

        routerMock = {
            navigate: jasmine.createSpy('navigate')
        };

        await TestBed.configureTestingModule({
            imports: [BlogComponent],
            providers: [
                { provide: ArticleService, useValue: articleServiceMock },
                { provide: CategoryService, useValue: categoryServiceMock },
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: Router, useValue: routerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BlogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        queryParamsSubject.next({});
    });

    afterEach(() => {
        component.ngOnDestroy();
    });

    it('should create component and load articles and categories', fakeAsync(() => {
        expect(component).toBeTruthy();

        expect(articleServiceMock.getArticles).toHaveBeenCalled();
        expect(categoryServiceMock.getCategories).toHaveBeenCalled();

        tick();

        expect(component.getArticles.length).toBe(1);
        expect(component.getArticles[0].title).toBe('Test Article');

        expect(component.getCategories.length).toBe(1);
        expect(component.getCategories[0].name).toBe('Category 1');

        expect(component.getAppliedFilter.length).toBe(0);
    }));

    it('should toggle sorting state on changingIsSorting call', () => {
        expect(component.getIsSorting).toBeFalse();

        component.changingIsSortingFn();
        expect(component.getIsSorting).toBeTrue();

        component.changingIsSortingFn();
        expect(component.getIsSorting).toBeFalse();
    });

    it('should update activeParams and navigate on filter change', () => {
        const category = { url: 'cat1', isChange: false } as CategoryType;

        component.setActiveParams = { categories: [] };
        component.filterFn(category);

        expect(category.isChange).toBeTrue();
        expect(component.getActiveParams.categories).toContain('cat1');
        expect(component.getActiveParams.page).toBe(1);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/blog'], {
            queryParams: component.getActiveParams,
            replaceUrl: true
        });
    });

    it('should process query params correctly', () => {
        const params = { categories: ['cat1', 'cat2'], page: '2' };
        const result = (component as any).processParams(params);
        expect(result.categories).toEqual(['cat1', 'cat2']);
        expect(result.page).toBe(2);
    });

    it('should navigate to correct page on openPage', () => {
        component.setActiveParams = { categories: [], page: 1 };
        component.openPageFn(3);
        expect(component.getActiveParams.page).toBe(3);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/blog'], {
            queryParams: component.getActiveParams,
            replaceUrl: true
        });
    });


    it('should open next page if possible', () => {
        component.setPages = [1, 2, 3];
        component.setActiveParams = { categories: [], page: 1 };
        component.openNextPageFn();
        expect(component.getActiveParams.page).toBe(2);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/blog'], {
            queryParams: component.getActiveParams,
            queryParamsHandling: 'merge'
        });
    });

    it('should not open next page if on last page', () => {
        component.setPages = [1, 2];
        component.setActiveParams = { categories: [], page: 2 };
        component.openNextPageFn();
        expect(component.getActiveParams.page).toBe(2);
        expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should open previous page if possible', () => {
        component.setActiveParams = { categories: [], page: 2 };
        component.openPrevPageFn();
        expect(component.getActiveParams.page).toBe(1);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/blog'], {
            queryParams: component.getActiveParams
        });
    });

    it('should not open previous page if on first page', () => {
        component.setActiveParams = { categories: [], page: 1 };
        component.openPrevPageFn();
        expect(component.getActiveParams.page).toBe(1);
        expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should delete filter option and call filter', () => {
        spyOn(component as any, 'filter').and.callThrough();
        component.setCategories = [{ id: '1', name: 'Category 1', url: 'cat1', isChange: true } as CategoryType];
        const deleteFilterOptionFn = component.deleteFilterOptionFn;
        deleteFilterOptionFn('cat1');
        expect((component as any).filter).toHaveBeenCalledWith(component.getCategories[0]);
    });
});