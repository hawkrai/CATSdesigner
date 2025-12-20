ALTER TABLE dbo.ScheduleProtectionPracticals
ADD SubGroupId INT NULL;
GO

ALTER TABLE dbo.ScheduleProtectionPracticals
ADD CONSTRAINT FK_ScheduleProtectionPracticals_SubGroups
FOREIGN KEY (SubGroupId)
REFERENCES dbo.SubGroups(Id);
GO