import { useState } from 'react';

const StatusPoster = (props) => {

    const [status, setStatus] = useState('');


    const handleChangeStatus = (e) => {
        setStatus(e.target.value);
    }


    const handleSubmit = (e) => {
       

        e.preventDefault();
        setStatus('');
    
    }




    return (
      <form onSubmit={(e) => { handleSubmit(e) }}>
            <label htmlFor='status'>
             <textarea placeholder="What's happening?" value={status}  onChange={(e) => { handleChangeStatus(e)}} />
            </label>
        <input type="submit" value="Tweet" />
        </form>
        
    )

}



export default StatusPoster;