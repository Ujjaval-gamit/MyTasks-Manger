import Header from "./cmp/Header"
import React, { useState, useEffect } from 'react'

import { Tasks } from "./cmp/Tasks"
import { AddTask  } from './cmp/AddTask';
import { footer } from "./cmp/Footer";

  const App = (props)=> {
  const [showAddTask, setShowAddTask]=useState(false)
  const[ tasks, setTasks]= useState([])

  useEffect(() => {
       const getTask =async () =>{
         const taskFromServer =await fetchTasks()
         setTasks(taskFromServer)
       }
     getTask()
  } ,[])

//Fetch Task
  const fetchTasks =async ()=> {
    const res=await fetch('http://localhost:5000/tasks')
    const data=await res.json()
   // console.log(data)

    return data
  }

  //Fetch Task For Reminder
  const fetchTask =async (id)=> {
    const res=await fetch(`http://localhost:5000/tasks/${id}`)
    const data=await res.json()
   // console.log(data)

    return data
  }
//ADD
const addTask = async (task) =>{
  const res=await fetch('http://localhost:5000/tasks',
  {
    method:'POST',
    headers:{
       'Content-type' :'application/json'
    },
     body:JSON.stringify(task)
  })
      const data= await res.json()

      setTasks([...tasks, data])
 
//   const id=Math.floor(Math.random()*100)+1
//   const newTask={id, ...task }
//   setTasks([...tasks,newTask])

// }
}
 //delete 
 const DeleteTask = async (id) =>{
  await fetch(`http://localhost:5000/tasks/${id}`,{
    method:'DELETE'
  })
  setTasks(tasks.filter((task)=>task.id !==id))
 }
  // Toggel Reminder
  const toggleReminder = async (id)=> {
    const taskToToggle =await fetchTask(id)
    const updTask={...taskToToggle ,
    reminder: !taskToToggle.reminder}
    
    const res =await fetch(`http://localhost:5000/tasks/${id}`,{
    method:'PUT',
    headers:{
      'Content-type':'application/json',
    },
    body: JSON.stringify(updTask),
  }
    )
   const data=await res.json()
    setTasks(
      tasks.map((task)=> 
      task.id === id? {...task, reminder:
      data.reminder }:task
    ))   
    console.log(id)
  }

  return (
    <div>
      <Header
       onAdd={() =>setShowAddTask
      (!showAddTask) }
       showAdd={showAddTask} />

     {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length >0 ?
      <Tasks tasks={tasks}  onDelete={DeleteTask}
       onToggle={toggleReminder}/>:
      'No Task  Here'
      }
    </div>
  )
}

 export default App;