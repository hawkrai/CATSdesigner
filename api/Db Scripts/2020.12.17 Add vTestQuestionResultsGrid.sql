--########################################################################################################################################
--#
--# View: [vTestQuestionResultsGrid]			 
--# 											 
--# Purpose: To get general view of each answers type count for each question
--#						
--# Revision History
--#	DATE		INITIALS	DESCRIPTION
--#	==========	========	===========
--# 28/11/2020 	AT			Initial creation
--########################################################################################################################################

CREATE VIEW [dbo].[vTestQuestionResultsGrid]
AS 
SELECT q.Id AS QuestionId, 
	MAX(vqcPos.AnswersCount) AS PositiveCount,	
	MAX(vqcNeg.AnswersCount) AS NegativeCount 
FROM Questions q
  JOIN vTestQuestionAnswersCounter vqcPos ON q.Id = vqcPos.Id
  JOIN vTestQuestionAnswersCounter vqcNeg ON q.Id = vqcNeg.Id
WHERE  vqcPos.Result = 1 AND vqcNeg.Result = 2
GROUP BY q.Id