use LMPlatform
if exists (select 1
            from   INFORMATION_SCHEMA.COLUMNS
            where  TABLE_NAME = 'Users'
                    AND COLUMN_NAME = 'Attendance'
                    AND TABLE_SCHEMA='dbo')
begin
    alter table [dbo].[Users]
    drop column Attendance
end
go
create table [dbo].[Attendances] (
Id int primary key IDENTITY(1,1),
Login datetime,
UserId int references [dbo].[Users](UserId) ON DELETE CASCADE
)
go
create index IX_Attendances_UserId
on [dbo].[Attendances](UserId)
