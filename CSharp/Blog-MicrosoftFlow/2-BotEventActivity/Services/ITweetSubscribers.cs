namespace FlowBadTweets.Services
{
    using System.Collections.Generic;
    using Microsoft.Bot.Connector;

    public interface ITweetSubscribers
    {
        void Add(ConversationReference userAddress);

        void Remove(ConversationReference userAddress);

        IEnumerable<ConversationReference> GetAll();
    }
}
