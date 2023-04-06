import { useState, useEffect } from 'react';
import { getAuthor, uploadProject } from '../services/databaseApi'

type Author = string;
type ProjectData = string

export function useGetAuthor(authorId: Author) {
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

export function useUploadProject(projectData: ProjectData){
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [author, setAuthor] = useState<Author | null>(null);

    useEffect(() => {
      const upload = async () => {
        setLoading(true);
        try {
          const fetchedAuthor = await uploadProject(projectData);
          setAuthor(fetchedAuthor);
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      };
  
      upload();
    }, [projectData]);
  
    return { loading, error, author };

}