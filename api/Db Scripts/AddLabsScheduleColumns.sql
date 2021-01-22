use LMPlatform
alter table ScheduleProtectionLabs
add StartTime time null,
    EndTime time null,
    Building nvarchar(5) null,
    Audience nvarchar(5) null,
    SubjectId int null foreign key references Subjects(Id)
