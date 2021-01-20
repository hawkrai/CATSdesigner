alter table ScheduleProtectionLabMarks
add ShowForStudent bit

update ScheduleProtectionLabMarks
set ScheduleProtectionLabMarks.ShowForStudent = 0
