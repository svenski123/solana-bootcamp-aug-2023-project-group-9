export type Blackjack = {
  "version": "0.1.0",
  "name": "blackjack",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deal",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "slotHashes",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "numDecks",
          "type": "u8"
        }
      ]
    },
    {
      "name": "hit",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "slotHashes",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stand",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "slotHashes",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "close",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "check",
      "accounts": [
        {
          "name": "game",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "publicKey"
          },
          {
            "name": "deck",
            "type": {
              "array": [
                "u8",
                52
              ]
            }
          },
          {
            "name": "playerHand",
            "type": {
              "array": [
                "u8",
                23
              ]
            }
          },
          {
            "name": "playerHandSize",
            "type": "u8"
          },
          {
            "name": "dealerHand",
            "type": {
              "array": [
                "u8",
                23
              ]
            }
          },
          {
            "name": "dealerHandSize",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "BadNumDecks",
      "msg": "num_decks must be between one and eight"
    },
    {
      "code": 6001,
      "name": "GameOverPlayerBust",
      "msg": "game is over - player bust"
    },
    {
      "code": 6002,
      "name": "GameOverDealerDone",
      "msg": "game is over - dealer done"
    }
  ]
};

export const IDL: Blackjack = {
  "version": "0.1.0",
  "name": "blackjack",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deal",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "slotHashes",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "numDecks",
          "type": "u8"
        }
      ]
    },
    {
      "name": "hit",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "slotHashes",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stand",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "slotHashes",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "close",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "check",
      "accounts": [
        {
          "name": "game",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "publicKey"
          },
          {
            "name": "deck",
            "type": {
              "array": [
                "u8",
                52
              ]
            }
          },
          {
            "name": "playerHand",
            "type": {
              "array": [
                "u8",
                23
              ]
            }
          },
          {
            "name": "playerHandSize",
            "type": "u8"
          },
          {
            "name": "dealerHand",
            "type": {
              "array": [
                "u8",
                23
              ]
            }
          },
          {
            "name": "dealerHandSize",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "BadNumDecks",
      "msg": "num_decks must be between one and eight"
    },
    {
      "code": 6001,
      "name": "GameOverPlayerBust",
      "msg": "game is over - player bust"
    },
    {
      "code": 6002,
      "name": "GameOverDealerDone",
      "msg": "game is over - dealer done"
    }
  ]
};
