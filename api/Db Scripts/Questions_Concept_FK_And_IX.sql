use LMPlatform
ALTER TABLE [dbo].[Questions]
ADD CONSTRAINT FK_Questions_Concepts
FOREIGN KEY (ConceptId) REFERENCES [dbo].Concept(Id) on delete cascade
go
CREATE INDEX IX_Questions_ConceptId ON [dbo].[Questions] (ConceptId);