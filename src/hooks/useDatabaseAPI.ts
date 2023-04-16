import { useState, useCallback } from 'react';
import { TCPClient, RequestType, TCPResponse } from '../TCPClient';

type UseDatabaseAPIConfig = {
  host: string;
  port: number;
  clientName: string;
};

type UseDatabaseAPIResult = {
  loading: boolean;
  error: Error | null;
  response: TCPResponse | null;
  sendRequest: (type: RequestType, data: string[]) => Promise<void>;
};

export const useDatabaseAPI = (config: UseDatabaseAPIConfig): UseDatabaseAPIResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<TCPResponse | null>(null);

  const client = new TCPClient(config.clientName, config.port, config.host);

  const sendRequest = useCallback(
    async (type: RequestType, data: string[]) => {
      setLoading(true);
      setError(null);
      setResponse(null);
      try {
        const resp = await client.Fetch(type, data);
        setResponse(resp);
        setLoading(false);
      } catch (error) {
        const err = error as Error;
        setError(err);
        setLoading(false);
      }
    },
    [client]
  );

  return {
    loading,
    error,
    response,
    sendRequest,
  };
};