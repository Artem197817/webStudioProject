import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ArticleService} from '../../services/article.service';
import {ArticleType} from '../../../types/article.types';
import {environment} from '../../../../environments/environment';
import {ArticleCardComponent} from '../article-card/article-card.component';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {CommentComponent} from '../comment/comment.component';

@Component({
  selector: 'app-article',
  imports: [
    RouterLink,
    ArticleCardComponent,
    CommentComponent
  ],
  standalone: true,
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {
  protected article!: ArticleType;
  protected serverStaticPath: string = environment.serverStaticPath;
  protected articles: ArticleType[] = [];
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private articleService: ArticleService,
              private sanitizer: DomSanitizer)  {
  }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(params => {
        this.articleService.getArticle(params['url'])
          .subscribe((data: ArticleType) => {
            this.article = data;
            if (this.article) {
              this.articleService.getArticleRelated(this.article.url)
                .subscribe((articles: ArticleType[] )=> {
                  this.articles = articles;
                })
            }
          })
      })
  }

  getSafeHtml(): SafeHtml {
    if(this.article && this.article.text){
      return this.sanitizer.bypassSecurityTrustHtml(this.article.text);
    }
   return this.sanitizer.bypassSecurityTrustHtml('');
  }

}
