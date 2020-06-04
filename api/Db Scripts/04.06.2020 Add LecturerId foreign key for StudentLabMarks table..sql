USE LMPlatform

ALTER TABLE StudentLabMarks
ADD LecturerId INT

GO

ALTER TABLE StudentLabMarks
ADD FOREIGN KEY (LecturerId) REFERENCES Lecturers(Id)