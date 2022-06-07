CREATE TRIGGER Labs_DELETE_REORDER
ON [dbo].[Labs]
AFTER  DELETE
AS
    begin
    UPDATE [dbo].[Labs]
    SET [dbo].[Labs].[Order] = NewOrder
    FROM (SELECT ROW_NUMBER() OVER (
	partition by [dbo].[Labs].SubjectId ORDER BY [Order]
   ) as NewOrder, [dbo].[Labs].SubjectId, Id from [dbo].[Labs]
    inner join (select SubjectId from deleted GROUP BY SubjectId) as LSI
    on [dbo].[Labs].SubjectId = LSI.SubjectId) as LLNO
    where [dbo].[Labs].SubjectId = LLNO.SubjectId and [dbo].[Labs].Id = LLNO.Id
end;
