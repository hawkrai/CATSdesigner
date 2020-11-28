USE LMPlatform

ALTER TABLE AssignedCourseProjects
ADD LecturerName NVARCHAR(MAX) NULL

GO

ALTER TABLE AssignedCourseProjects
ADD Comment NVARCHAR(MAX) NULL

GO

ALTER TABLE AssignedCourseProjects
ADD MarkDate DATE NULL
GO