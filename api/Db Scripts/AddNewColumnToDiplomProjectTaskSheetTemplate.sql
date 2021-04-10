USE LMPlatform

ALTER TABLE [DiplomProjectTaskSheetTemplates]
ADD ComputerConsultant NVARCHAR(MAX) NULL

GO

ALTER TABLE [DiplomProjectTaskSheetTemplates]
ADD HealthAndSafetyConsultant NVARCHAR(MAX) NULL

GO

ALTER TABLE [DiplomProjectTaskSheetTemplates]
ADD EconimicsConsultant NVARCHAR(MAX) NULL
GO

ALTER TABLE [DiplomProjectTaskSheetTemplates]
ADD NormocontrolConsultant NVARCHAR(MAX) NULL
GO

ALTER TABLE [DiplomProjectTaskSheetTemplates]
ADD DecreeNumber NVARCHAR(MAX) NULL
GO

ALTER TABLE [DiplomProjectTaskSheetTemplates]
ADD DecreeDate DATE NULL
GO