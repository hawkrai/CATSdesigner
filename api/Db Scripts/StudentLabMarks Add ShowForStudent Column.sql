
alter table StudentLabMarks
add ShowForStudent bit

update StudentLabMarks
set StudentLabMarks.ShowForStudent = 0