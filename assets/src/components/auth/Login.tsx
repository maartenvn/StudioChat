import React from 'react';
import {RouteComponentProps, Link} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {Button, Input, Text, Title, Layout, Card} from '../common';
import {useAuth} from './AuthProvider';
import logger from '../../logger';

type Props = RouteComponentProps & {
  onSubmit: (params: any) => Promise<void>;
};
type State = {
  loading: boolean;
  email: string;
  password: string;
  error: any;
};

class Login extends React.Component<Props, State> {
  state: State = {
    loading: false,
    email: '',
    password: '',
    error: null,
  };

  componentDidMount() {
    //
  }

  handleChangeEmail = (e: any) => {
    this.setState({email: e.target.value});
  };

  handleChangePassword = (e: any) => {
    this.setState({password: e.target.value});
  };

  handleSubmit = (e: any) => {
    e.preventDefault();

    this.setState({loading: true, error: null});
    const {email, password} = this.state;

    // TODO: handle login through API
    this.props
      .onSubmit({email, password})
      .then(() => this.props.history.push('/conversations'))
      .catch((err) => {
        logger.error('Error!', err);
        const error =
          err.response?.body?.error?.message ||
          'Er is iets fout gelopen. Probeer later opnieuw.';

        this.setState({error, loading: false});
      });
  };

  render() {
    const {loading, email, password, error} = this.state;

    return (
      <Layout>
        <img src="/logo.svg" alt="Logo" className="logo" />

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
              <Title level={1}>Inloggen</Title>

              <form onSubmit={this.handleSubmit}>
                <Box mb={2}>
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    size="large"
                    type="email"
                    autoComplete="username"
                    placeholder="Email"
                    value={email}
                    onChange={this.handleChangeEmail}
                  />
                </Box>

                <Box mb={2}>
                  <label htmlFor="password">Wachtwoord</label>
                  <Input
                    id="password"
                    size="large"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Wachwoord"
                    value={password}
                    onChange={this.handleChangePassword}
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
                    Inloggen
                  </Button>
                </Box>

                {error && (
                  <Box mt={2}>
                    <Text type="danger">{error}</Text>
                  </Box>
                )}

                <Box mt={error ? 3 : 4}>
                  Nog geen account?{' '}
                  <Link to="/register">Maak een account aan!</Link>
                </Box>
                <Box my={3}>
                  <Link to="/reset-password">Wachtwoord vergeten?</Link>
                </Box>
              </form>
            </Box>
          </Card>
        </Flex>
      </Layout>
    );
  }
}

const LoginPage = (props: RouteComponentProps) => {
  const auth = useAuth();

  return <Login {...props} onSubmit={auth.login} />;
};

export default LoginPage;
