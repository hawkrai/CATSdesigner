using System;
using System.ComponentModel.DataAnnotations.Schema;
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

		[NotMapped]
		public string CreationDateString
		{
			get
			{
				return CreationDate?.ToString("dd/MM/yyyy");
			}
		}

		[NotMapped]
		public string AuthorName
		{
			get
			{
				return Author?.FullName;
			}
		}

		//public int? SubjectNewsId { get; set; }

		//public SubjectNews SubjectNews { get; set; }
	}
}