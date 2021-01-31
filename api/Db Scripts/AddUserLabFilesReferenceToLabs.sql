use LMPlatform
alter table UserLabFiles
add LadId int null foreign key references Labs(Id)