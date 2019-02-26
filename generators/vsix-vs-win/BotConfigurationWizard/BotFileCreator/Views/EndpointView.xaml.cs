// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using Microsoft.Bot.Configuration;

    /// <summary>
    /// Interaction logic for EndpointView.xaml
    /// </summary>
    public partial class EndpointView
    {
        public EndpointView(EndpointService endpointService)
        {
            DataContext = new EndpointViewModel() { EndpointService = endpointService };
            InitializeComponent();
        }
    }
}
