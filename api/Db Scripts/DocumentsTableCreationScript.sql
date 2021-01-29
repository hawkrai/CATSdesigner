CREATE TABLE [LMPlatform].[dbo].[Documents] (
	Id INT PRIMARY KEY IDENTITY (1,1),
	ParentOrder INT NOT NULL,
	Name NVARCHAR(2048) NOT NULL,
	Text NVARCHAR(MAX),

	-- Foreign keys
	ParentId INT,
	FOREIGN KEY (ParentId) REFERENCES Documents (Id),

	UserId INT,
	FOREIGN KEY (UserId) REFERENCES Users (UserId),
);