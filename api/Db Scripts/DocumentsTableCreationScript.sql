CREATE TABLE [Documents] (
	Id INT PRIMARY KEY IDENTITY (1,1),
	ParentOrder INT NOT NULL,
	Name NVARCHAR(128) NOT NULL,
	Description NVARCHAR(256),
	Text NVARCHAR(MAX),

	-- Foreign keys
	ParentId INT,
	FOREIGN KEY (ParentId) REFERENCES Documents (Id),

	AuthorId INT NOT NULL,
	FOREIGN KEY (AuthorId) REFERENCES Users (UserId),

	SubjectId INT NOT NULL,
	FOREIGN KEY (SubjectId) REFERENCES Subjects (Id),

	GroupId INT NOT NULL,
	FOREIGN KEY (GroupId) REFERENCES Groups (Id)
);