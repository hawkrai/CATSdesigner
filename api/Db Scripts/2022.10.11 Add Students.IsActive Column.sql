USE LMPlatform
GO

ALTER TABLE Students
ADD IsActive BIT
GO

UPDATE Students
SET IsActive = 1