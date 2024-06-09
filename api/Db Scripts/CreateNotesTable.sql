use LMPlatform
create table Notes (
    Id int primary key identity not null,
    Text nvarchar(max),
    Date date not null,
    Time time not null,
    UserId int foreign key references Users(UserId),
    SubjectId int foreign key references Subjects(Id),
)
