import {Action} from "@ngrx/store";
import {News} from "../../models/news.model";

export enum ENewsActions {
  LOAD_NEWS = '[News] Load News',
  CREATE_NEWS = '[News] Create News',
  UPDATE_NEWS = '[News] Update News',
  DELETE_NEWS_BY_ID = '[News] Delete News By Id',
  DISABLE_ALL_NEWS = '[News] Disable All News',
  ENABLE_ALL_NEWS = '[News] Enable All News',
  SET_NEWS = '[News] Set News',
}

export class LoadNews implements Action {
  public readonly type = ENewsActions.LOAD_NEWS;
}

export class SetNews implements Action{
  public readonly type = ENewsActions.SET_NEWS;

  constructor(public payload: News[]) {}
}

export class CreateNews implements Action{
  public readonly type = ENewsActions.CREATE_NEWS;

  constructor(public payload: News) {}
}

export class UpdateNews implements Action{
  public readonly type = ENewsActions.UPDATE_NEWS;

  constructor(public payload: News) {}
}

export class DeleteNewsById implements Action{
  public readonly type = ENewsActions.DELETE_NEWS_BY_ID;

  constructor(public payload: string) {}
}

export class DisableAllNews implements Action{
  public readonly type = ENewsActions.DISABLE_ALL_NEWS;
}

export class EnableAllNews implements Action{
  public readonly type = ENewsActions.ENABLE_ALL_NEWS;
}

export type NewsActions =
  LoadNews
  | SetNews
  | SetNews
  | CreateNews
  | UpdateNews
  | DisableAllNews
  | DeleteNewsById
  | EnableAllNews;
