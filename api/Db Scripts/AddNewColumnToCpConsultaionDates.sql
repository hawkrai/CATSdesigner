use LMPlatform
alter table CourseProjectConsultationDates
add StartTime time null,
    EndTime time null,
    Building nvarchar(5) null,
    Audience nvarchar(5) null