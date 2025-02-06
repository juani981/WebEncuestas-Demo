import React, {useEffect} from 'react'
import { getData } from '../helpers/apiFetch'


export const Mock = () => {
    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getData();
            console.log('Datos:', data);
          } catch (error) {
            // Handle error if needed
          }
        };
    
        fetchData();
      }, []);
  return (
    <>
    Esto es un Mock
    </>
  )
}
