import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ChartComponent from './ChartComponent';
import MapComponent from './MapComponent';

function App() {
  const [containers, setContainers] = useState([]);
  const [newContainer, setNewContainer] = useState({
    container_number: '',
    rua: '',
    quadra: '',
    pilha: '',
    posicao: ''
  });
  const [editContainer, setEditContainer] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  useEffect(() => {
    fetchContainers();
  }, []);

  const fetchContainers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/containers');
      setContainers(response.data);
      generateChartData(response.data);
    } catch (error) {
      console.error('Erro ao buscar containers:', error);
    }
  };

  const generateChartData = (containers) => {
    const data = {};
    containers.forEach(container => {
      const key = `${container.rua}-${container.quadra}`;
      if (data[key]) {
        data[key]++;
      } else {
        data[key] = 1;
      }
    });
    setChartData({
      labels: Object.keys(data),
      values: Object.values(data)
    });
  };

  const registerContainer = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/register', newContainer);
      setNewContainer({
        container_number: '',
        rua: '',
        quadra: '',
        pilha: '',
        posicao: ''
      });
      fetchContainers();
    } catch (error) {
      console.error('Erro ao registrar container:', error);
    }
  };

  const updateContainer = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:5000/update/${id}`, editContainer);
      setEditContainer(null);
      fetchContainers();
    } catch (error) {
      console.error('Erro ao atualizar container:', error);
    }
  };

  const deleteContainer = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/delete/${id}`);
      fetchContainers();
    } catch (error) {
      console.error('Erro ao remover container:', error);
    }
  };

  return (
    <div className="App">
      <h1>Terminal de Containers</h1>
      <div>
        <h2>Registrar Novo Container</h2>
        <input
          type="text"
          placeholder="Número do Container"
          value={newContainer.container_number}
          onChange={(e) => setNewContainer({ ...newContainer, container_number: e.target.value })}
        />
        <input
          type="text"
          placeholder="Rua"
          value={newContainer.rua}
          onChange={(e) => setNewContainer({ ...newContainer, rua: e.target.value })}
        />
        <input
          type="text"
          placeholder="Quadra"
          value={newContainer.quadra}
          onChange={(e) => setNewContainer({ ...newContainer, quadra: e.target.value })}
        />
        <input
          type="text"
          placeholder="Pilha"
          value={newContainer.pilha}
          onChange={(e) => setNewContainer({ ...newContainer, pilha: e.target.value })}
        />
        <input
          type="number"
          placeholder="Posição"
          value={newContainer.posicao}
          onChange={(e) => setNewContainer({ ...newContainer, posicao: e.target.value })}
        />
        <button onClick={registerContainer}>Registrar</button>
      </div>
      <div>
        <h2>Containers Registrados</h2>
        <ul>
          {containers.map((container) => (
            <li key={container.id}>
              {editContainer && editContainer.id === container.id ? (
                <>
                  <input
                    type="text"
                    value={editContainer.container_number}
                    onChange={(e) => setEditContainer({ ...editContainer, container_number: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editContainer.rua}
                    onChange={(e) => setEditContainer({ ...editContainer, rua: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editContainer.quadra}
                    onChange={(e) => setEditContainer({ ...editContainer, quadra: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editContainer.pilha}
                    onChange={(e) => setEditContainer({ ...editContainer, pilha: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editContainer.posicao}
                    onChange={(e) => setEditContainer({ ...editContainer, posicao: e.target.value })}
                  />
                  <button onClick={() => updateContainer(container.id)}>Salvar</button>
                  <button onClick={() => setEditContainer(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  {container.container_number} - Rua: {container.rua}, Quadra: {container.quadra}, Pilha: {container.pilha}, Posição: {container.posicao}
                  <button onClick={() => setEditContainer(container)}>Editar</button>
                  <button onClick={() => deleteContainer(container.id)}>Remover</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ChartComponent data={chartData} />
      </div>
      <div>
        <MapComponent containers={containers} />
      </div>
    </div>
  );
}

export default App;
