USE educatsb_LMPlatform_FITR
GO
CREATE TABLE [dbo].[Notes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Text] [nvarchar](max) NULL,
	[UserId] [int] NULL,
	[SubjectId] [int] NULL,
	[LecturesScheduleId] [int] NULL,
	[LabsScheduleId] [int] NULL,
	[PracticalScheduleId] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Notes] ADD PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Notes]  WITH CHECK ADD FOREIGN KEY([LabsScheduleId])
REFERENCES [dbo].[ScheduleProtectionLabs] ([Id])
GO
ALTER TABLE [dbo].[Notes]  WITH CHECK ADD FOREIGN KEY([LecturesScheduleId])
REFERENCES [dbo].[LecturesScheduleVisitings] ([Id])
GO
ALTER TABLE [dbo].[Notes]  WITH CHECK ADD FOREIGN KEY([PracticalScheduleId])
REFERENCES [dbo].[ScheduleProtectionPracticals] ([Id])
GO
ALTER TABLE [dbo].[Notes]  WITH CHECK ADD FOREIGN KEY([SubjectId])
REFERENCES [dbo].[Subjects] ([Id])
GO
ALTER TABLE [dbo].[Notes]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])