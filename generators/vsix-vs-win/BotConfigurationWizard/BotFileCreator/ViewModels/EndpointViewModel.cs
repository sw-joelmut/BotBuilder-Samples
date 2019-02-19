// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using System;
    using System.Windows.Input;

    public class EndpointViewModel : BaseViewModel
    {
        private IBotConfigurationRepository _repository;

        private readonly ICommand _cancelCommand;

        private readonly ICommand _submitCommand;

        private EndpointService _endpointItem;

        public EndpointViewModel()
        {
            _repository = SettingsRepository.GetInstance();
            _endpointItem = new EndpointService();
            _cancelCommand = new RelayCommand(param => this.CloseAction(), null);
            _submitCommand = new RelayCommand(param => this.Submit(), null);
        }

        public Action CloseAction { get; set; }

        public EndpointService EndpointItem { get => _endpointItem; set => SetProperty(ref _endpointItem, value); }

        public ICommand CancelCommand { get => _cancelCommand; }

        public ICommand SubmitCommand { get => _submitCommand; }

        private void Submit()
        {
            _repository.ConnectService(this.EndpointItem);
            this.CloseAction();
        }
    }
}
