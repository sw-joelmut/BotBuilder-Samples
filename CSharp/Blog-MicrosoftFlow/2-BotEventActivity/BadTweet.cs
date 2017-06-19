namespace FlowBadTweets
{
    public class BadTweet
    {
        public double SentimentScore { get; set; }

        public Tweet Tweet { get; set; }
    }

    public class Tweet
    {
        public string Text { get; set; }

        public string Username { get; set; }
    }
}