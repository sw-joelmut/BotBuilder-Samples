// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    /// <summary>
    /// Interaction logic for BotFileCreationWizard.xaml
    /// </summary>
    public partial class BotFileCreationWizard : BaseDialogWindow
    {
        public BotFileCreationWizard()
        {
            var botConfiguration = new BotConfigurationViewModel();
            DataContext = botConfiguration;
            InitializeComponent();
        }
    }
}
