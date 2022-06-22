import {useEffect ,useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm  } from "react-hook-form";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import axios from "axios";
import '../../css/taskPage.css';
import { AiFillEdit ,AiOutlineDelete } from "react-icons/ai";

function Tasks() {
    const { register, handleSubmit ,reset ,setValue } = useForm({
        defaultValues:{
            'title':'',
            'description':'',
            'priority':'Medium',
            'status':'TODO',
            'startDate':'',
            'endDate':''
        }
    });
    let navigate = useNavigate();
    const [tasks , setTask] = useState([]);
    const [editMode , setEditMode] = useState(false);
    const [editId , setEditId] = useState(false);
    const [errors , setErrors] = useState();
    let token = localStorage.getItem('token');
    let headers ={
        'X-Requested-With': 'XMLHttpRequest',
      'Content-Type' : 'application/json',
        'Authorization': 'Bearer '+token
      }
    useEffect(()=>{
        let check = async ()=>{
            // await axios.get(`${process.env.REACT_APP_BASE_URL}/user/checkauth`,{headers})
            await axios.get(`/user/checkauth`,{headers})
                .catch(function (error) {
                    console.log(error);
                    navigate('/');
                });
            // await axios.get(`${process.env.REACT_APP_BASE_URL}/task`,{headers})
            await axios.get(`/task`,{headers})
            .then(function ({data}) {
                setTask(data);
            })
            .catch(function (error) {
                console.log(error);
            }); 
        }
        check();
    },[navigate]);
    const addTask = async (data)=>{
        // await axios.post(`${process.env.REACT_APP_BASE_URL}/task/create`,data ,{headers})
        await axios.post(`/task/create`,data ,{headers})
            .then(function ({data}) {
                setTask(currentArray => [...currentArray, data]);
                reset();
            })
            .catch(function (error) {
                console.log(error.response.data.errors);
                setErrors();
                let obj = {};
                for (const singleError in error.response.data.errors) {
                     obj = {[singleError] : error.response.data.errors[singleError].message};
                     setErrors( obj);
                    }
                }); 
    }
    const updateTask = async(id)=>{
        // await axios.get(`${process.env.REACT_APP_BASE_URL}/task/update/${id}` ,{headers})
        await axios.get(`/task/update/${id}` ,{headers})
            .then(function ({data}) {
                setEditMode(true);
                setEditId(id);
                setValue('title',data.title);
                setValue('description',data.description);
                setValue('priority',data.priority);
                setValue('status',data.status);
                setValue('startDate',data.startDate);
                setValue('endDate',data.endDate);
                const element = document.getElementById("form");
                element.scrollIntoView();
            })
            .catch(function (error) {
                console.log(error);
            }); 
    }
    const editTask = async(data)=>{
        // await axios.patch(`${process.env.REACT_APP_BASE_URL}/task/edit/${editId}`,data ,{headers})
        await axios.patch(`/task/edit/${editId}`,data ,{headers})
            .then(function ({data}) {
                setTask(currentArray => {
                    currentArray = currentArray.filter((e)=>{
                        return e._id !== editId ;
                    });
                    return[...currentArray ,data]});
                reset(); setEditMode(false); setEditId(false);
            })
            .catch(function (error) {
                console.log(error);
            }); 
    }
    const deletTask =async (id)=>{
        let deleteRequest = ()=>{
            //  axios.delete(`${process.env.REACT_APP_BASE_URL}/task/delete/${id}` ,{headers})
             axios.delete(`/task/delete/${id}` ,{headers})
            .then(function () {
                setTask(currentArray => {
                    currentArray = currentArray.filter((e)=>{
                        return e._id !== id ;
                    });
                    return[...currentArray]});
            })
            .catch(function (error) {
                console.log(error);
            }); 
        }
        confirmAlert({
            title: 'Confirm delete',
            message: 'Are you sure to delete tsak.',
            buttons: [
              {
                label: 'Yes',
                onClick: () => deleteRequest()
              },
              {
                label: 'No'
              }
            ]
          });
    }
  return (
        <div className="page-content page-container" id="page-content">
            <div className="padding">
                <div className="row container d-flex justify-content-center">
                    <div className="col-md-12">
                        <div className="card px-3">
                            <div className="card-body" onSubmit={addTask}>
                            <form onSubmit={editMode? handleSubmit(editTask) :handleSubmit(addTask)} id="form">
                                    <h4 className="card-title"> Todo list</h4>
                                    <div className="add-items  d-flex"> 
                                    <label className='col-3'>title</label>
                                    <input name='title'  {...register("title")}
                                    type="text" className="form-control todo-list-input" placeholder="What do you need to do today?"/> 
                                    </div>
                                     {errors && errors.title && <p className="red col-12">{errors.title}</p>}
                                    <div className="add-items d-flex "> 
                                    <label className='col-3'>Description</label>
                                    <input  name='description' {...register("description")}
                                    type="text" className="form-control todo-list-input col-9" placeholder="What do you need to do today?"/> 
                                    </div>
                                    {errors && errors.description && <p className="red" >{errors.description}</p>}
                                    <div className="add-items d-flex"> 
                                        <label className='col-3'>priority</label>
                                        <select name='priority' {...register("priority")}
                                        className="form-select" aria-label="Default select example">
                                            <option value=''>Open this select menu</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </div>
                                        {errors && errors.priority && <p className="red">{errors.priority}</p>}
                                    <div className="add-items d-flex"> 
                                    <label className='col-3'>status</label>
                                    <select name='status' {...register("status")}
                                    className="form-select" aria-label="Default select example">
                                            <option value=''>Open this select menu</option>
                                            <option value="TODO">TODO</option>
                                            <option value="IN progress">IN progress</option>
                                            <option value="review">review</option>
                                            <option value="Rework">Rework</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                        {errors && errors.status && <p className="red">{errors.status}</p>}
                                    <div className="add-items d-flex"> 
                                    <label className='col-3'>Start Date</label>
                                    <input name='startDate' {...register("startDate")}
                                    type="date" className="form-control todo-list-input"/> 
                                    </div>
                                     {errors && errors.startDate && <p className="red">{errors.startDate}</p>}
                                    <div className="add-items d-flex"> 
                                    <label className='col-3'>End Date</label>
                                    <input name='endDate' {...register("endDate")}
                                    type="date" className="form-control todo-list-input"/> 
                                    </div>
                                     {errors && errors.endDate && <p className="red">{errors.endDate}</p>}
                                    {editMode}
                                    {
                                        !editMode ? 
                                        (<div className="add-items d-flex"> <button type="submit" className="add btn btn-primary font-weight-bold todo-list-add-btn">Add</button> 
                                        <button onClick={()=>{reset();setErrors(false);}} type="button" className="add btn btn-primary font-weight-bold todo-list-add-btn">reset</button></div> )
                                        :
                                        ( <div className="add-items d-flex"><button type="submit" className="add btn btn-primary font-weight-bold todo-list-add-btn">edit</button> 
                                        <button onClick={()=>{reset(); setErrors(false); setEditMode(false); setEditId(false);}} type="button" className="add btn btn-primary font-weight-bold todo-list-add-btn">cancel</button></div> )
                                        
                                    }
                                        
                                    
                                </form>
                                <div className="list-wrapper">
                                <h2>My Tasks</h2>
                                    <ul className=" row">
                                    
                                    {
                                        tasks.sort(function(a,b){
                                            return (a.createdAt > b.createdAt)? 1 : -1 ;
                                        }).map(task=>{
                                            return(
                                                <div key={task._id} className="col-md-4 col-sm-6 content-card">
                                                    <div className="card-big-shadow">
                                                        <div className="card card-just-text" data-background="color" data-color="blue" data-radius="none">
                                                            <div className="content">
                                                                <h4 className="title">{task.title}</h4>
                                                                <p className="description">{task.description} </p>
                                                                <p className="description">status: {task.status} & priority :{task.priority} </p>
                                                                <p className="description">from {task.startDate && new Date(task.startDate).toDateString()} to {task.endDate && new Date(task.endDate).toDateString()}  </p>
                                                                <span onClick={()=>updateTask(task._id)}><AiFillEdit className='float-end font-25 pointer mx-2'  /></span>
                                                                <span onClick={()=>deletTask(task._id)}><AiOutlineDelete className='float-end font-25 pointer mx-s'  /></span>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Tasks