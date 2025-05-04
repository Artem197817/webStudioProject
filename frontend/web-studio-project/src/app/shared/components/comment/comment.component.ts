import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../core/auth/auth.service';
import {ArticleType} from '../../../types/article.types';
import {CommentService} from '../../services/comment.service';
import {CommentResponseType, CommentType} from '../../../types/comment.types';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

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
export class CommentComponent implements OnInit{

  @Input() article!: ArticleType;

  protected isLoggedIn = false;
  protected allCountComments: number = 0;
  protected comments: CommentType[] = [];
  protected minCountComments: number = 3;
  protected newCommentText: string = '';

  constructor(private authService: AuthService,
              private commentService: CommentService,
              ) {
  }
  ngOnInit(): void {
    this.isLoggedIn = this.authService.getisLoggedIn();
    this.commentService.getComments({offset: this.minCountComments, article: this.article.id})
      .subscribe((data: CommentResponseType) => {
        this.allCountComments = data.allCount;
        this.comments = data.comments;
        this.comments.forEach(comment => {
          comment.formattedDate = this.transformationDate(comment.date);
        });
      })
  }
  transformationDate(commentDate: string): string{
    const date = new Date(commentDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;

  }


  publishComment() {
    if(this.newCommentText && this.newCommentText.length > 10  && this.article.id){
      this.commentService.addComment({text: this.newCommentText, article: this.article.id})
        .subscribe()
    }

  }
}
