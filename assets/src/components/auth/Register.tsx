import React from 'react';
import {RouteComponentProps, Link} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {Button, Input, Text, Title, Layout, Card} from '../common';
import {useAuth} from './AuthProvider';
import logger from '../../logger';

type Props = RouteComponentProps<{invite?: string}> & {
  onSubmit: (params: any) => Promise<void>;
};
type State = {
  loading: boolean;
  submitted: boolean;
  companyName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  inviteToken?: string;
  error: any;
};

class Register extends React.Component<Props, State> {
  state: State = {
    loading: false,
    submitted: false,
    companyName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    inviteToken: '',
    error: null,
  };

  componentDidMount() {
    const {invite: inviteToken} = this.props.match.params;
    this.setState({inviteToken});
  }

  handleChangeCompanyName = (e: any) => {
    this.setState({companyName: e.target.value});
  };

  handleChangeEmail = (e: any) => {
    this.setState({email: e.target.value});
  };

  handleChangePassword = (e: any) => {
    this.setState({password: e.target.value});
  };

  handleChangePasswordConfirmation = (e: any) => {
    this.setState({passwordConfirmation: e.target.value});
  };

  getValidationError = () => {
    const {
      companyName,
      email,
      password,
      passwordConfirmation,
      inviteToken,
    } = this.state;

    if (!companyName && !inviteToken) {
      return 'Bedrijfsnaam is verplicht';
    } else if (!email) {
      return 'Email is verplicht';
    } else if (!password) {
      return 'Wachtwoord is verplicht';
    } else if (password.length < 8) {
      return 'Wachtwoord moet minstens 8 characters lang zijn';
    } else if (password !== passwordConfirmation) {
      return 'Wachtwoorden zijn niet hetzelfde';
    } else {
      return null;
    }
  };

  handleInputBlur = () => {
    if (!this.state.submitted) {
      return;
    }

    this.setState({error: this.getValidationError()});
  };

  handleSubmit = (e: any) => {
    e.preventDefault();

    const error = this.getValidationError();

    if (error) {
      this.setState({error, submitted: true});

      return;
    }

    this.setState({loading: true, submitted: true, error: null});
    const {
      companyName,
      inviteToken,
      email,
      password,
      passwordConfirmation,
    } = this.state;

    this.props
      .onSubmit({
        companyName,
        inviteToken,
        email,
        password,
        passwordConfirmation,
      })
      .then(() => this.props.history.push('/conversations'))
      .catch((err) => {
        logger.error('Error!', err);
        // TODO: provide more granular error messages?
        const error =
          err.response?.body?.error?.message ||
          'Er is iets fout gelopen. Probeer later opnieuw.';

        this.setState({error, loading: false});
      });
  };

  render() {
    const {
      loading,
      inviteToken,
      companyName,
      email,
      password,
      passwordConfirmation,
      error,
    } = this.state;

    return (
      <Layout>
        <img src="logo.svg" alt="Logo" className="logo" />
        <Flex
          px={[2, 5]}
          py={5}
          sx={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card className="rounded" bordered={false}>
            <Box sx={{width: '100%', maxWidth: 320}}>
              <Title level={1}>Registeren</Title>

              <form onSubmit={this.handleSubmit}>
                {!inviteToken && (
                  <Box mb={2}>
                    <label htmlFor="companyName">Bedrijfsnaam</label>
                    <Input
                      id="companyName"
                      size="large"
                      type="text"
                      placeholder="Bedrijfsnaam"
                      autoComplete="company-name"
                      value={companyName}
                      onChange={this.handleChangeCompanyName}
                      onBlur={this.handleInputBlur}
                    />
                  </Box>
                )}

                <Box mb={2}>
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    size="large"
                    type="email"
                    placeholder="Email"
                    autoComplete="username"
                    value={email}
                    onChange={this.handleChangeEmail}
                    onBlur={this.handleInputBlur}
                  />
                </Box>

                <Box mb={2}>
                  <label htmlFor="password">Wachtwoord</label>
                  <Input
                    id="password"
                    size="large"
                    type="password"
                    placeholder="Wachtwoord"
                    autoComplete="current-password"
                    value={password}
                    onChange={this.handleChangePassword}
                    onBlur={this.handleInputBlur}
                  />
                </Box>

                <Box mb={2}>
                  <label htmlFor="confirm_password">Bevestig wachtwoord</label>
                  <Input
                    id="confirm_password"
                    size="large"
                    type="password"
                    placeholder="Bevestig wachtwoord"
                    autoComplete="current-password"
                    value={passwordConfirmation}
                    onChange={this.handleChangePasswordConfirmation}
                    onBlur={this.handleInputBlur}
                  />
                </Box>

                <Box mt={3}>
                  <Button
                    block
                    shape="round"
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Account aanmaken
                  </Button>
                </Box>

                {error && (
                  <Box mt={2}>
                    <Text type="danger">{error}</Text>
                  </Box>
                )}

                <Box mt={error ? 3 : 4}>
                  Heb je al een account? <Link to="/login">Log in!</Link>
                </Box>
              </form>
            </Box>
          </Card>
        </Flex>
      </Layout>
    );
  }
}

const RegisterPage = (props: RouteComponentProps) => {
  const auth = useAuth();

  return <Register {...props} onSubmit={auth.register} />;
};

export default RegisterPage;
