create table UserNotes(
    Id int primary key IDENTITY(1, 1),
    Text nvarchar(max),
    Date date not null,
    StartTime time not null,
    EndTime time not null,
    UserId int foreign key references Users(UserId),
)