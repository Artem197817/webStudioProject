import {Component, Input} from '@angular/core';
import {ArticleType} from '../../../types/article.types';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';
import {TruncateTextPipe} from '../../utils/truncate-text.pipe';


@Component({
  selector: 'article-card',
  imports: [
    TruncateTextPipe
  ],
  standalone: true,
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss'
})
export class ArticleCardComponent {

  @Input() article!: ArticleType;

  protected serverStaticPath: string = environment.serverStaticPath;

  constructor(private router: Router) {
  }


  protected navigate(url: string) {
    this.router.navigate(['article/' + url])
  }
}
