import './App.css';
import Header from './components/Header';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import CoinPage from './pages/CoinPage';
import Home from './pages/Home';
import { makeStyles } from '@material-ui/core/styles';
import Alert from './components/Alert';

const useStyles = makeStyles({
  App: {
    backgroundColor: '#14161a',
    color:"white",
    minHeight:"100vh"
  },
});
function App() {
  const classes = useStyles();
      
  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/coins/:id" element={<CoinPage />} />
        </Routes>
      </div>
    <Alert />
    </BrowserRouter>
  );
}

export default App;
