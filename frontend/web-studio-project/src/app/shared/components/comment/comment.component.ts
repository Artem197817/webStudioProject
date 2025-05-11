import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AuthService} from '../../../core/auth/auth.service';
import {ArticleType} from '../../../types/article.types';
import {CommentService} from '../../services/comment.service';
import {CommentActionResponseType, CommentResponseType, CommentType} from '../../../types/comment.types';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommentActionTypes} from '../../../types/comment-action.types';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit, OnChanges {

  @Input() article!: ArticleType;

  protected isLoggedIn = false;
  protected allCountComments: number = 0;
  protected comments: CommentType[] = [];
  protected minCountComments: number = 0;
  protected newCommentText: string = '';
  private commentUserActions: CommentActionResponseType[] = [];
  private stepCountComments: number = 10;
  private isFirstRequest: boolean = true;

  constructor(private authService: AuthService,
              private commentService: CommentService,
              readonly snackBar: MatSnackBar,
  ) {
  }

  public ngOnInit(): void {
    this.isLoggedIn = this.authService.getisLoggedIn();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['article'] && this.article) {
      this.resetCommentsState();
      this.loadInitialComments();
    }
  }

  private resetCommentsState(): void {
    this.comments = [];
    this.minCountComments = 0;
    this.isFirstRequest = true;
    this.allCountComments = 0;
    this.commentUserActions = [];
  }


  private loadInitialComments(): void {
    if (this.article.comments && this.article.comments.length > 0) {
      this.comments = this.article.comments;
      this.comments.forEach(comment => {
        comment.formattedDate = this.transformationDate(comment.date);
      });
      this.commentService.getComments({offset: 0, article: this.article.id})
        .subscribe((data: CommentResponseType) => {
          this.allCountComments = data.allCount;
        });
      this.getAction();
    }
  }


  private getAction(): void {
    if (this.comments && this.comments.length > 0) {
      this.commentService.getUserCommentAction(this.article.id)
        .subscribe((data: CommentActionResponseType[]) => {
          if (data && data.length > 0) {
            this.commentUserActions = data;
            this.comments.forEach(comment => {
              const commentAction = this.commentUserActions.find(item => item.comment === comment.id);
              if (commentAction) {
                switch (commentAction.action) {
                  case CommentActionTypes.like: {
                    comment.isLike = true;
                    break;
                  }
                  case CommentActionTypes.dislike: {
                    comment.isDislike = true;
                    break;
                  }
                  case CommentActionTypes.violate: {
                    comment.isViolate = true;
                    break;
                  }
                }
              }
            });
          }
        });
    }
  }

  private transformationDate(commentDate: string): string {
    const date = new Date(commentDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  protected publishComment() {
    if (this.newCommentText && this.newCommentText.length > 10 && this.article.id) {
      this.commentService.addComment({text: this.newCommentText, article: this.article.id})
        .subscribe(() => {
          this.newCommentText = '';
          this.commentService.getComments({offset: 0, article: this.article.id})
            .subscribe((data: CommentResponseType) => {
              data.comments[0].formattedDate = this.transformationDate(data.comments[0].date);
              this.comments.unshift(data.comments[0])
              this.getAction();
            });
        })
    }
  }

  protected addMoreComments(): void {
    if (this.isFirstRequest) {
      this.comments = [];
    }
    this.commentService.getComments({offset: this.minCountComments, article: this.article.id})
      .subscribe((data: CommentResponseType) => {
        data.comments.forEach(comment => {
          comment.formattedDate = this.transformationDate(comment.date);
          this.comments.push(comment);
        });
        this.getAction();
        this.isFirstRequest = false;
      });
    if (this.allCountComments > this.minCountComments) {
      this.minCountComments += this.stepCountComments;
    }
  }

  protected addLike(comment: CommentType) {
    comment.isDislike = false;
    comment.isViolate = false;
    if (comment.isLike) {
      this.commentService.applyAction(comment.id, CommentActionTypes.like)
        .subscribe(() => {
          this.snackBar.open('Ваш голос учтен');
          comment.isLike = false;
          comment.likesCount--;
        });
      return;
    }
    this.commentService.applyAction(comment.id, CommentActionTypes.like)
      .subscribe(() => {
        this.snackBar.open('Ваш голос учтен');
        comment.isLike = true;
        comment.likesCount++;
      });
  }

  protected addDislike(comment: CommentType) {
    comment.isLike = false;
    comment.isViolate = false;
    if (comment.isDislike) {
      this.commentService.applyAction(comment.id, CommentActionTypes.dislike)
        .subscribe(() => {
          this.snackBar.open('Ваш голос учтен');
          comment.isDislike = false;
          comment.dislikesCount--;
        });
      return;
    }
    this.commentService.applyAction(comment.id, CommentActionTypes.dislike)
      .subscribe(() => {
        this.snackBar.open('Ваш голос учтен');
        comment.isDislike = true;
        comment.dislikesCount++;
      });
  }

  protected addViolate(comment: CommentType) {
    if (comment.isViolate) {
      this.snackBar.open('Жалоба уже отправлена');
      return;
    }
    comment.isLike = false;
    comment.isDislike = false;

    this.commentService.applyAction(comment.id, CommentActionTypes.dislike)
      .subscribe(() => {
        this.snackBar.open('Жалоба отправлена');
        comment.isViolate = true;
      });
  }
}
