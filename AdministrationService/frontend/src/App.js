import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UsersTable from './UsersTable';
import UserForm from './UserForm';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UsersTable />} />
                <Route path="/users/new" element={<UserForm />} />
                <Route path="/users/:login" element={<UserForm />} /> {/* Изменено с :id на :login */}
            </Routes>
        </Router>
    );
}

export default App;