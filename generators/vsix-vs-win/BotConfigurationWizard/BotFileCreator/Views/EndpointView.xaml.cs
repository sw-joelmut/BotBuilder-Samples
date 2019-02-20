// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using System;
    using Microsoft.Bot.Configuration;

    /// <summary>
    /// Interaction logic for EndpointView.xaml
    /// </summary>
    public partial class EndpointView
    {
        public EndpointView(EndpointService endpointService)
        {
            var endpointViewModel = new EndpointViewModel();
            endpointViewModel.EndpointService = endpointService;
            endpointViewModel.CloseAction = new Action(() => this.Close());

            DataContext = endpointViewModel;
            InitializeComponent();
        }
    }
}
