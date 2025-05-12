import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommentComponent } from './comment.component';
import { AuthService } from '../../../core/auth/auth.service';
import { CommentService } from '../../services/comment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { CommentActionTypes } from '../../../types/comment-action.types';

describe('CommentComponent', () => {
    let component: CommentComponent;
    let fixture: ComponentFixture<CommentComponent>;
    let authServiceMock: any;
    let commentServiceMock: any;
    let snackBarMock: any;
  
    beforeEach(async () => {
      authServiceMock = {
        getisLoggedIn: jasmine.createSpy('getisLoggedIn').and.returnValue(true)
      };
  
      commentServiceMock = {
        getComments: jasmine.createSpy('getComments').and.returnValue(of({
          allCount: 2,
          comments: [
            { id: 1, date: '2025-05-12T10:00:00Z', likesCount: 0, dislikesCount: 0 },
            { id: 2, date: '2025-05-12T11:00:00Z', likesCount: 1, dislikesCount: 0 }
          ]
        })),
        getUserCommentAction: jasmine.createSpy('getUserCommentAction').and.returnValue(of([
          { comment: 1, action: CommentActionTypes.like }
        ])),
        addComment: jasmine.createSpy('addComment').and.returnValue(of({})),
        applyAction: jasmine.createSpy('applyAction').and.returnValue(of({}))
      };
  
      snackBarMock = {
        open: jasmine.createSpy('open')
      };
  
      await TestBed.configureTestingModule({
        imports: [CommentComponent],  // standalone компонент в imports
        providers: [
          { provide: AuthService, useValue: authServiceMock },
          { provide: CommentService, useValue: commentServiceMock },
          { provide: MatSnackBar, useValue: snackBarMock }
        ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(CommentComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();  // триггерим жизненный цикл Angular
    });
  
    it('should create component and set isLoggedIn', () => {
      component.ngOnInit()
      expect(authServiceMock.getisLoggedIn).toHaveBeenCalled();
    });
  
    it('should add like to comment', fakeAsync(() => {
      const comment = {
        id: 1,
        isLike: false,
        isDislike: true,
        isViolate: false,
        likesCount: 0,
        dislikesCount: 1
      } as any;
  
      component.addLikeFn(comment);
      tick();
  
      expect(commentServiceMock.applyAction).toHaveBeenCalledWith(1, CommentActionTypes.like);
      expect(comment.isLike).toBeTrue();
      expect(comment.isDislike).toBeFalse();
      expect(comment.likesCount).toBe(1);
      expect(snackBarMock.open).toHaveBeenCalledWith('Ваш голос учтен');
    }));
  
    it('should remove like if already liked', fakeAsync(() => {
      const comment = {
        id: 1,
        isLike: true,
        isDislike: false,
        isViolate: false,
        likesCount: 1,
        dislikesCount: 0
      } as any;
  
      component.addLikeFn(comment);
      tick();
  
      expect(commentServiceMock.applyAction).toHaveBeenCalledWith(1, CommentActionTypes.like);
      expect(comment.isLike).toBeFalse();
      expect(comment.likesCount).toBe(0);
      expect(snackBarMock.open).toHaveBeenCalledWith('Ваш голос учтен');
    }));
  
    it('should add dislike to comment', fakeAsync(() => {
      const comment = {
        id: 2,
        isLike: true,
        isDislike: false,
        isViolate: false,
        likesCount: 1,
        dislikesCount: 0
      } as any;
  
      component.addDislikeFn(comment);
      tick();
  
      expect(commentServiceMock.applyAction).toHaveBeenCalledWith(2, CommentActionTypes.dislike);
      expect(comment.isDislike).toBeTrue();
      expect(comment.isLike).toBeFalse();
      expect(comment.dislikesCount).toBe(1);
      expect(snackBarMock.open).toHaveBeenCalledWith('Ваш голос учтен');
    }));
  
    it('should remove dislike if already disliked', fakeAsync(() => {
      const comment = {
        id: 2,
        isLike: false,
        isDislike: true,
        isViolate: false,
        likesCount: 0,
        dislikesCount: 1
      } as any;
  
      component.addDislikeFn(comment);
      tick();
  
      expect(commentServiceMock.applyAction).toHaveBeenCalledWith(2, CommentActionTypes.dislike);
      expect(comment.isDislike).toBeFalse();
      expect(comment.dislikesCount).toBe(0);
      expect(snackBarMock.open).toHaveBeenCalledWith('Ваш голос учтен');
    }));
  
    it('should add violate and prevent multiple complaints', fakeAsync(() => {
      const comment = {
        id: 3,
        isLike: false,
        isDislike: false,
        isViolate: false
      } as any;
  
      component.addViolateFn(comment);
      tick();
  
      expect(commentServiceMock.applyAction).toHaveBeenCalledWith(3, CommentActionTypes.dislike);
      expect(comment.isViolate).toBeTrue();
      expect(snackBarMock.open).toHaveBeenCalledWith('Жалоба отправлена');
  
      // Try to add violate again
      component.addViolateFn(comment);
      expect(snackBarMock.open).toHaveBeenCalledWith('Жалоба уже отправлена');
    }));
 

  it('should reset comments state on article change', () => {

    component.setComments = [{ id: 1 } as any];
    component.setMinCountComments = 5;
    component.setAllCountComments = 10;
    component.setCommentUserActions = [{ comment: '1', action: CommentActionTypes.like }];
    component.setIsFirstRequest = false;

    component.article = { id: 1, comments: [] } as any;
    component.ngOnChanges({
      article: {
        currentValue: component.article,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.getComments.length).toBe(0);
    expect(component.getMinCountComments).toBe(0);
    expect(component.getAllCountComments).toBe(0);
    expect(component.getCommentUserActions.length).toBe(0);
    expect(component.getIsFirstRequest).toBeTrue();
  });

  it('should load initial comments and get actions', fakeAsync(() => {
    component.article = {
      id: 1,
      comments: [
        { id: 1, date: '2025-05-12T10:00:00Z', likesCount: 0, dislikesCount: 0 }
      ]
    } as any;

    component.ngOnChanges({
      article: {
        currentValue: component.article,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    tick();

    expect(component.getComments.length).toBe(1);
    expect(component.getAllCountComments).toBe(2);
    expect(commentServiceMock.getComments).toHaveBeenCalledWith({ offset: 0, article: 1 });
    expect(commentServiceMock.getUserCommentAction).toHaveBeenCalledWith(1);
    expect(component.getComments[0].formattedDate).toBe('12.05.2025 10:00');
    expect(component.getComments[0].isLike).toBeTrue();
  }));

  it('should publish comment if text length > 10', fakeAsync(() => {
    component.article = { id: 1 } as any;
    component.setNewCommentText = 'This is a new comment!';
  
    component.publishCommentFn();
  
    expect(commentServiceMock.addComment).toHaveBeenCalledWith({ text: 'This is a new comment!', article: 1 });
  
    tick();
    expect(component.getNewCommentText).toBe('');
    expect(commentServiceMock.getComments).toHaveBeenCalledWith({ offset: 0, article: 1 });
  }));
});