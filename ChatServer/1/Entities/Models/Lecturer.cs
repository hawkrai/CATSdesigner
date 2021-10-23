using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entities.Models
{
	public class Lecturer
	{
		[Key]
		public int Id { get; set; }

		public string FirstName { get; set; }

		public string LastName { get; set; }

		public string MiddleName { get; set; }

		public string Skill { get; set; }

		public bool IsSecretary { get; set; }

		public bool IsActive { get; set; }

		public bool IsLecturerHasGraduateStudents { get; set; }

		[NotMapped]
		public string FullName => $"{LastName} {FirstName} {MiddleName}";
	}
}
