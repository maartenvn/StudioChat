import React from 'react';
import {Link} from 'react-router-dom';
import {Box, Flex} from 'theme-ui';
import {Button, colors, Result} from '../common';
import {SmileOutlined} from '../icons';
import Spinner from '../Spinner';
import ChatMessage from './ChatMessage';
import {Customer, Message, User} from '../../types';

const EmptyMessagesPlaceholder = () => {
  return (
    <Box my={4}>
      <Result
        status="success"
        title="Geen berichten"
        subTitle="Geen berichten beschikbaar. Check 'Gesloten' indien een bericht niet langer zichtbaar is."
        extra={
          <Link to="/conversations/closed">
            <Button type="primary">Bekijk gesloten berichten</Button>
          </Link>
        }
      />
    </Box>
  );
};

const GettingStartedRedirect = () => {
  return (
    <Box my={4}>
      <Result
        icon={<SmileOutlined />}
        title="Geen berichten"
        subTitle="Het chatwidget is momenteel nog niet ingesteld."
        extra={
          <Link to="/account/getting-started">
            <Button type="primary">Installeren</Button>
          </Link>
        }
      />
    </Box>
  );
};

const ConversationMessages = ({
  messages,
  currentUser,
  customer,
  loading,
  isClosing,
  showGetStarted,
  sx = {},
  setScrollRef,
}: {
  messages: Array<Message>;
  currentUser: User;
  customer: Customer | null;
  loading?: boolean;
  isClosing?: boolean;
  showGetStarted?: boolean;
  sx?: any;
  setScrollRef: (el: any) => void;
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'scroll',
        opacity: isClosing ? 0.6 : 1,
      }}
    >
      {loading ? (
        <Flex
          sx={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Spinner size={40} />
        </Flex>
      ) : (
        <Box
          backgroundColor={colors.white}
          sx={{minHeight: '100%', p: 4, ...sx}}
        >
          {messages.length ? (
            messages.map((msg: Message, key: number) => {
              // Slight hack
              const next = messages[key + 1];
              const isMe = !!msg.user_id && msg.user_id === currentUser.id;
              const isLastInGroup = next
                ? msg.customer_id !== next.customer_id
                : true;

              // TODO: fix `isMe` logic for multiple agents
              return (
                <ChatMessage
                  key={key}
                  message={msg}
                  customer={customer}
                  isMe={isMe}
                  isLastInGroup={isLastInGroup}
                  shouldDisplayTimestamp={isLastInGroup}
                />
              );
            })
          ) : showGetStarted ? (
            <GettingStartedRedirect />
          ) : (
            <EmptyMessagesPlaceholder />
          )}
          <div ref={setScrollRef} />
        </Box>
      )}
    </Box>
  );
};

export default ConversationMessages;
