import React from 'react';
import {Box, Flex} from 'theme-ui';
import {
  colors,
  Button,
  Checkbox,
  Divider,
  Input,
  Paragraph,
  Title,
} from '../common';
import * as API from '../../api';
import logger from '../../logger';

type Props = {};
type State = {
  email: string;
  fullName: string;
  displayName: string;
  profilePhotoUrl: string;
  shouldEmailOnNewMessages: boolean;
  isLoading: boolean;
  isEditing: boolean;
};

class UserProfile extends React.Component<Props, State> {
  input: any = null;

  state: State = {
    email: '',
    fullName: '',
    displayName: '',
    profilePhotoUrl: '',
    shouldEmailOnNewMessages: false,
    isLoading: true,
    isEditing: false,
  };

  async componentDidMount() {
    await this.fetchLatestProfile();
    await this.fetchLatestSettings();

    this.setState({isLoading: false});
  }

  fetchLatestProfile = async () => {
    const profile = await API.fetchUserProfile();

    if (profile) {
      logger.debug('Profile:', profile);
      const {
        email,
        display_name: displayName,
        full_name: fullName,
        profile_photo_url: profilePhotoUrl,
      } = profile;

      this.setState({
        email,
        displayName,
        fullName,
        profilePhotoUrl,
      });
    } else {
      // NB: this also handles resetting these values if the optimistic update fails
      this.setState({
        email: '',
        displayName: '',
        fullName: '',
        profilePhotoUrl: '',
      });
    }
  };

  fetchLatestSettings = async () => {
    const settings = await API.fetchUserSettings();

    if (settings) {
      this.setState({
        shouldEmailOnNewMessages: settings.email_alert_on_new_message,
      });
    } else {
      // NB: this also handles resetting these values if the optimistic update fails
      this.setState({
        shouldEmailOnNewMessages: false,
      });
    }
  };

  handleChangeFullName = (e: any) => {
    this.setState({fullName: e.target.value});
  };

  handleChangeDisplayName = (e: any) => {
    this.setState({displayName: e.target.value});
  };

  handleChangeProfilePhotoUrl = (e: any) => {
    this.setState({profilePhotoUrl: e.target.value});
  };

  handleCancel = () => {
    return this.fetchLatestProfile().then(() =>
      this.setState({isEditing: false})
    );
  };

  handleUpdate = () => {
    const {displayName, fullName, profilePhotoUrl} = this.state;

    return API.updateUserProfile({
      display_name: displayName,
      full_name: fullName,
      profile_photo_url: profilePhotoUrl,
    })
      .then((profile) => {
        logger.debug('Successfully updated profile!', profile);

        this.setState({isEditing: false});
      })
      .catch((err) => {
        logger.error('Failed to update profile!', err);

        return this.fetchLatestProfile();
      })
      .then(() => this.setState({isEditing: false}));
  };

  handleToggleEmailAlertSetting = async (e: any) => {
    const shouldEmailOnNewMessages = e.target.checked;

    // Optimistic update
    this.setState({shouldEmailOnNewMessages});

    return API.updateUserSettings({
      email_alert_on_new_message: shouldEmailOnNewMessages,
    }).catch((err) => {
      logger.error('Failed to update settings!', err);
      // Reset if fails to actually update
      return this.fetchLatestSettings();
    });
  };

  handleStartEditing = () => {
    this.setState({isEditing: true});
  };

  render() {
    const {
      isLoading,
      email,
      fullName,
      displayName,
      profilePhotoUrl,
      shouldEmailOnNewMessages,
      isEditing,
    } = this.state;

    if (isLoading) {
      return null; // TODO: switch to loading state
    }

    return (
      <Box p={4}>
        <Title level={3}>Profiel</Title>

        <Box mb={3} sx={{maxWidth: 480}}>
          <Paragraph>
            Deze informatie bepaald hoe je wordt weergegeven bij andere
            gebruikers.
          </Paragraph>

          <Paragraph>
            Druk eerst op <b>Bewerken</b> om jouw informatie aan te passen.
          </Paragraph>
        </Box>

        <Box mb={3} sx={{maxWidth: 480}}>
          <label htmlFor="full_name">Volledige naam:</label>
          <Input
            id="full_name"
            type="text"
            value={fullName}
            onChange={this.handleChangeFullName}
            placeholder="Voornaam + achternaam"
            disabled={!isEditing}
          />
        </Box>

        <Box mb={3} sx={{maxWidth: 480}}>
          <label htmlFor="display_name">Weergave naam:</label>
          <Input
            id="display_name"
            type="text"
            value={displayName}
            onChange={this.handleChangeDisplayName}
            placeholder="Hoe wil je dat andere gebruikers je zien?"
            disabled={!isEditing}
          />
        </Box>

        <Box mb={3} sx={{maxWidth: 480}}>
          <label htmlFor="email">Email:</label>
          <Input
            style={{color: colors.text}}
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            disabled
          />
        </Box>

        <Flex sx={{alignItems: 'center'}}>
          <Box mb={3} mr={3} sx={{maxWidth: 480, flex: 1}}>
            <label htmlFor="profile_photo_url">Profiel afbeelding:</label>
            <Input
              id="profile_photo_url"
              type="text"
              value={profilePhotoUrl}
              onChange={this.handleChangeProfilePhotoUrl}
              placeholder="Geef de URL in van een afbeelding"
              disabled={!isEditing}
            />
          </Box>

          <Box
            style={{
              height: 40,
              width: 40,
              borderRadius: '50%',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundImage: `url(${profilePhotoUrl})`,
            }}
          />
        </Flex>

        {isEditing ? (
          <Flex>
            <Box mr={1}>
              <Button type="default" onClick={this.handleCancel}>
                Annuleren
              </Button>
            </Box>
            <Box>
              <Button type="primary" onClick={this.handleUpdate}>
                Opslaan
              </Button>
            </Box>
          </Flex>
        ) : (
          <Button type="primary" onClick={this.handleStartEditing}>
            Bewerken
          </Button>
        )}

        <Divider />

        <Title level={3}>Meldingen</Title>

        <Box mb={3} sx={{maxWidth: 480}}>
          <Paragraph>
            Kies hoe je meldingen kan ontvangen bij nieuwe berichten.
          </Paragraph>
        </Box>

        <Checkbox
          checked={shouldEmailOnNewMessages}
          onChange={this.handleToggleEmailAlertSetting}
        >
          Stuur mij een email bij een nieuw bericht
        </Checkbox>
      </Box>
    );
  }
}

export default UserProfile;
