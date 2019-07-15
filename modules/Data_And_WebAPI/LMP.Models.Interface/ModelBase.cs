namespace LMP.Models.Interface
{
    public abstract class ModelBase : IHasIdentifyKey
    {
        public virtual bool IsNew => Id == 0;

        public int Id { get; set; }
    }
}