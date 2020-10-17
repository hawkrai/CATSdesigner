CREATE TABLE [LMPlatform].[dbo].[DocumentSubjects] (
	-- Foreign keys
	DocumentId INT,
	FOREIGN KEY (DocumentId) REFERENCES Documents (Id),

	SubjectId INT,
	FOREIGN KEY (SubjectId) REFERENCES Subjects (Id),
);