import {Component, OnInit} from '@angular/core';
import {ArticleService} from '../../services/article.service';
import {ArticlesType, ArticleType} from '../../../types/article.types';
import {CategoryType} from '../../../types/category.types';
import {CategoryService} from '../../services/category.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ActiveParamTypes} from '../../../types/active-param.types';
import {Subject, takeUntil} from 'rxjs';
import {ArticleCardComponent} from '../article-card/article-card.component';

@Component({
  selector: 'app-blog',
  imports: [
    ArticleCardComponent
  ],
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {

  protected articles: ArticleType[] = [];
  private count: number = 0;
  private page: number = 1;
  protected pages: number[] = [];
  protected categories: CategoryType[] = [];
  protected activeParams: ActiveParamTypes = {categories: []};
  protected appliedFilter: { name: string, url: string }[] = [];
  protected isSorting: boolean = false;
  private destroy$ = new Subject<void>();


  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
  ) {
  }

  public ngOnInit(): void {

    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.activeParams = this.processParams(params);

        this.articleService.getArticles(this.activeParams)
          .subscribe((data: ArticlesType) => {
            this.articles = data.items;
            this.count = data.count;
            this.pages = Array.from({length: data.pages}, (_, i) => i + 1);
          });

        if (this.categories.length === 0) {
          this.categoryService.getCategories().subscribe({
            next: (data) => {
              this.categories = data;
              this.categories.forEach(category => {
                category.isChange = this.activeParams.categories?.includes(category.url) ?? false;
                this.appliedFilter = [];
                this.categories.forEach(category => {
                  if (category.isChange) {
                    this.appliedFilter.push({name: category.name, url: category.url});
                  }
                })
              });
            },
            error: (err) => {
              console.error('Failed to load categories', err);
            }
          });

        } else {
          this.appliedFilter = [];
          this.categories.forEach(category => {
            if (category.isChange) {
              this.appliedFilter.push({name: category.name, url: category.url});
            }
          })
        }
      });
    if (!this.activeParams.page) {
      this.activeParams.page = this.page;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected changingIsSorting(event?: MouseEvent) {
    event?.stopPropagation();
    this.isSorting = !this.isSorting;
  }

  protected filter(category: CategoryType) {
    category.isChange = !category.isChange;

    let newCategories = this.activeParams.categories ? [...this.activeParams.categories] : [];

    if (category.isChange) {
      if (!newCategories.includes(category.url)) {
        newCategories = [...newCategories, category.url];
      }
    } else {
      newCategories = newCategories.filter(url => url !== category.url);
    }

    this.activeParams = {
      ...this.activeParams,
      categories: newCategories,
      page: 1
    };


    this.router.navigate(['/blog'], {
      queryParams: this.activeParams,
      replaceUrl: true
    });
  }

  private processParams(params: Params): ActiveParamTypes {
    const activeParams: ActiveParamTypes = {categories: []};
    if (params.hasOwnProperty('categories')) {
      activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
    }
    if (params.hasOwnProperty('page')) {
      activeParams.page = +params['page'];
    }
    return activeParams;
  }

  protected openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams,
      replaceUrl: true
    });
  }

  protected openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams, queryParamsHandling: 'merge'
      });
    }
  }

  protected openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  protected deleteFilterOption(url: string) {
    const findCategory = this.categories.find(item => item.url === url);
    if (findCategory) {
      this.filter(findCategory);
    }
  }
}
