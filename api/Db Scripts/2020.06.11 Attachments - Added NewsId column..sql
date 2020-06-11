USE LMPlatform

ALTER TABLE Attachments
ADD SubjectNews_Id INT NULL

GO

ALTER TABLE Attachments
ADD FOREIGN KEY (SubjectNews_Id) REFERENCES SubjectNewses(Id)