use LMPlatform
CREATE INDEX IX_SubjectLecturers_Owner
ON SubjectLecturers (Owner);
go
ALTER TABLE SubjectLecturers
ADD constraint FK_SubjectLecturers_Lecturers_Owner
FOREIGN KEY (Owner) REFERENCES Lecturers(Id);