import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ArticlesType, ArticleType} from '../../types/article.types';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ActiveParamTypes} from '../../types/active-param.types';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) {
  }

  public getArticlePopular(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top')
  }

  public getArticles(params: ActiveParamTypes): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(environment.api + 'articles', {params: params})

  }

  public getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles' + '/' + url);
  }

  public getArticleRelated(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related' + '/' + url);
  }
}
