import './App.css';
import { Dashboard } from './views/Dashboard';
import { DataProvider } from './contexts/DataContext';
import { HelmetProvider } from 'react-helmet-async';
import { StyledChart } from './components/chart';
import ThemeProvider from './theme';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <DataProvider>
          <StyledChart />
          <Dashboard />
        </DataProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
