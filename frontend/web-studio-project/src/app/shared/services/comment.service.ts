import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CategoryType} from '../../types/category.types';
import {ActiveParamTypes} from '../../types/active-param.types';
import {ArticlesType} from '../../types/article.types';
import {AddCommentRequestType, CommentRequestType, CommentResponseType} from '../../types/comment.types';
import {DefaultResponseType} from '../../types/default-response.types';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {}

  addComment(comment: AddCommentRequestType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', comment);
  }
  
  getComments(params: CommentRequestType): Observable<CommentResponseType> {
    return this.http.get<CommentResponseType>(environment.api + 'comments', { params });
  }

  }

