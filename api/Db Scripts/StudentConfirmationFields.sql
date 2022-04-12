use LMPlatform
ALTER TABLE [dbo].Students 
ADD ConfirmedAt datetime DEFAULT(null),
ConfirmedById int null CONSTRAINT FK_Students_Lecturers_ConfirmedBy DEFAULT(null)
FOREIGN KEY (ConfirmedById) REFERENCES [dbo].Lecturers
go
CREATE INDEX IX_Students_ConfirmedById
ON [dbo].Students (ConfirmedById);