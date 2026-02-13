import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    
    axios.get('http://localhost:5000/api/dados')
      .then(response => {
        setData(response.data.mensagem);
      })
      .catch(error => console.error('Erro:', error));
  }, []);

  return (
    <div>
      <h1>Página Frontend</h1>
      <p>Dados do backend: {data}</p>
    </div>
  );
}
export default App;
