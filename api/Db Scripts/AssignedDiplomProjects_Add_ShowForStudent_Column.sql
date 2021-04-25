alter table AssignedDiplomProjects
add ShowForStudent bit

GO
update AssignedDiplomProjects
set AssignedDiplomProjects.ShowForStudent = 0