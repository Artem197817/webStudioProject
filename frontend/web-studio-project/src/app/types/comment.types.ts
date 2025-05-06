import {UserType} from './user.types';

export interface CommentType {
  id: string;
  text: string;
  date: string;
  likesCount: number;
  dislikesCount: number;
  user: UserType;
  formattedDate?: string;
   isViolate?: boolean;
   isDislike?: boolean;
   isLike?: boolean;

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

