USE LMPlatform

ALTER TABLE AssignedCourseProjects
ADD LecturerName NVARCHAR(MAX)

GO

ALTER TABLE AssignedCourseProjects
ADD Comment NVARCHAR(MAX)

GO

ALTER TABLE AssignedCourseProjects
ADD MarkDate DATE
GO