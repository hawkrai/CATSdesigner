;WITH ConceptRoots AS (
    SELECT
        c.[Id] AS ConceptId,
        c.[Id] AS RootId
    FROM [dbo].[Concept] AS c
    WHERE c.[ParentId] IS NULL

    UNION ALL

    SELECT
        child.[Id],
        roots.RootId
    FROM [dbo].[Concept] AS child
    INNER JOIN ConceptRoots AS roots
        ON child.[ParentId] = roots.ConceptId
)
UPDATE tests
SET tests.[EumkRootConceptId] = roots.RootId
FROM [dbo].[Tests] AS tests
CROSS APPLY (
    SELECT TOP (1)
        question.[ConceptId]
    FROM [dbo].[Questions] AS question
    WHERE question.[TestId] = tests.[Id]
      AND question.[ConceptId] IS NOT NULL
) AS question
INNER JOIN ConceptRoots AS roots
    ON roots.ConceptId = question.[ConceptId]
WHERE (tests.[BeforeEUMK] = 1 OR tests.[ForEUMK] = 1)
  AND tests.[EumkRootConceptId] IS NULL
OPTION (MAXRECURSION 0);
GO
