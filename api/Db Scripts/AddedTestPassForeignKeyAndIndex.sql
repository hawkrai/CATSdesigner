use LMPlatform
DELETE FROM [dbo].[TestPassResults]
WHERE TestId not in (SELECT Id from [dbo].[Tests])
go
ALTER TABLE [dbo].[TestPassResults]
ADD CONSTRAINT FK__TestPassResults__TestId
FOREIGN KEY (TestId) REFERENCES [dbo].[Tests](Id)
ON DELETE CASCADE;
go
CREATE INDEX IX_TestPassResults_TestId
ON [dbo].[TestPassResults] (TestId)
