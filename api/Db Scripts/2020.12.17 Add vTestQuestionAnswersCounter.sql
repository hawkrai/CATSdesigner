--########################################################################################################################################
--#
--# View: [vTestQuestionAnswersCounter]			 
--# 											 
--# Purpose: To populate how much positive/negative answers are for question
--#						
--# Revision History
--#	DATE		INITIALS	DESCRIPTION
--#	==========	========	===========
--# 28/11/2020 	AT			Initial creation
--########################################################################################################################################

CREATE VIEW [dbo].[vTestQuestionAnswersCounter]
AS 
  SELECT q.Id
	,Result
	,COUNT(*) As AnswersCount
  FROM TestQuestionPassResults tqpr
  JOIN Questions q ON q.TestId = tqpr.TestId 
			AND q.QuestionNumber = tqpr.QuestionNumber
  GROUP BY q.Id, Result