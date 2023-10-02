import './App.css';
import { Dashboard } from './views/Dashboard';
import { DataProvider } from './contexts/DataContext';

function App() {
  return (
    <DataProvider>
        <Dashboard />
    </DataProvider>
  );
}

export default App;
