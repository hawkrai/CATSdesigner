using System;
using System.Collections.Generic;
using System.Text;

namespace Contracts.Services
{
    public interface IEncryptionService
    {
        string Encrypt(string plainText);
        string Decrypt(string encryptedText);
    }
}
