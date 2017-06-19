namespace FlowBasicSample.Controllers
{
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Microsoft.Bot.Connector;

    public class FlowCallbackController : ApiController
    {
        public async Task<HttpResponseMessage> Post([FromBody] BotFlowPayload payload)
        {
            try
            {
                var response = new HttpResponseMessage(HttpStatusCode.OK);

                var conversationReference = ConversationReferenceUtils.ToConversationReference(payload.ConversationReference);

                var message = conversationReference.GetPostToUserMessage();

                var connector = new ConnectorClient(new Uri(message.ServiceUrl));

                message.Text = payload.Message;

                await connector.Conversations.SendToConversationAsync(message);

                return response;
            }
            catch (Exception ex)
            {
                // Callback is called with no pending message as a result the login flow cannot be resumed.
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }
    }
}