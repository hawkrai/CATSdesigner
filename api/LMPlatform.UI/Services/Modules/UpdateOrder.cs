using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace LMPlatform.UI.Services.Modules
{
	[DataContract]
	public class UpdateOrder
	{
		[DataMember]
		public int Id { get; set; }
		[DataMember]
		public int Order { get; set; } 
	}
}