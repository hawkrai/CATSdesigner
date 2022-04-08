use LMPlatform
ALTER TABLE [dbo].LecturesScheduleVisitings
Add LecturerId int null 
CONSTRAINT FK_LecturesScheduleVisitings_Lecturers_LecturerId  DEFAULT(null)
FOREIGN KEY (LecturerId) REFERENCES [dbo].Lecturers(Id);
go
CREATE INDEX IX_LecturesScheduleVisitings_LecturerId
ON [dbo].LecturesScheduleVisitings (LecturerId);
go
ALTER TABLE [dbo].ScheduleProtectionLabs
Add LecturerId int null 
CONSTRAINT FK_ScheduleProtectionLabs_Lecturers_LecturerId  DEFAULT(null)
FOREIGN KEY (LecturerId) REFERENCES [dbo].Lecturers(Id);
go
CREATE INDEX IX_ScheduleProtectionLabs_LecturerId
ON [dbo].LecturesScheduleVisitings (LecturerId);
go
ALTER TABLE [dbo].ScheduleProtectionPracticals
Add LecturerId int null 
CONSTRAINT FK_ScheduleProtectionPracticals_Lecturers_LecturerId  DEFAULT(null)
FOREIGN KEY (LecturerId) REFERENCES [dbo].Lecturers(Id);
go
CREATE INDEX IX_ScheduleProtectionPracticals_LecturerId
ON [dbo].LecturesScheduleVisitings (LecturerId);