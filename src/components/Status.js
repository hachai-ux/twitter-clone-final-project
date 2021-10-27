const Status = (props) => {
    return (
        <div>
            <div>{props.doc.data().name}</div>
            <div>{props.doc.data().status}</div>
            <div>{props.doc.data().timestamp.toDate().toString()}</div>
         
       
           
        </div>
    )
}

export default Status;