alter table Notes
drop constraint FK__Notes__SubjectId__4727812E
alter table Notes
drop column SubjectId



alter table Notes
add LecturesScheduleId int null foreign key references LecturesScheduleVisitings(Id),
    LabsScheduleId int null foreign key references ScheduleProtectionLabs(Id),
    PracticalScheduleId int null foreign key references ScheduleProtectionPracticals(Id)

select Id from Practicals where SubjectId = 4112