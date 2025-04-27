import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {SharedUtilInfoService} from '../../utils/shared-util-info.service';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';
import {provideAnimations} from '@angular/platform-browser/animations';
import {ArticleType} from '../../../types/article.types';
import {ArticleService} from '../../services/article.service';
import {ArticleCardComponent} from '../article-card/article-card.component';


@Component({
  selector: 'app-main',
  imports: [
    CarouselModule,
    ArticleCardComponent,
  ],
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    provideAnimations()  // подключаем анимации
  ]
})
export class MainComponent implements OnInit{
 protected reviews = SharedUtilInfoService.review;
  protected customOptionsReviews: OwlOptions =  {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    margin: 20,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },

      940: {
        items: 3
      }
    },
    nav: false
  }
  protected articlesPopular: ArticleType[] = [];

  constructor(private articleService: ArticleService)  {}

  ngOnInit(): void {
    this.articleService.getArticlePopular()
      .subscribe(data =>{
        this.articlesPopular = data;
      })
  }
}
