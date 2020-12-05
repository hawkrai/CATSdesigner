CREATE TABLE [dbo].[AdaptiveLearningProgress] (
    [Id]				INT IDENTITY (1, 1) NOT NULL,
    [UserId]			INT	 NOT NULL,
    [SubjectId]			INT	 NOT NULL,
    [ConceptId]			INT	 NOT NULL,
    [ThemaSolution]		INT	 NOT NULL,
    [FinalThemaResult]  INT	 NULL,
    [PassedDate]        DATE NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);