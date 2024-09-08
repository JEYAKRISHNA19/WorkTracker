import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateEmployee() {
    const [status, setStatus] = useState('');
    const [justification, setJustification] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { sno } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchEmployee = async () => {
            setLoading(true);
            try {
                const role = localStorage.getItem('role');
                const empid = localStorage.getItem('empid');
    
                if (role !== 'admin') {
                    navigate('/login');
                    return;
                }
    
                const response = await axios.get(`http://localhost:8081/admin-dashboard/update/${sno}`, {
                    headers: {
                        'Authorization': `Bearer ${role}`,
                        'Role': role ,
                        'empid':empid
                    }
                });
    
                setStatus(response.data?.Status || '');
                setJustification(response.data?.justification || '');
            } catch (err) {
                console.error('Error fetching employee:', err.response?.data || err.message);
                setError('Failed to fetch employee data.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchEmployee();
    }, [sno, navigate]);
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
           
            const role = localStorage.getItem('role');
            const empid=localStorage.getItem('empid') // Get role from localStorage

            if (role !== 'admin' ) {
                navigate('/login');
                return;
            }

            await axios.put(`http://localhost:8081/admin-dashboard/update/${sno}`, {
                Status: status,
                justification
            }, {
                headers: { 
                    'Authorization': `Bearer ${role}`,
                    'Role': role,
                    'empid': empid// Include role in headers if required by backend
                }
            });

            navigate('/admin-dashboard');
        } catch (err) {
            console.error('Error updating employee:', err.response?.data || err.message);
            setError('Failed to update employee.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <h2>Update Employee</h2>
                {error && <div className='alert alert-danger'>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-2'>
                        <label>Status</label>
                        <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} className='form-control' required />
                    </div>
                    <div className='mb-2'>
                        <label>Justification</label>
                        <textarea value={justification} onChange={(e) => setJustification(e.target.value)} className='form-control' required></textarea>
                    </div>
                    <button type="submit" className='btn btn-success'>Update</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateEmployee;
