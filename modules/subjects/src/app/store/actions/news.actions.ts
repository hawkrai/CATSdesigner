import {Action} from "@ngrx/store";
import {News} from "../../models/news.model";

export enum ENewsActions {
  GetNews = '[News] Get News List',
  SaveNews = '[News] Save News',
  DeleteNewsById = '[News] Delete News By Id',
  DisableAllNews = '[News] Disable All News',
  EnableAllNews = '[News] Enable All News',
  SetNews = '[News] Set News',
}

export class GetNews implements Action {
  public readonly type = ENewsActions.GetNews;
}

export class SetNews implements Action{
  public readonly type = ENewsActions.SetNews;

  constructor(public payload: News[]) {}
}

export class SaveNews implements Action{
  public readonly type = ENewsActions.SaveNews;

  constructor(public payload: News) {}
}

export class DeleteNewsById implements Action{
  public readonly type = ENewsActions.DeleteNewsById;

  constructor(public payload: string) {}
}

export class DisableAllNews implements Action{
  public readonly type = ENewsActions.DisableAllNews;
}

export class EnableAllNews implements Action{
  public readonly type = ENewsActions.EnableAllNews;
}

export type NewsActions =
  GetNews
  | SetNews
  | SetNews
  | DeleteNewsById
  | EnableAllNews;
