﻿namespace LMPlatform.UI.Services.Modules.CoreModels
{
	using System.Collections.Generic;
	using System.Runtime.Serialization;

	using LMPlatform.UI.Services.Modules.Labs;
    using LMPlatform.UI.Services.Modules.Practicals;

    [DataContract]
	public class StudentMark
	{
		[DataMember]
		public int StudentId { get; set; }

		[DataMember]
		public string FullName { get; set; }

		[DataMember]
		public string Login { get; set; }

		[DataMember]
		public List<StudentLabMarkViewData> LabsMarks { get; set; }

		[DataMember]
		public List<LabVisitingMarkViewData> LabVisitingMark { get; set; }

		[DataMember]
		public List<StudentPracticalMarkViewData> PracticalsMarks { get; set; }

		[DataMember]
		public List<PracticalVisitingMarkViewData> PracticalVisitingMark { get; set; }

		[DataMember]
        public List<UserLabFileViewData> FileLabs { get; set; }

		[DataMember]
		public string LabsMarkTotal { get; set; }

		[DataMember]
		public string PracticalsMarkTotal { get; set; }

		[DataMember]
		public string TestMark { get; set; }

		[DataMember]
		public int SubGroup { get; set; }

		[DataMember]
		public bool AllTestsPassed { get; set; }

		[DataMember]
		public int TestsPassed { get; set; }

		[DataMember]
		public string CourseProjectMark { get; set; }

	}
}