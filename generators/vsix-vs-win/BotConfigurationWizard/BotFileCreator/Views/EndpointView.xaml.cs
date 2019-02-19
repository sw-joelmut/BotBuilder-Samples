using System;

namespace BotFileCreator
{
    /// <summary>
    /// Interaction logic for EndpointView.xaml
    /// </summary>
    public partial class EndpointView
    {
        public EndpointView()
        {
            var endpointViewModel = new EndpointViewModel();
            endpointViewModel.CloseAction = new Action(() => this.Close());
            DataContext = endpointViewModel;
            InitializeComponent();
        }
    }
}
