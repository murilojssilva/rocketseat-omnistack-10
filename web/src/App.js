import React, {useState,useEffect} from 'react';
import api from './services/api';
import DevItem from "./components/DevItem";
import DevForm from "./components/DevForm";
import './global.css';
import './App.css';
import './sidebar.css';
import './main.css';
// Componente: Bloco isolado de HTML, CSS, e JS o qual não interfere no restante da aplicação
// Propriedade: Informaçãoes que um componente PAI passa para o componente FILHO
// Estado: Informações mantidas pelo componente (Lembrar: imutabilidade)

function App() {
  const [devs,setDevs] = useState('[')
  const [latitude,setLatitude] = useState('')
  const [longitude,setLongitude] = useState('')
  const [github_username, setGithubUsername] = useState('')
  const [techs, setTechs] = useState('')
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude ,longitude} = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err) => {
        console.log(err);
      },
      {
        timeout: 30000,
      }
    )
  }, []);
  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }

    loadDevs();
  },[]);
  async function handleAddDev(e) {
    e.preventDefault();

    const response = await api.post('/devs',{
      github_username,
      techs,
      latitude,
      longitude,
    });
    setGithubUsername('');
    setTechs('');
    setDevs([...devs,response.data])
  }
  async function handleRemoveDev(id) {
    const response = await api.delete(`/devs/${id}`);

    if (response.data) {
      const filteredDevs = devs.filter(dev => dev._id !== id);
      setDevs(filteredDevs);
    }
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit={handleAddDev}>
          <div className="input-block">
            <label htmlFor="github_username">Usuário do GitHub</label>
            <input value={github_username} onChange={e => setGithubUsername(e.target.value)} name="github_username" id="github_username" required></input>
          </div>
          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input value={techs} onChange={e => setTechs(e.target.value)} name="techs" id="techs" required></input>
          </div>
          <div className="input-group">
            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input type="number" value={latitude} onChange={e => setLatitude(e.target.value)} name="latitude" id="latitude" required></input>
            </div>
            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input type="number" value={longitude} onChange={e => setLongitude(e.target.value)} name="longitude" id="longitude" required></input>
            </div>
          </div>
          <button type="submit">Salvar</button>
        </form>
      </aside>
      <main>
        <ul>
          <ul>
            {dev.map(dev => (
              <DevItem key={dev._id} dev={dev} />
            ))}
          </ul>
        </ul>
      </main>
    </div>
  );
}

export default App;