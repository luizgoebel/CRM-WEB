using System;

namespace CRM.Web.Exceptions;

public class DomainException : Exception
{
    public object ObjetoErro { get; set; }
    public DomainException(string message)
        : base(message) { }
    public DomainException(string message, object obj)
        : base(message)
    {
        this.ObjetoErro = obj;
    }
}
