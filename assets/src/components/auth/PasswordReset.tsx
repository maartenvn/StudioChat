import React from 'react';
import {RouteComponentProps, Link} from 'react-router-dom';
import qs from 'query-string';
import {Box, Flex} from 'theme-ui';
import {Button, Input, Text, Title, Layout, Card} from '../common';
import * as API from '../../api';
import {useAuth} from './AuthProvider';
import logger from '../../logger';

type Props = RouteComponentProps<{}> & {
  onSubmit: (params: any) => Promise<void>;
};

type State = {
  loading: boolean;
  submitted: boolean;
  password: string;
  passwordConfirmation: string;
  passwordResetToken: string;
  error: any;
};

class PasswordReset extends React.Component<Props, State> {
  state: State = {
    loading: false,
    submitted: false,
    password: '',
    passwordConfirmation: '',
    passwordResetToken: '',
    error: null,
  };

  componentDidMount() {
    const {search} = this.props.location;
    const {token = ''} = qs.parse(search);

    if (!token || typeof token !== 'string') {
      this.setState({error: 'Invalid reset token!'});
    } else {
      this.setState({passwordResetToken: token});
    }
  }

  handleChangePassword = (e: any) => {
    this.setState({password: e.target.value});
  };

  handleChangePasswordConfirmation = (e: any) => {
    this.setState({passwordConfirmation: e.target.value});
  };

  getValidationError = () => {
    const {password, passwordConfirmation} = this.state;

    if (!password) {
      return 'Wachtwoord is vereist';
    } else if (password.length < 8) {
      return 'Wachtwoord moet minstens 8 characters zijn';
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
    const {password, passwordConfirmation, passwordResetToken} = this.state;

    API.attemptPasswordReset(passwordResetToken, {
      password,
      passwordConfirmation,
    })
      .then(({email}) => this.props.onSubmit({email, password}))
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
    const {loading, password, passwordConfirmation, error} = this.state;

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
              <Title level={1}>Wachtwoord resetten</Title>

              <form onSubmit={this.handleSubmit}>
                <Box mb={2}>
                  <label htmlFor="password">Nieuwe wachtwoord</label>
                  <Input
                    id="password"
                    size="large"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={this.handleChangePassword}
                    onBlur={this.handleInputBlur}
                  />
                </Box>

                <Box mb={2}>
                  <label htmlFor="confirm_password">
                    Bevestig nieuwe wachtwoord
                  </label>
                  <Input
                    id="confirm_password"
                    size="large"
                    type="password"
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
                    Resetten
                  </Button>
                </Box>

                {error && (
                  <Box mt={2}>
                    <Text type="danger">{error}</Text>
                  </Box>
                )}

                <Box mt={error ? 3 : 4}>
                  Terug naar <Link to="/login">inloggen</Link>.
                </Box>
              </form>
            </Box>
          </Card>
        </Flex>
      </Layout>
    );
  }
}

const PasswordResetPage = (props: RouteComponentProps) => {
  const auth = useAuth();

  return <PasswordReset {...props} onSubmit={auth.login} />;
};

export default PasswordResetPage;
