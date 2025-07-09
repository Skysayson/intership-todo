import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TodoList from './pages/TodoList';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/todo" element={<TodoList />} />
    </Routes>
  );
}

export default App;
