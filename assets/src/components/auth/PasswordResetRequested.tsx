import React from 'react';
import {Link} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {Button, Result, Card, Layout} from '../common';

export const PasswordResetRequested = () => {
  return (
    <Layout>
      <img src="/logo.svg" alt="Logo" className="logo" />

      <Flex my={5} sx={{justifyContent: 'center'}}>
        <Card className="rounded" bordered={false}>
          <Result
            status="success"
            title="Gelieve je email te checken"
            subTitle={
              <Box>
                <Box>
                  We versturen een email met de instructies om je wachtwoord te
                  resetten.
                </Box>
                <Box>
                  Als je geen email ontvangt in enkele minuten, gelieve de
                  "Spam" inbox na te kijken.
                </Box>
              </Box>
            }
            extra={
              <Link to="/login">
                <Button block shape="round" size="large" type="primary">
                  Terug naar login
                </Button>
              </Link>
            }
          />
        </Card>
      </Flex>
    </Layout>
  );
};

export default PasswordResetRequested;
