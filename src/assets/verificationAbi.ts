export const verificationAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_messageHash',
        type: 'bytes32',
      },
    ],
    name: 'getEthSignedMessageHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_toVerify',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_userHash',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
    ],
    name: 'getMessageHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_toVerify',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_userHash',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
    ],
    name: 'getPackedMessage',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_ethSignedMessageHash',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes',
      },
    ],
    name: 'recoverSigner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'sig',
        type: 'bytes',
      },
    ],
    name: 'splitSignature',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_signer',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_toVerify',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_userHash',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'verify',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_toVerify',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_userHash',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_providerId',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: '_proofSignature',
        type: 'bytes',
      },
    ],
    name: 'verifyAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_toCheck',
        type: 'address',
      },
    ],
    name: 'getStamps',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'id',
            type: 'string',
          },
          {
            internalType: 'string',
            name: '_hash',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'verifiedAt',
            type: 'uint256',
          },
        ],
        internalType: 'struct GithubVerification.Stamp[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_days',
        type: 'uint256',
      },
    ],
    name: 'setVerifyDayThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
