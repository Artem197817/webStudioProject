import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {
  AddCommentRequestType,
  CommentActionResponseType,
  CommentRequestType,
  CommentResponseType
} from '../../types/comment.types';
import {DefaultResponseType} from '../../types/default-response.types';
import {CommentActionTypes} from '../../types/comment-action.types';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  public addComment(comment: AddCommentRequestType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', comment);
  }

  public getComments(params: CommentRequestType): Observable<CommentResponseType> {
    return this.http.get<CommentResponseType>(environment.api + 'comments', {params});
  }

  public applyAction(commentId: string, type: CommentActionTypes): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {action: type});
  }

  public getUserCommentAction(articleId: string): Observable<CommentActionResponseType[]> {
    return this.http.get<CommentActionResponseType[]>(environment.api + 'comments/article-comment-actions?articleId=' + articleId);
  }

}


