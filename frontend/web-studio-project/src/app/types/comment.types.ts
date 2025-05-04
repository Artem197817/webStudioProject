import {UserType} from './user.types';

export interface CommentType {
  id: string;
  text: string;
  date: string;
  likesCount: number;
  dislikesCount: number;
  user: UserType;
  formattedDate?: string;
}

export type CommentRequestType = {
  offset?: number,
  article: string
}
export type CommentResponseType = {
  allCount: number,
  comments: CommentType[],
}
export type AddCommentRequestType = {
  text: string,
  article: string
}

