namespace FlowBadTweets.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.Bot.Connector;

    public class InMemoryTweetSubscribers : ITweetSubscribers
    {
        private static volatile InMemoryTweetSubscribers instance;
        private static object syncRoot = new Object();

        public static InMemoryTweetSubscribers Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (syncRoot)
                    {
                        if (instance == null)
                        {
                            instance = new InMemoryTweetSubscribers();
                        }
                    }
                }

                return instance;
            }
        }

        private readonly List<string> subscribers;

        private InMemoryTweetSubscribers()
        {
            this.subscribers = new List<string>();
        }

        public void Add(ConversationReference userAddress)
        {
            this.subscribers.Add(ConversationReferenceUtils.ToBase64(userAddress));
        }

        public IEnumerable<ConversationReference> GetAll()
        {
            return this.subscribers.Select(o => ConversationReferenceUtils.ToConversationReference(o));
        }

        public void Remove(ConversationReference userAddress)
        {
            this.subscribers.Remove(ConversationReferenceUtils.ToBase64(userAddress));
        }
    }
}