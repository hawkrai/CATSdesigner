--###############################################################################################################################
--#
--# Stored Procedure:	usp_Recalculate_TestQuestions_Complexity						 
--# 											 
--# Purpose: Recalculate complexity of test questions if needed
--#											 
--# Revision History:									
--# 28/11/2020	AT	Initial version	
--#
--###############################################################################################################################
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE dbo.usp_Recalculate_TestQuestions_Complexity 	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    UPDATE Reduced SET ComlexityLevel = ComlexityLevel - 1 FROM
	(SELECT question.ComlexityLevel    
	  FROM Questions question
	  JOIN vTestQuestionResultsGrid tr ON question.Id = tr.QuestionId	  
	  WHERE (tr.PositiveCount / tr.NegativeCount) > 2
			AND question.ComlexityLevel <> 0
     ) AS Reduced

	 PRINT 'The complexity of tests that are too simple is reduced'

	UPDATE Increased SET ComlexityLevel = ComlexityLevel + 1 FROM
	 (SELECT question.ComlexityLevel    
	  FROM Questions question
	  JOIN vTestQuestionResultsGrid tr ON question.Id = tr.QuestionId	  
	  WHERE (tr.PositiveCount < tr.NegativeCount
			AND question.ComlexityLevel <> (SELECT MAX(ComlexityLevel) FROM Questions))
     ) AS Increased

	 PRINT 'The complexity of too complex tests is increased'
END
GO
