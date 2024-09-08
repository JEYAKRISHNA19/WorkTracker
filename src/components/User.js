import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function User() {
    const [userData, setUserData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const role = localStorage.getItem('role');
            console.log('role: ', role);
            const empid = localStorage.getItem('empid');
            console.log('empid: ', empid);
    
            if (role !== 'user' || !empid) {
              navigate('/login');
              return;
            }
           
            const response = await axios.get('http://localhost:8081/user-dashboard', {
              headers: {
                'Role': role,
                'empid':empid
            }
            });
            console.log('response: ', response);
    
            setUserData(response.data);
          } catch (err) {
            console.error('Error fetching user data:', err.response || err.message);
            setError(err.response ? err.response.data : err.message);
          }
        };
    
        fetchUserData();
      }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('empid');
        navigate('/');
    };

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='bg-white rounded p-3'>
                <div className='d-flex justify-content-between mb-3'>
                    <h2>User Dashboard</h2>
                    <button onClick={handleLogout} className='btn btn-warning'>Logout</button>
                </div>
               
                <table className='table'>
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
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.sno}</td>
                                <td>{data.EmployeeID}</td>
                                <td>{data.name}</td>
                                <td>{data.daily_task}</td>
                                <td>{data.project_allotted}</td>
                                <td>{data.starting_date}</td>
                                <td>{data.expected_due}</td>
                                <td>{data.Status}</td>
                                <td>{data.justification}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default User;
