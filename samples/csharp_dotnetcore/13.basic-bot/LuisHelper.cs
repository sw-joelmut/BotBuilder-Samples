// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.AI.Luis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Microsoft.BotBuilderSamples
{
    public static class LuisHelper
    {
        public static readonly string LuisConfiguration = "LUIS_APPLICATION_NAME";

        public static async Task<BookingDetails> ExecuteLuisQuery(LuisService luisService, ILogger logger, ITurnContext turnContext, CancellationToken cancellationToken)
        {
            var bookingDetails = new BookingDetails();
            try
            { 
            // The actual call to LUIS
            var luisResult = await luisService.Services[LuisConfiguration].RecognizeAsync(turnContext, cancellationToken);

            var (intent, score) = luisResult.GetTopScoringIntent();
                if (intent == "Book_flight")
                {
                    // We need to get the result from the LUIS JSON which at every level returns an array.
                    bookingDetails.Destination = luisResult.Entities["To"]?.FirstOrDefault()?["Airport"]?.FirstOrDefault()?.FirstOrDefault()?.ToString();
                    bookingDetails.Origin = luisResult.Entities["From"]?.FirstOrDefault()?["Airport"]?.FirstOrDefault()?.FirstOrDefault()?.ToString();

                    // This value will be a TIMEX. And we are only interested in a Date so grab the first result and drop the Time part.
                    // TIMEX is a format that represents DateTime expressions that include some ambiguity. e.g. missing a Year.
                    bookingDetails.TravelDate = luisResult.Entities["datetime"]?.FirstOrDefault()?["timex"]?.FirstOrDefault()?.ToString().Split('T')[0];
                }
            }
            catch (Exception e)
            {
                logger.LogWarning($"LUIS Exception: {e.Message} Check your LUIS configuration.");
            }

            return bookingDetails;
        }
    }
}
