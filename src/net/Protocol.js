export const Protocol = {
  ADD_PLAYER: 123, // this should come from the server in prod
  JOIN: 0,
  SYNC_PLAYERS: 1,
  PLAYER_JOINED: 2,
  PLAYER_LEFT: 3,
  GAME_INITIAL_SYNC: 10,
  BOUNDER_DEACTIVATED: 101,
  ORDER_MOVE: 1000,
  INIT_BOUNDER: 2000,
  BOUNDER_SPAWNED: 2001,
  BOUNDER_MOVE: 2005,
  BOUNDER_DIE: 2010,
  PING: 42069,
};

export const ProtocolSchema = {
  [Protocol.ADD_PLAYER]: [
    {
      value: Protocol.ADD_PLAYER,
      type: 'uint16',
      valueName: 'protocol',
    },
    {
      type: 'uint32',
      valueName: 'kumaId',
    },
    {
      type: 'string',
      valueName: 'key',
    },
    {
      type: 'name',
      valueName: 'string',
    },
  ],
  [Protocol.JOIN]: [
    {
      value: Protocol.JOIN,
      type: 'uint16',
      valueName: 'protocol',
    },
    {
      type: 'uint32',
      valueName: 'kumaId',
    },
    {
      type: 'string',
      valueName: 'key',
    },
  ],
  [Protocol.SYNC_PLAYERS]: [
    {
      value: Protocol.SYNC_PLAYERS,
      type: 'uint16',
      valueName: 'protocol',
    },
    {
      type: 'uint8',
      valueName: 'selfId',
    },
    {
      valueName: 'players',
      type: 'array',
      data: [
        {
          valueName: 'id',
          type: 'uint16',
        },
        {
          valueName: 'name',
          type: 'string',
        },
      ],
    },
  ],
  [Protocol.PLAYER_JOINED]: [
    {
      value: Protocol.PLAYER_JOINED,
      type: 'uint16',
      valueName: 'protocol',
    },
    {
      valueName: 'id',
      type: 'uint8',
    },
    {
      type: 'string',
      valueName: 'name',
    },
  ],
  [Protocol.PLAYER_LEFT]: [
    {
      value: Protocol.PLAYER_LEFT,
      type: 'uint16',
      valueName: 'protocol',
    },
    {
      valueName: 'id',
      type: 'uint8',
    },
  ],
  [Protocol.GAME_INITIAL_SYNC]: [
    {
      value: Protocol.GAME_INITIAL_SYNC,
      type: 'uint16',
      valueName: 'protocol',
    },
    {
      valueName: 'tickCount',
      type: 'uint32',
    },
    {
      valueName: 'bounders',
      type: 'array',
      data: [
        {
          valueName: 'id',
          type: 'uint16',
        },
        {
          valueName: 'ownerId',
          type: 'uint16',
        },
        {
          valueName: 'state',
          type: 'uint8',
        },
        {
          valueName: 'xPos',
          type: 'uint16',
        },
        {
          valueName: 'yPos',
          type: 'uint16',
        },
        {
          valueName: 'tarX',
          type: 'uint16',
        },
        {
          valueName: 'tarY',
          type: 'uint16',
        },
      ],
    },
  ],
  [Protocol.INIT_BOUNDER]: [
    {
      value: Protocol.INIT_BOUNDER,
      type: 'uint16',
      valueName: 'protocol',
    },
    {
      valueName: 'id',
      type: 'uint8',
    },
    {
      valueName: 'ownerId',
      type: 'uint8',
    },
    {
      valueName: 'xPos',
      type: 'uint16',
    },
    {
      valueName: 'yPos',
      type: 'uint16',
    },
  ],
  [Protocol.BOUNDER_DEACTIVATED]: [
    {
      value: Protocol.BOUNDER_DEACTIVATED,
      type: 'uint16',
      valueName: 'protocol',
    },
    {
      valueName: 'id',
      type: 'uint8',
    },
  ],
  [Protocol.ORDER_MOVE]: [
    {
      value: Protocol.ORDER_MOVE,
      type: 'uint16',
      valueName: 'protocol',
    },
    {
      valueName: 'xPos',
      type: 'uint16',
    },
    {
      valueName: 'yPos',
      type: 'uint16',
    },
  ],
  [Protocol.BOUNDER_SPAWNED]: [
    {
      value: Protocol.BOUNDER_SPAWNED,
      type: 'uint16',
      valueName: 'protocol',
    },
    {
      valueName: 'id',
      type: 'uint8',
    },
    {
      valueName: 'xPos',
      type: 'uint16',
    },
    {
      valueName: 'yPos',
      type: 'uint16',
    },
  ],
  [Protocol.BOUNDER_MOVE]: [
    {
      value: Protocol.BOUNDER_MOVE,
      type: 'uint16',
      valueName: 'protocol',
    },
    {
      valueName: 'id',
      type: 'uint16',
    },
    {
      valueName: 'tarX',
      type: 'uint16',
    },
    {
      valueName: 'tarY',
      type: 'uint16',
    },
  ],
  [Protocol.BOUNDER_DIE]: [
    {
      value: Protocol.BOUNDER_MOVE,
      type: 'uint16',
      valueName: 'protocol',
    },
    {
      valueName: 'id',
      type: 'uint16',
    },
  ],
  [Protocol.PING]: [
    {
      value: Protocol.PING,
      type: 'uint16',
      valueName: 'protocol',
    },
    {
      valueName: 'time',
      type: 'uint32',
    },
    {
      valueName: 'tick',
      type: 'uint32',
    },
  ],
};
