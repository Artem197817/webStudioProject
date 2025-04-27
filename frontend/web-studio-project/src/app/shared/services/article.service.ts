import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ArticlesType, ArticleType} from '../../types/article.types';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getArticlePopular(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top')
  }

  getArticles(): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(environment.api + 'articles')

  }
}
