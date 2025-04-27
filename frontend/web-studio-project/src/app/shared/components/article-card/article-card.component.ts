import {Component, Input, OnInit} from '@angular/core';
import {ArticleType} from '../../../types/article.types';
import {ArticleService} from '../../services/article.service';
import {environment} from '../../../../environments/environment';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'article-card',
  imports: [
    RouterLink
  ],
  standalone: true,
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss'
})
export class ArticleCardComponent implements OnInit{

  @Input() article!: ArticleType;

  protected serverStaticPath: string = environment.serverStaticPath;
  ngOnInit(): void {
  }



}
