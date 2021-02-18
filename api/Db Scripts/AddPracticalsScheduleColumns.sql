use LMPlatform
alter table ScheduleProtectionPracticals
add StartTime time null,
    EndTime time null,
    Building nvarchar(5) null,
    Audience nvarchar(5) null