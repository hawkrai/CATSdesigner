﻿using System;
using Application.Core.Data;

namespace LMPlatform.Models
{
	public class Attachment : ModelBase
	{
		public string Name { get; set; }

		public string FileName { get; set; }

		public string PathName { get; set; }

		public AttachmentType AttachmentType { get; set; }

		public DateTime? CreationDate { get; set; }

		public int? UserId { get; set; }

		public User Author { get; set; }

        //public int? SubjectNewsId { get; set; }

        //public SubjectNews SubjectNews { get; set; }
	}
}