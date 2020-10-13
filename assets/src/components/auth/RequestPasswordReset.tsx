import React from 'react';
import {RouteComponentProps, Link} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {Button, Input, Text, Title, Layout, Card} from '../common';
import * as API from '../../api';
import logger from '../../logger';

type Props = RouteComponentProps & {
  onSubmit: (params: any) => Promise<void>;
};

type State = {
  loading: boolean;
  email: string;
  error: any;
};

class RequestPasswordReset extends React.Component<Props, State> {
  state: State = {
    loading: false,
    email: '',
    error: null,
  };

  componentDidMount() {
    //
  }

  handleChangeEmail = (e: any) => {
    this.setState({email: e.target.value});
  };

  handleSubmit = (e: any) => {
    e.preventDefault();

    this.setState({loading: true, error: null});
    const {email} = this.state;

    API.sendPasswordResetEmail(email)
      .then(({ok}) => {
        if (ok) {
          this.props.history.push('/reset-password-requested');
        } else {
          this.setState({
            error: 'Er is iets fout gelopen. Probeer later opnieuw.',
            loading: false,
          });
        }
      })
      .catch((err) => {
        logger.error('Error!', err);
        const error =
          err.response?.body?.error?.message ||
          'Er is iets fout gelopen. Probeer later opnieuw.';

        this.setState({error, loading: false});
      });
  };

  render() {
    const {loading, email, error} = this.state;

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
              <Title level={2}>Wachtwoord resetten</Title>

              <form onSubmit={this.handleSubmit}>
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
                    Bevestigen
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

export default RequestPasswordReset;
