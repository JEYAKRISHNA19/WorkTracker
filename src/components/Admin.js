import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Admin() {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
          try {
            const role = localStorage.getItem('role');
            const empid = localStorage.getItem('empid');
    
            console.log('Retrieved role:', role);
            console.log('Retrieved empid:', empid);
    
            if (!role) {
              navigate('/login');
              return;
            }
          
            const response = await axios.get('http://localhost:8081/admin-dashboard', {
                headers: {
                    'Role': role,
                    'empid':empid
                }
            });
            console.log(response.ressult)
            if (response.data) {
              setEmployees(response.data);
            } else {
              console.error('Unexpected response format:', response.data);
            }
          } catch (err) {
            console.error('Error fetching employees:', err);
    
            if (err.response?.status === 403 || err.response?.status === 401) {
              navigate('/login');
            } else {
              console.error('An unexpected error occurred:', err);
            }
          }
        };
    
        fetchEmployees();
      }, [navigate]);

    const handleDelete = async (sno) => {
        console.log('Deleting employee with SNo:', sno);
        const role = localStorage.getItem('role');
        
        
        try {
            if (!role || role !== 'admin') {
                console.error('Unauthorized attempt to delete.');
                navigate('/login');
                return;
            }
        
            const response = await axios.delete(`http://localhost:8081/admin-dashboard/delete/${sno}`, {
                headers: { 
                    role:'admin', empid : 'VTS2025075' 
                }
            });
        
            if (response.status === 200) {
                setEmployees(prevEmployees => prevEmployees.filter(emp => emp.sno !== sno));
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (err) {
            console.error('Error deleting employee:', err.response ? err.response.data : err.message);
        }
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(employees);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Employees');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, 'employees.xlsx');
    };

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('empid');
        navigate('/');
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name && emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='bg-white rounded p-3' style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <div className='d-flex justify-content-between mb-3'>
                    <Link to="/admin-dashboard/create" className='btn btn-success'>Add +</Link>
                    <button onClick={exportToExcel} className='btn btn-secondary'>Export to Excel</button>
                    <button onClick={handleLogout} className='btn btn-danger'>Logout</button>
                </div>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='form-control mb-3'
                />
                <table className='table pax-6'>
                    <thead>
                        <tr>
                            <th>SNo</th>
                            <th>EmployeeID</th>
                            <th>Name</th>
                            <th>Daily Task</th>
                            <th>Project Allotted</th>
                            <th>Starting Date</th>
                            <th>Expected Due</th>
                            <th>Status</th>
                            <th>Justification</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((emp, index) => (
                            <tr key={index}>
                                <td>{emp.sno}</td>
                                <td>{emp.EmployeeID}</td>
                                <td>{emp.name}</td>
                                <td>{emp.daily_task}</td>
                                <td>{emp.project_allotted}</td>
                                <td>{emp.starting_date}</td>
                                <td>{emp.expected_due}</td>
                                <td>{emp.Status}</td>
                                <td>{emp.justification}</td>
                                <td>
                                    <Link to={`/admin-dashboard/update/${emp.sno}`} className='btn btn-primary'>Update</Link>
                                    <button onClick={() => handleDelete(emp.sno)} className='btn btn-danger'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Admin;
