IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[Tests]')
      AND name = N'EumkRootConceptId'
)
BEGIN
    ALTER TABLE [dbo].[Tests]
    ADD [EumkRootConceptId] INT NULL;

    ALTER TABLE [dbo].[Tests]
    ADD CONSTRAINT [FK_Tests_EumkRootConcept]
        FOREIGN KEY ([EumkRootConceptId]) REFERENCES [dbo].[Concept]([Id]);
END
GO
