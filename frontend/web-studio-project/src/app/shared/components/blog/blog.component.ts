import {Component, OnInit} from '@angular/core';
import {ArticleService} from '../../services/article.service';
import {ArticlesType, ArticleType} from '../../../types/article.types';
import {CategoryType} from '../../../types/category.types';
import {CategoryService} from '../../services/category.service';
import {NgClass} from '@angular/common';
import {ActivatedRoute, Params} from '@angular/router';
import {ActiveParamTypes} from '../../../types/active-param.types';
import {debounceTime} from 'rxjs';

@Component({
  selector: 'app-blog',
  imports: [
    NgClass
  ],
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {

  protected articles: ArticleType[] = [];
  count: number = 0;
  page: number = 1;
  pages: number[] = [];
  protected categories: CategoryType[] = [];
  private activeParams: ActiveParamTypes = {categories: []}

  protected isSorting: boolean = false;

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        debounceTime(800)
      )
      .subscribe(params => {
        this.activeParams = this.processParams(params);
        this.activeParams.page = this.page;

        this.articleService.getArticles(this.activeParams)
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
            this.categories.forEach(category => {

              const findCategory= this.activeParams.categories?.includes(category.url);
              category.isChange = !!findCategory;
            });


          },
          error: (err) => {
            console.error('Failed to load categories', err);
          }
        });
      });

  }

  changingIsSorting() {
    this.isSorting = !this.isSorting;
  }

  filer(url: string) {


  }

  processParams(params: Params): ActiveParamTypes {
    const activeParams: ActiveParamTypes = {categories: []};
    if (params.hasOwnProperty('types')) {
      activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']]
    }
    return activeParams;
  }
}
