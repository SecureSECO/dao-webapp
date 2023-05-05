/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const verificationAbi = [
  {
    inputs: [
      {
        internalType: 'uint64',
        name: '_threshold',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: '_reverifyThreshold',
        type: 'uint64',
      },
    ],
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
    inputs: [],
    name: 'reverifyThreshold',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
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
        name: '_signature',
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
        internalType: 'uint64',
        name: '_timestamp',
        type: 'uint64',
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
        internalType: 'string',
        name: '_providerId',
        type: 'string',
      },
    ],
    name: 'unverify',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'str1',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'str2',
        type: 'string',
      },
    ],
    name: 'stringsAreEqual',
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
            name: 'providerId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'userHash',
            type: 'string',
          },
          {
            internalType: 'uint64[]',
            name: 'verifiedAt',
            type: 'uint64[]',
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
        internalType: 'address',
        name: '_toCheck',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
    ],
    name: 'getStampsAt',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'providerId',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'userHash',
            type: 'string',
          },
          {
            internalType: 'uint64[]',
            name: 'verifiedAt',
            type: 'uint64[]',
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
        internalType: 'uint64',
        name: '_days',
        type: 'uint64',
      },
    ],
    name: 'setVerifyDayThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getThresholdHistory',
    outputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'threshold',
            type: 'uint64',
          },
        ],
        internalType: 'struct GithubVerification.Threshold[]',
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
        internalType: 'uint64',
        name: '_days',
        type: 'uint64',
      },
    ],
    name: 'setReverifyThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];