namespace FlowBadTweets.Dialogs
{
    using System;
    using System.Threading.Tasks;
    using FlowBadTweets.Services;
    using Microsoft.Bot.Builder.Dialogs;
    using Microsoft.Bot.Connector;
    using Microsoft.Bot.Builder.ConnectorEx;

    [Serializable]
    public class RootDialog : IDialog<object>
    {
        public async Task StartAsync(IDialogContext context)
        {
            context.Wait(this.MessageReceivedAsync);
        }

        public async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> argument)
        {
            var message = await argument;
            if (message != null)
            {
                var subscribers = InMemoryTweetSubscribers.Instance;
                var user = message.ToConversationReference();
                switch ((message.Text ?? string.Empty).Trim().ToUpperInvariant())
                {
                    case "HELP":
                        await context.PostAsync("Type 'subscribe' to start recieving the \"bad tweets\"");
                        break;

                    case "UNSUBSCRIBE":
                        subscribers.Remove(user);
                        break;

                    case "SUBSCRIBE":
                        subscribers.Remove(user);
                        subscribers.Add(user);
                        await context.PostAsync("Thanks! You've been subscribed to the \"bad tweets\". Type 'unsubscribe' to stop receiving the tweets.");
                        break;
                }
            }
        }
    }
}