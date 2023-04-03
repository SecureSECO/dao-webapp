import { useState, useEffect } from 'react';
import { getAuthor } from '../services/databaseApi'

type Author = string;

export function useGetAuthor(authorId: string) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [author, setAuthor] = useState<Author | null>(null);

    useEffect(() => {
        const fetchAuthor = async () => {
          setLoading(true);
          try {
            const fetchedAuthor = await getAuthor(authorId);
            setAuthor(fetchedAuthor);
          } catch (error) {
            setError((error as Error).message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchAuthor();
      }, [authorId]);
    
      return { loading, error, author };
}