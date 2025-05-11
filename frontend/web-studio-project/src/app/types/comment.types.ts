import {UserType} from './user.types';
import {CommentActionTypes} from './comment-action.types';

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

export type CommentActionResponseType = {
  comment: string,
  action: CommentActionTypes
}

