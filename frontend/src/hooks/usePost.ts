import axios from "axios";
import { useEffect, useState } from "react";

interface Response<T> {
  response: T;
  errorMessage: string;
  isLoading: boolean;
  isError: boolean;
}

export const usePost = <T>(apiUrl: string, postData: any): Response<T> => {
  const [response, setResponse] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchFunc = () => {
    axios
      .post(apiUrl, postData)
      .then(response => {
        setResponse(response.data);
        setIsError(false);
      })
      .catch(error => {
        setErrorMessage(error.message);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    fetchFunc();
  }, []);

  return {
    response: response,
    errorMessage: errorMessage,
    isError: isError,
    isLoading: isLoading
  };
};
