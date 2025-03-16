using Contracts.Services;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Services
{
    public class EncryptionService : IEncryptionService
    {
        private readonly byte[] _key;
        private readonly byte[] _iv;

        public EncryptionService(string encryptionKey, string encryptionIv)
        {
            using (var sha256 = SHA256.Create())
            {
                // 32 bytes
                _key = sha256.ComputeHash(Encoding.UTF8.GetBytes(encryptionKey));

                // 16 bytes
                using (var md5 = MD5.Create())
                {
                    _iv = md5.ComputeHash(Encoding.UTF8.GetBytes(encryptionIv));
                }
            }
        }

        public string Encrypt(string plainText)
        {
            if (string.IsNullOrEmpty(plainText))
                return plainText;

            byte[] encrypted;

            using (Aes aes = Aes.Create())
            {
                aes.Key = _key;
                aes.IV = _iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter(cryptoStream))
                        {
                            streamWriter.Write(plainText);
                        }
                        encrypted = memoryStream.ToArray();
                    }
                }
            }

            return Convert.ToBase64String(encrypted);
        }

        public string Decrypt(string encryptedText)
        {
            if (string.IsNullOrEmpty(encryptedText))
                return encryptedText;

            try
            {
                byte[] cipherBytes = Convert.FromBase64String(encryptedText);

                using (Aes aes = Aes.Create())
                {
                    aes.Key = _key;
                    aes.IV = _iv;

                    ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                    using (MemoryStream memoryStream = new MemoryStream(cipherBytes))
                    {
                        using (CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader streamReader = new StreamReader(cryptoStream))
                            {
                                return streamReader.ReadToEnd();
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
                return encryptedText;
            }
        }
    }
}