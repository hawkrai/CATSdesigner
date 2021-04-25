USE LMPlatform

ALTER TABLE AssignedDiplomProjects
ADD LecturerName NVARCHAR(MAX) NULL

GO

ALTER TABLE AssignedDiplomProjects
ADD Comment NVARCHAR(MAX) NULL

GO

ALTER TABLE AssignedDiplomProjects
ADD MarkDate DATE NULL
GO