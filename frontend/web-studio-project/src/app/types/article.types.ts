import {CommentType} from './comment.types';

export interface ArticleType {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  url: string;
  text?: string;
  comments?: CommentType[];
  commentsCount?: number;


}

export interface ArticlesType {
  count: number;
  pages: number;
  items: ArticleType[];
}
