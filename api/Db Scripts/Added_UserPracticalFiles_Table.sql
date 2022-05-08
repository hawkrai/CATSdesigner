use LMPlatform;
ALTER TABLE [dbo].[UserLabFiles]
ADD  PracticalId int null FOREIGN KEY REFERENCES Practicals(Id)
go
CREATE INDEX IX_UserLabFiles_PracticalId
ON [dbo].[UserLabFiles] (PracticalId);