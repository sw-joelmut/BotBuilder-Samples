namespace FlowBadTweets
{
    using System;
    using System.Diagnostics;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using FlowBadTweets.Dialogs;
    using FlowBadTweets.Services;
    using Microsoft.Bot.Builder.Dialogs;
    using Microsoft.Bot.Connector;
    using Newtonsoft.Json.Linq;

    [BotAuthentication]
    public class MessagesController : ApiController
    {
        /// <summary>
        /// POST: api/Messages
        /// Receive a message from a user and reply to it
        /// </summary>
        public async Task<HttpResponseMessage> Post([FromBody]Activity activity)
        {
            if (activity.Type == ActivityTypes.Message)
            {
                await Conversation.SendAsync(activity, () => new RootDialog());
            }
            else if (activity.Type == ActivityTypes.Event)
            {
                var value = activity.Value as JObject;
                var badTweet = value.ToObject<BadTweet>();

                var subscribers = InMemoryTweetSubscribers.Instance.GetAll();
                var textMessage = $"@{badTweet.Tweet.Username} said: \"{badTweet.Tweet.Text}\". (Score: {badTweet.SentimentScore})";
                var tasks = subscribers.Select(userAddress =>
                {
                    var message = userAddress.GetPostToUserMessage();
                    var connector = new ConnectorClient(new Uri(message.ServiceUrl));
                    message.Text = textMessage;
                    return connector.Conversations.SendToConversationAsync(message);
                });

                try
                {
                    Task.WaitAll(tasks.ToArray());
                }
                catch (AggregateException aggregated)
                {
                    foreach (var ex in aggregated.InnerExceptions)
                    {
                        Debug.WriteLine(ex.ToString());
                    }
                }
            }
            else
            {
                this.HandleSystemMessage(activity);
            }

            var response = Request.CreateResponse(HttpStatusCode.OK);
            return response;
        }

        private Activity HandleSystemMessage(Activity message)
        {
            if (message.Type == ActivityTypes.DeleteUserData)
            {
                // Implement user deletion here
                // If we handle user deletion, return a real message
            }
            else if (message.Type == ActivityTypes.ConversationUpdate)
            {
                // Handle conversation state changes, like members being added and removed
                // Use Activity.MembersAdded and Activity.MembersRemoved and Activity.Action for info
                // Not available in all channels
            }
            else if (message.Type == ActivityTypes.ContactRelationUpdate)
            {
                // Handle add/remove from contact lists
                // Activity.From + Activity.Action represent what happened
            }
            else if (message.Type == ActivityTypes.Typing)
            {
                // Handle knowing tha the user is typing
            }
            else if (message.Type == ActivityTypes.Ping)
            {
            }

            return null;
        }
    }
}