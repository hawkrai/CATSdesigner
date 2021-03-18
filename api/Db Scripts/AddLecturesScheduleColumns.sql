use LMPlatform
alter table LecturesScheduleVisitings
add StartTime nvarchar(5) null,
    EndTime nvarchar(5) null,
    Building nvarchar(5) null,
    Audience nvarchar(5) null;