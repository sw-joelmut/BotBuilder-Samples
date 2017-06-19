namespace FlowBotConnector
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    public class BotConnectorController : ApiController
    {
        public async Task<HttpResponseMessage> Post([FromBody]BotConnectorEventRequest request)
        {
            try
            {
                var accessToken = await ObtainBotAccessToken(request.MicrosoftApplicationId, request.MicrosoftApplicationPassword);

                await SendEventToBot(request.BotEndpointUri, accessToken, request.EventActivityValue);

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.ToString());
            }
        }

        private static async Task<string> ObtainBotAccessToken(string applicationId, string applicationPassword)
        {
            // Using Bot Framework security protocol v3.1
            // More info @ https://docs.microsoft.com/en-us/bot-framework/rest-api/bot-framework-rest-connector-authentication
            const string loginUrl = "https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token";

            var body = new List<KeyValuePair<string, string>>();
            body.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));
            body.Add(new KeyValuePair<string, string>("scope", string.Format("{0}/.default", applicationId)));
            body.Add(new KeyValuePair<string, string>("client_id", applicationId));
            body.Add(new KeyValuePair<string, string>("client_secret", applicationPassword));

            using (var client = new HttpClient())
            {
                var request = new HttpRequestMessage(HttpMethod.Post, loginUrl) { Content = new FormUrlEncodedContent(body) };
                var response = await client.SendAsync(request);

                var json = await response.Content.ReadAsStringAsync();
                var jobject = JObject.Parse(json);

                var accessToken = jobject.Value<string>("access_token");
                if (string.IsNullOrEmpty(accessToken))
                {
                    var error = jobject.Value<string>("error");
                    var description = jobject.Value<string>("error_description");
                    throw new ArgumentException(string.Format("The provided ApplicationId and Password did not generate a valid token: {0}, {1}", error, description));
                }

                return accessToken;
            }
        }

        private static async Task SendEventToBot(string botEndpointUri, string accessToken, dynamic eventActivityPayload)
        {
            var eventActivity = new
            {
                Type = "event",
                ChannelId = "flow",
                Value = eventActivityPayload
            };

            using (var client = new HttpClient())
            {
                var content = new StringContent(
                    JsonConvert.SerializeObject(eventActivity),
                    Encoding.UTF8,
                    "application/json");

                client.DefaultRequestHeaders.Add("authorization", string.Format("Bearer {0}", accessToken));

                var response = await client.PostAsync(botEndpointUri, content);
            }
        }
    }

    public class BotConnectorEventRequest
    {
        public string MicrosoftApplicationId { get; set; }

        public string MicrosoftApplicationPassword { get; set; }

        public string BotEndpointUri { get; set; }

        public dynamic EventActivityValue { get; set; }
    }
}