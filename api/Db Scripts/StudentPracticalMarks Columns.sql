use LMPlatform
alter table StudentPracticalMarks
add Comment varchar(max) ,
    Date varchar(max),
    LecturerId int null foreign key references Lecturers(Id),
    ShowForStudent bit
