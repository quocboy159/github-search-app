import './App.scss';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <Navbar bg="dark" variant="dark">
              <Container>
                <Navbar.Brand href="/">GitHub Search</Navbar.Brand>
              </Container>
            </Navbar>
            <Container className="mt-4">
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </Container>
          </div>
        </Router>
      </ApolloProvider>
    </>
  );
};

export default App;
