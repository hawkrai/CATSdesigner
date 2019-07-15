namespace LMP.Models.Interface
{
    public abstract class ModelBase : IHasIdentifyKey
    {
        public virtual bool IsNew => Id == 0;

//        [Key]
        public int Id { get; set; }
    }
}