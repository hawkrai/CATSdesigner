USE LMPlatform

ALTER TABLE DiplomProjects
ADD ComputerConsultant NVARCHAR(MAX) NULL

GO

ALTER TABLE DiplomProjects
ADD HealthAndSafetyConsultant NVARCHAR(MAX) NULL

GO

ALTER TABLE DiplomProjects
ADD EconimicsConsultant NVARCHAR(MAX) NULL
GO

ALTER TABLE DiplomProjects
ADD NormocontrolConsultant NVARCHAR(MAX) NULL
GO

ALTER TABLE DiplomProjects
ADD DecreeNumber NVARCHAR(MAX) NULL
GO

ALTER TABLE DiplomProjects
ADD DecreeDate DATE NULL
GO