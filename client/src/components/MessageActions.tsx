import React, { useEffect, useState } from 'react';
import './MessageActions.scss';
import { gql, useMutation } from '@apollo/client';
import Twemoji from 'react-twemoji';
import { v4 as uuidv4 } from 'uuid';

const VOTE_MUTATION = gql`
  mutation VoteMutation($messageId: ID!, $type: VoteType) {
    createVote(messageId: $messageId, type: $type)
  }
`;

export const MessageActions = ({
  upVotes,
  downVotes,
  responsesCount,
  messageId,
  myVote,
  reactions,
}: {
  upVotes: number;
  downVotes: number;
  responsesCount: number;
  messageId: string;
  myVote: string | null;
  reactions: {
    type: number;
  }[];
}) => {
  // TODO: get current vote from server
  const [myVoteType, setMyVoteType] = useState(myVote);
  const [voteMutation, { data, loading, error }] = useMutation(VOTE_MUTATION);

  useEffect(() => {
    console.log(myVoteType);
  }, [myVoteType]);

  const handleVote = (type: string | null) => {
    if (myVoteType === type) type = null;
    voteMutation({ variables: { messageId, type } });
    setMyVoteType(type);
  };

  return (
    <div className='message-actions'>
      <svg className='upvote icon' onClick={() => handleVote('up')}>
        <use href='./assets/images/svg-bundle.svg#upvote' />
      </svg>
      <p className='upvote-count'>{upVotes}</p>
      <svg className='downvote icon' onClick={() => handleVote('down')}>
        <use href='./assets/images/svg-bundle.svg#downvote' />
      </svg>
      <p className='downvote-count'>{downVotes}</p>
      <svg className='response icon'>
        <use href='./assets/images/svg-bundle.svg#response' />
      </svg>
      <p className='responses-count'>{responsesCount}</p>
      <div className='reactions-container'>
        <div className='common-reactions'>
          <Twemoji options={{ className: 'reaction-emoji' }}>
            {[...new Set(reactions.map((reaction) => reaction.type))].map(
              (reactionType) => (
                <div className='common-reaction-emoji' key={uuidv4()}>
                  {String.fromCodePoint(reactionType)}
                </div>
              )
            )}
          </Twemoji>
        </div>
        <div className='add-reaction-container'>
          <div className='add-reaction-button'>
            <div className='space-holder'></div>
            <svg className='add-reaction-icon icon'>
              <use href='./assets/images/svg-bundle.svg#plus' />
            </svg>
          </div>
          <div className='add-reaction-popup'>
            <div className='add-reaction-popup-emoji-container'>
              <Twemoji options={{ className: 'add-reaction-popup-emoji' }}>
                👍❤🥰🤣😲😢😠
              </Twemoji>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
