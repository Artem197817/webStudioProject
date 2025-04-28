import {Component, OnInit} from '@angular/core';
import {ArticleService} from '../../services/article.service';
import {ArticlesType, ArticleType} from '../../../types/article.types';
import { CategoryType} from '../../../types/category.types';
import {CategoryService} from '../../services/category.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-blog',
  imports: [
    NgClass
  ],
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit{

  protected articles: ArticleType[] = [];
  count: number = 0;
  page: number = 1;
  pages: number[] = [];
  protected categories: CategoryType[];

  protected isSorting: boolean = false;
  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              ) {}

  ngOnInit(): void {
    this.articleService.getArticles()
      .subscribe((data: ArticlesType) => {
        this.articles = data.items;
        this.count = data.count;
        for (let index = 0; index < data.pages; index++) {
          this.pages.push(index + 1)
        }
      });

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.categories.forEach(category => category.isChange = false);
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  changingIsSorting() {
    this.isSorting = !this.isSorting;
  }

  sort(url: string) {

  }
}
