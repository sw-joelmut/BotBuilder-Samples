namespace FlowBasicSample
{
    using System;
    using System.Text;
    using Microsoft.Bot.Connector;
    using Newtonsoft.Json;

    public static class ConversationReferenceUtils
    {
        public static string ToBase64(ConversationReference conversationReference)
        {
            if (conversationReference == null)
            {
                throw new ArgumentNullException("conversationReference");
            }

            var serializedConversationReference = JsonConvert.SerializeObject(conversationReference);

            byte[] bytes = Encoding.UTF8.GetBytes(serializedConversationReference);

            return Convert.ToBase64String(bytes);
        }

        public static ConversationReference ToConversationReference(string encodedConversationReference)
        {
            if (String.IsNullOrWhiteSpace(encodedConversationReference))
            {
                throw new ArgumentException("Missing encodedConversationReference", "encodedConversationReference");
            }

            byte[] bytes = Convert.FromBase64String(encodedConversationReference);

            var serializedConversationReference = Encoding.UTF8.GetString(bytes);

            return JsonConvert.DeserializeObject<ConversationReference>(serializedConversationReference);
        }
    }
}