import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateEmployee() {
    const [sno, setSno] = useState('');
    const [EmployeeID, setEmployeeID] = useState(''); // Update this to empid
    const [name, setName] = useState('');
    const [dailyTask, setDailyTask] = useState('');
    const [projectAllotted, setProjectAllotted] = useState('');
    const [startingDate, setStartingDate] = useState('');
    const [expectedDue, setExpectedDue] = useState('');
    const [status, setStatus] = useState('');
    const [justification, setJustification] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const role = localStorage.getItem('role');
            
            if (!role) {
                console.error('Role not found in localStorage');
                navigate('/login');
                return;
            }
    
            const requestBody = {
                sno,
                EmployeeID, 
                name,
                daily_task: dailyTask,
                project_allotted: projectAllotted,
                starting_date: startingDate,
                expected_due: expectedDue,
                Status: status,
                justification,
            };

            const response = await axios.post('http://localhost:8081/admin-dashboard/create', requestBody, {
                headers: {
                    'Role': role 
                }
            });
            console.log('response: ', response);
    
            console.log('Record created:', response.data);
            navigate('/admin-dashboard');
        } catch (err) {
            console.error('Error creating employee:', err.response ? err.response.data : err.message);
        }
    };
    

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='bg-white rounded p-3 w-50 mt-5 'style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <h2>Create Employee</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-2'>
                        <label htmlFor='sno' className='form-label'>SNo</label>
                        <input
                            type="text"
                            id='sno'
                            value={sno}
                            onChange={(e) => setSno(e.target.value)}
                            className='form-control'
                            placeholder='Enter SNo'
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='EmployeeID' className='form-label'>EmployeeID</label>
                           <input
                           type="text"
                           id='EmployeeID'
                           value={EmployeeID} // Updated
                           onChange={(e) => setEmployeeID(e.target.value)}
                           className='form-control'
                           placeholder='Enter Employee ID'
                           />
                    </div>

                    <div className='mb-2'>
                        <label htmlFor='name' className='form-label'>Name</label>
                        <input
                            type="text"
                            id='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='form-control'
                            placeholder='Enter Name'
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='dailyTask' className='form-label'>Daily Task</label>
                        <input
                            type="text"
                            id='dailyTask'
                            value={dailyTask}
                            onChange={(e) => setDailyTask(e.target.value)}
                            className='form-control'
                            placeholder='Enter Daily Task'
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='projectAllotted' className='form-label'>Project Allotted</label>
                        <input
                            type="text"
                            id='projectAllotted'
                            value={projectAllotted}
                            onChange={(e) => setProjectAllotted(e.target.value)}
                            className='form-control'
                            placeholder='Enter Project Allotted'
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='startingDate' className='form-label'>Starting Date</label>
                        <input
                            type="date"
                            id='startingDate'
                            value={startingDate}
                            onChange={(e) => setStartingDate(e.target.value)}
                            className='form-control'
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='expectedDue' className='form-label'>Expected Due</label>
                        <input
                            type="date"
                            id='expectedDue'
                            value={expectedDue}
                            onChange={(e) => setExpectedDue(e.target.value)}
                            className='form-control'
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='status' className='form-label'>Status</label>
                        <input
                            type="text"
                            id='status'
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className='form-control'
                            placeholder='Enter Status'
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='justification' className='form-label'>Justification</label>
                        <textarea
                            id='justification'
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            className='form-control'
                            placeholder='Enter Justification'
                        />
                    </div>
                    <button type='submit' className='btn btn-success'>Create</button>
                </form>
            </div>
        </div>
    );
}

export default CreateEmployee;
