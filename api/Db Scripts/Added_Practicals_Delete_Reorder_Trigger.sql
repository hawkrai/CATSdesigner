CREATE TRIGGER Practicals_DELETE_REORDER
ON [dbo].[Practicals]
AFTER  DELETE
AS
    begin
    UPDATE [dbo].[Practicals]
    SET [dbo].[Practicals].[Order] = NewOrder
    FROM (SELECT ROW_NUMBER() OVER (
	partition by [dbo].[Practicals].SubjectId ORDER BY [Order]
   ) as NewOrder, [dbo].[Practicals].SubjectId, Id from [dbo].[Practicals]
    inner join (select SubjectId from deleted GROUP BY SubjectId) as dSI
    on [dbo].[Practicals].SubjectId = dSI.SubjectId) as NOSII
    where [dbo].[Practicals].SubjectId = NOSII.SubjectId and [dbo].[Practicals].Id = NOSII.Id
end;
