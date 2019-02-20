// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using System;
    using System.Text.RegularExpressions;
    using System.Windows;
    using System.Windows.Input;

    public class EndpointViewModel : BaseViewModel
    {
        private IBotConfigurationRepository _repository;

        private readonly ICommand _cancelCommand;

        private readonly ICommand _submitCommand;

        private EndpointService _endpointService;

        public EndpointViewModel()
        {
            _repository = SettingsRepository.GetInstance();
            _endpointService = new EndpointService();
            _cancelCommand = new RelayCommand(param => this.CloseAction(), null);
            _submitCommand = new RelayCommand(param => this.Submit(), null);
        }

        public Action CloseAction { get; set; }

        public EndpointService EndpointService { get => _endpointService; set => SetProperty(ref _endpointService, value); }

        public ICommand CancelCommand { get => _cancelCommand; }

        public ICommand SubmitCommand { get => _submitCommand; }

        public Tuple<bool, string> EndpointServiceIsValid()
        {
            var urlRegex = new Regex(@"((http)(s)?:\/\/)", RegexOptions.IgnoreCase);

            if (string.IsNullOrWhiteSpace(EndpointService.Name))
            {
                return new Tuple<bool, string>(false, "Endpoint name can't be null.");
            }

            if (string.IsNullOrWhiteSpace(EndpointService.Endpoint))
            {
                return new Tuple<bool, string>(false, "Endpoint URL can't be null.");
            }

            if (!urlRegex.IsMatch(this.EndpointService.Endpoint))
            {
                return new Tuple<bool, string>(false, "Please choose a valid endpoint URL. \nInclude route if necessary: /api/messages");
            }

            return new Tuple<bool, string>(true, string.Empty);
        }

        private void Submit()
        {
            // Checks if the endpoint service is valid
            Tuple<bool, string> endpointIsValid = EndpointServiceIsValid();

            if (!endpointIsValid.Item1)
            {
                MessageBox.Show(endpointIsValid.Item2, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            if (string.IsNullOrWhiteSpace(EndpointService.Id))
            {
                _repository.ConnectService(this.EndpointService);
            }
            else
            {
                _repository.EditService(this.EndpointService);
            }

            this.CloseAction();
        }
    }
}
