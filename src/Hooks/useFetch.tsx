import React from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>( url: RequestInfo | URL, options?: RequestInit): FetchState<T> {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    const {signal} = controller;

    const fetchData = async () => {
      setLoading(true);
      setData(null)
      try{
         const response = await fetch(url, { signal, ...options });
         if(!response.ok) throw new Error(`Error: ${response.status}`)
         const json = await response.json();
         if(!signal.aborted)setData(json);
      }catch(error){
        if(!signal.aborted && error instanceof Error) setError(error.message)
      }finally{
        if(!signal.aborted) setLoading(false)
      }
     
    }
    fetchData();

    return () => {
      controller.abort();
    }
  },[url])

  return { data, loading, error };
}

export default useFetch;
