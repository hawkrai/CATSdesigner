import { Injectable } from '@angular/core';
import { News } from '../models/news.model';
import { Attachment } from '../models/attachment.model';
import { Lecture } from '../models/lecture.model';
import { Calendar } from '../models/calendar.model';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor() {
  }

  public newsModelConverter(news: any): News {
    const newNews = new News();
    newNews.id = news.NewsId;
    newNews.title = news.Title;
    newNews.body = news.Body;
    newNews.dateCreate = news.DateCreate;
    newNews.disabled = news.Disabled;
    newNews.subjectId = news.SubjectId;
    return newNews;
  }

  public newsModelsConverter(news: any[]): News[] {
    return news.map(res => this.newsModelConverter(res));
  }

  private attachmentModelConverter(attachment: any): Attachment {
    const newAttachment = new Attachment();
    newAttachment.id = attachment.Id;
    newAttachment.attachmentType = attachment.AttachmentType;
    newAttachment.fileName = attachment.FileName;
    newAttachment.name = attachment.Name;
    newAttachment.pathName = attachment.PathName;
    return newAttachment;
  }

  public lectureModelConverter(lecture: any): Lecture {
    const newLecture = new Lecture();
    newLecture.id = lecture.LecturesId;
    newLecture.attachments = lecture.Attachments.map(attachment => this.attachmentModelConverter(attachment));
    newLecture.duration = lecture.Duration;
    newLecture.order = lecture.Order;
    newLecture.pathFile = lecture.PathFile;
    newLecture.subjectId = lecture.SubjectId;
    newLecture.theme = lecture.Theme;
    return newLecture;
  }

  public lecturesModelConverter(lectures: any[]): Lecture[] {
    return lectures.map(lecture => this.lectureModelConverter(lecture));
  }

  public calendarModelConverter(calendar: any): Calendar {
    const newCalendar = new Calendar();
    newCalendar.id = calendar.Id;
    newCalendar.date = calendar.Date;
    newCalendar.subjectId = calendar.SabjectId;
    return newCalendar;
  }

  public calendarModelsConverter(calendar: any[]): Calendar[] {
    return calendar.map(res => this.calendarModelConverter(res));
  }
}
