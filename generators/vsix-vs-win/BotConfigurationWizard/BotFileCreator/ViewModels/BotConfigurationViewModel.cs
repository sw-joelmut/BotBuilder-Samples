// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace BotFileCreator
{
    using System;
    using System.ComponentModel;
    using System.Windows;
    using System.Windows.Data;
    using System.Windows.Input;
    using BotFileCreator.Repository;
    using Microsoft.Bot.Configuration;

    public class BotConfigurationViewModel : BaseViewModel
    {
        private IBotConfigurationRepository _repository;

        private ICollectionView _endpoints;

        private readonly FileSystemService _fileSystemService;

        private readonly ICommand _cancelCommand;

        private readonly ICommand _submitCommand;

        private readonly ICommand _botNameCommand;

        private readonly ICommand _botEndpointCommmand;

        private readonly ICommand _botServicesCommand;

        private readonly ICommand _botEncryptCommand;

        private readonly ICommand _isCheckedESafeStorageCheckBox;

        private readonly ICommand _copyCommand;

        private readonly ICommand _addEndpointCommand;

        private readonly ICommand _editEndpointCommand;

        private readonly ICommand _deleteEndpointCommand;

        private readonly ICommand _openSecretManagerDocLinkCommand;

        private bool _safeStoragetNoteIsVisible;

        private string _secretKey;

        private string _botFileName = string.Empty;

        private string _panelToShow = "BotName";

        public BotConfigurationViewModel()
        {
            _repository = SettingsRepository.GetInstance();
            _botFileName = _repository.GetName();
            _endpoints = CollectionViewSource.GetDefaultView(_repository.GetEndpoints());
            _fileSystemService = FileSystemService.GetInstance();
            _safeStoragetNoteIsVisible = false;
            _isCheckedESafeStorageCheckBox = new RelayCommand<object>(param => this.CheckSafeStorageCheckBox(), null);
            _addEndpointCommand = new RelayCommand<object>(param => this.AddEndpoint(), null);
            _editEndpointCommand = new RelayCommand<object>(param => this.EditEndpoint(), null);
            _deleteEndpointCommand = new RelayCommand<object>(param => this.DeleteEndpoint(), null);
            _copyCommand = new RelayCommand<object>(param => this.CopySecretKey(), null);
            _submitCommand = new RelayCommand<Window>(this.Submit, null);
            _cancelCommand = new RelayCommand<Window>(this.CloseWindow, null);
            _botNameCommand = new RelayCommand<object>(param => this.SetPanelToShow("BotName"), null);
            _botEndpointCommmand = new RelayCommand<object>(param => this.SetPanelToShow("BotEndpoint"), null);
            _botServicesCommand = new RelayCommand<object>(param => this.SetPanelToShow("BotServices"), null);
            _botEncryptCommand = new RelayCommand<object>(param => this.SetPanelToShow("BotEncrypt"), null);
            _openSecretManagerDocLinkCommand = new RelayCommand<object>(param => this.OnOpenSecretManagerDocLink());
        }

        public bool SafeStorageNoteIsVisible
        {
            get => _safeStoragetNoteIsVisible;
            set
            {
                _safeStoragetNoteIsVisible = value;
                NotifyPropertyChanged("EncryptNoteVisibility");
            }
        }

        public string PanelToShow
        {
            get => _panelToShow;
            set
            {
                _panelToShow = value;
                NotifyPropertyChanged("BotNameVisibility");
                NotifyPropertyChanged("BotEndpointVisibility");
                NotifyPropertyChanged("BotServicesVisibility");
                NotifyPropertyChanged("BotEncrypVisibility");
            }
        }

        public string SecretKey { get => _secretKey; set => SetProperty(ref _secretKey, value); }

        public string BotFileName { get => _botFileName; set => SetProperty(ref _botFileName, value); }

        public bool SafeStorageCheckBoxIsChecked { get; set; }

        public ICollectionView Endpoints { get => _endpoints; set => SetProperty(ref _endpoints, value); }

        public EndpointService EndpointItemSelect { get; set; }

        public Visibility EncryptNoteVisibility
        {
            get => SafeStorageNoteIsVisible ? Visibility.Visible : Visibility.Collapsed;
        }

        public Visibility BotNameVisibility
        {
            get => _panelToShow == "BotName" ? Visibility.Visible : Visibility.Collapsed;
        }

        public Visibility BotEndpointVisibility
        {
            get => _panelToShow == "BotEndpoint" ? Visibility.Visible : Visibility.Collapsed;
        }

        public Visibility BotServicesVisibility
        {
            get => _panelToShow == "BotServices" ? Visibility.Visible : Visibility.Collapsed;
        }

        public Visibility BotEncrypVisibility
        {
            get => _panelToShow == "BotEncrypt" ? Visibility.Visible : Visibility.Collapsed;
        }

        public ICommand DeleteEndpointCommand { get => _deleteEndpointCommand; }

        public ICommand EditEndpointCommand { get => _editEndpointCommand; }

        public ICommand AddEndpointCommand { get => _addEndpointCommand; }

        public ICommand CopyCommand { get => _copyCommand; }

        public ICommand SubmitCommand { get => _submitCommand; }

        public ICommand CancelCommand { get => _cancelCommand; }

        public ICommand BotNameCommand { get => _botNameCommand; }

        public ICommand BotEndpointCommand { get => _botEndpointCommmand; }

        public ICommand BotServicesCommand { get => _botServicesCommand; }

        public ICommand BotEncryptCommand { get => _botEncryptCommand; }

        public ICommand IsCheckedSafeStorageCheckBox { get => _isCheckedESafeStorageCheckBox; }

        public ICommand OpenSecretManagerDocLinkCommand { get => _openSecretManagerDocLinkCommand; }

        private void SetPanelToShow(string panelToShow)
        {
            this.PanelToShow = panelToShow;
        }

        private void CheckSafeStorageCheckBox()
        {
            SafeStorageCheckBoxIsChecked = !SafeStorageCheckBoxIsChecked;
            SafeStorageNoteIsVisible = !SafeStorageNoteIsVisible;

            //this.SecretKey = SafeStorageCheckBoxIsChecked ? BotFileRepository.GenerateKey() : string.Empty;
        }

        private void CopySecretKey()
        {
            if (!string.IsNullOrWhiteSpace(SecretKey))
            {
                Clipboard.SetText(SecretKey);
            }
        }

        /// <summary>
        /// Checks if the Bot File Configuration to create is valid
        /// </summary>
        /// <param name="botFileName">bot file's name</param>
        /// <returns>Tuple</returns>
        private Tuple<bool, string> BotConfigurationNameIsValid(string botFileName)
        {
            // If the .bot file name is Null or WhiteSpace, returns an error.
            if (string.IsNullOrWhiteSpace(botFileName))
            {
                return new Tuple<bool, string>(false, "Bot configuration name can't be null.");
            }

            // If the .bot file name contains any whitespace, the method will return an error.
            if (botFileName.Contains(" "))
            {
                return new Tuple<bool, string>(false, "Bot configuration name can't have whitespaces.");
            }

            // A tuple with True and Empty string will be returned if there are no errors.
            return new Tuple<bool, string>(true, string.Empty);
        }

        private void Submit(Window window)
        {
            var botConfigurationNameIsValid = BotConfigurationNameIsValid(BotFileName);

            // Checks if the Bot Configuration name is valid
            if (!botConfigurationNameIsValid.Item1)
            {
                MessageBox.Show(botConfigurationNameIsValid.Item2, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            this._repository.SetName(BotFileName);

            if (this.SafeStorageCheckBoxIsChecked == true)
            {
                SetUserSecrets();
            }

            this._repository.Save();


            // If the file was successfully created, the Wizard will be closed.
            MessageBox.Show("Bot file successfully created", "Bot file successfully created", MessageBoxButton.OK, MessageBoxImage.Exclamation);

            ((SettingsRepository)_repository).Dispose();
            window.Close();
        }

        private void AddEndpoint()
        {
            var endpointView = new EndpointView(new EndpointService());
            endpointView.ShowDialog();
            Endpoints.Refresh();
        }

        private void EditEndpoint()
        {
            var endpointView = new EndpointView(this.EndpointItemSelect);
            endpointView.ShowDialog();
            Endpoints.Refresh();
        }

        private void DeleteEndpoint()
        {
            this._repository.DisconnectService(EndpointItemSelect.Id);
            Endpoints.Refresh();
        }

        private void CloseWindow(Window window)
        {
            window.Close();
        }

        private void SetUserSecrets()
        {
            foreach (var service in _repository.Services)
            {
                switch (service.Type)
                {
                    case ServiceTypes.Endpoint:
                        ((EndpointService)service).SetUserSecrets();
                        break;
                    case ServiceTypes.Luis:
                        ((LuisService)service).SetUserSecrets();
                        break;
                    case ServiceTypes.QnA:
                        ((QnAMakerService)service).SetUserSecrets();
                        break;
                    default:
                        break;
                }
            }
        }

        private void OnOpenSecretManagerDocLink()
        {
            try
            {
                System.Diagnostics.Process.Start("https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-2.2&tabs=linux#secret-manager");
            }
            catch (Exception)
            {
                // TODO: Error.
            }
        }
    }
}
