using System.ComponentModel.DataAnnotations;

namespace LMP.Models.From_App_Core_Data
{
	public abstract class ModelBase : IHasIdentifyKey
	{
        [Key]
		public int Id
		{
			get;
			set;
		}

		public virtual bool IsNew
		{
			get
			{
				return Id == 0;
			}
		}
	}
}
