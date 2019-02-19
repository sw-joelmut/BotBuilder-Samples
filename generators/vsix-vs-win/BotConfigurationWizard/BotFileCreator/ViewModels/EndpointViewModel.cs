// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System;
using System.Windows.Input;
using BotFileCreator.Repository;

namespace BotFileCreator
{
    public class EndpointViewModel : BaseViewModel
    {
        private IBotConfigurationRepository _repository;

        private readonly ICommand _cancelCommand;

        private readonly ICommand _submitCommand;

        private EndpointItem _endpointItem;

        public EndpointViewModel()
        {
            _endpointItem = new EndpointItem();
            _cancelCommand = new RelayCommand(param => this.CloseAction(), null);
            _submitCommand = new RelayCommand(param => this.Submit(), null);
        }

        public Action CloseAction { get; set; }

        public EndpointItem EndpointItem { get => _endpointItem; set => SetProperty(ref _endpointItem, value); }

        public ICommand CancelCommand { get => _cancelCommand; }

        public ICommand SubmitCommand { get => _submitCommand; }

        private void Submit()
        {
        }
    }
}
