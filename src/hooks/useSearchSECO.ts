/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getErrorMessage } from '@/src/lib/utils';
import { useState } from 'react';

type QueryResponse = any;
type CheckResponse = any;

type UseSearchSECOProps = {
  useDummyData?: boolean;
};

type UseSearchSECOData = {
  queryResult: QueryResponse;
  hashCount: number | null;
  runQuery: (url: string, token: string) => Promise<QueryResponse>;
  checkHashes: (hashes: string[]) => Promise<any>;
};

interface ResultData {
  Hash: string;
  FileName: string;
  FunctionName: string;
  LineNumber: number;
  LineNumberEnd: number;
}

export const dummyQueryResult = {
  methodData: [
    {
      method_hash: '9917d1b8a373ac2ac6d92ced37558db2',
      projectID: '1790983771',
      startVersion: '1527703251000',
      startVersionHash: '75e749a7926a3ae2dfd5b2eaab6d15956f73381a',
      endVersion: '1527797086000',
      endVersionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      method_name: '',
      file: 'test.js',
      lineNumber: '7',
      parserVersion: '1',
      vulnCode: '',
      authorTotal: 'MIT License',
      authorIds: [
        '3',
        '0af1d147-b483-76a7-9e14-7f6828b94a60',
        '66163fed-c2bd-940d-b4a6-ec6e153a90c4',
        'a6ad6bc8-a201-ff89-c5d3-0ea9c00a16d0',
      ],
    },
    {
      method_hash: '897dadeff0b5432633e7f4a8b568fe9f',
      projectID: '1790983771',
      startVersion: '1527797086000',
      startVersionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      endVersion: '1527797086000',
      endVersionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      method_name: 'isOdd',
      file: 'index.js',
      lineNumber: '12',
      parserVersion: '1',
      vulnCode: '',
      authorTotal: 'MIT License',
      authorIds: [
        '2',
        '0af1d147-b483-76a7-9e14-7f6828b94a60',
        '66163fed-c2bd-940d-b4a6-ec6e153a90c4',
      ],
    },
    {
      method_hash: '8c5d123198562f030ee15579e08e4224',
      projectID: '1790983771',
      startVersion: '1527703251000',
      startVersionHash: '75e749a7926a3ae2dfd5b2eaab6d15956f73381a',
      endVersion: '1527797086000',
      endVersionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      method_name: '',
      file: 'test.js',
      lineNumber: '28',
      parserVersion: '1',
      vulnCode: '',
      authorTotal: 'MIT License',
      authorIds: ['1', '0af1d147-b483-76a7-9e14-7f6828b94a60'],
    },
    {
      method_hash: '16d5818bec817cdab47ed68b07aa511c',
      projectID: '1790983771',
      startVersion: '1527703251000',
      startVersionHash: '75e749a7926a3ae2dfd5b2eaab6d15956f73381a',
      endVersion: '1527797086000',
      endVersionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      method_name: '',
      file: 'test.js',
      lineNumber: '19',
      parserVersion: '1',
      vulnCode: '',
      authorTotal: 'MIT License',
      authorIds: ['1', '0af1d147-b483-76a7-9e14-7f6828b94a60'],
    },
    {
      method_hash: '6bac8a660e8db4b32ab77c5fb8682744',
      projectID: '1790983771',
      startVersion: '1527703251000',
      startVersionHash: '75e749a7926a3ae2dfd5b2eaab6d15956f73381a',
      endVersion: '1527797086000',
      endVersionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      method_name: '',
      file: 'test.js',
      lineNumber: '8',
      parserVersion: '1',
      vulnCode: '',
      authorTotal: 'MIT License',
      authorIds: ['1', '0af1d147-b483-76a7-9e14-7f6828b94a60'],
    },
  ],
  authorData: [
    {
      username: 'Error parsing author id: 3',
    },
  ],
  projectData: [
    {
      id: '1790983771',
      versionTime: '1527703251000',
      versionHash: '75e749a7926a3ae2dfd5b2eaab6d15956f73381a',
      license: 'MIT License',
      name: 'is-odd',
      url: 'https://github.com/i-voted-for-trump/is-odd',
      authorName: 'a601fbd4-9cbd-62d8-2587-fd60d02e296b',
      authorMail: '1',
    },
    {
      id: '1790983771',
      versionTime: '1527797086000',
      versionHash: 'a80ee0d831a8ee69f1fad5b4673491847975eb26',
      license: 'MIT License',
      name: 'is-odd',
      url: 'https://github.com/i-voted-for-trump/is-odd',
      authorName: 'a601fbd4-9cbd-62d8-2587-fd60d02e296b',
      authorMail: '1',
    },
  ],
};

/**
 * Utility functions to interact with the SearchSECO database and API
 * @returns Functions and results of interacting with the SearchSECO database and API
 */
export const useSearchSECO = ({
  useDummyData,
}: UseSearchSECOProps): UseSearchSECOData => {
  const [queryResult, setQueryResult] = useState<CheckResponse | null>(null);
  const [hashCount, setHashCount] = useState<number | null>(null);

  const API_URL = import.meta.env.VITE_SEARCHSECO_API_URL;

  const runQuery = async (
    url: string,
    token: string
  ): Promise<QueryResponse> => {
    if (useDummyData) {
      setQueryResult(dummyQueryResult);
      setHashCount(dummyQueryResult.methodData.length);
      return Promise.resolve();
    }

    try {
      const response = await fetch(`${API_URL}/fetch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          token,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const res = await response.json();
      setQueryResult(res);

      const hashes = res.map((result: ResultData) => result.Hash);
      setHashCount(hashes.length);

      return res;
    } catch (e) {
      console.error(e);
      throw getErrorMessage(e);
    }
  };

  const checkHashes = async (hashes: string[]): Promise<CheckResponse> =>
    new Promise((resolve, reject) => {
      return fetch(`${API_URL}/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hashes }),
      })
        .then((response) => {
          if (!response.ok)
            reject(`API request failed with status ${response.status}`);
          return response.json();
        })
        .then((res) => {
          setQueryResult(res);
          resolve(res);
        })
        .catch((e) => {
          console.error(e);
          reject(getErrorMessage(e));
        });
    });

  return {
    queryResult,
    hashCount,
    runQuery,
    checkHashes,
  };
};
