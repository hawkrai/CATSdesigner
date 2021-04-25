use LMPlatform
create table JobProtections
(
    Id int identity primary key,
    LabId int null foreign key references Labs(Id),
    IsReturned bit,
    IsReceived bit,
    StudentId int not null foreign key references Students(UserId)
);