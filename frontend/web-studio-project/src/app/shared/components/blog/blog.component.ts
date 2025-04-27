import {Component, OnInit} from '@angular/core';
import {ArticleService} from '../../services/article.service';
import {ArticlesType, ArticleType} from '../../../types/article.types';

@Component({
  selector: 'app-blog',
  imports: [],
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit{

  protected articles: ArticleType[] = [];
  count: number = 0;
  pages: number = 0;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticles()
    .subscribe((data: ArticlesType)=>{
      this.articles = data.items;
      this.count = data.count;
      this.pages = data.pages;
    })
  }

}
