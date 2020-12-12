ALTER TABLE Modules
ADD Required bit NOT NULL DEFAULT (0)

update Modules
set Modules.Required=1
where Id in (1,5)