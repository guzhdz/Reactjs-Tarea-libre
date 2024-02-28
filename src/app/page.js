'use client'
import "./globals.css";
import styles from "./page.module.css";
import { MdTask } from "react-icons/md";
import { IoIosCheckboxOutline } from "react-icons/io";
import { useState } from "react";
import { IoIosCheckbox } from "react-icons/io";

function Header({onClickMenuOption, menuOption}) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <MdTask className={styles.icon} />
        <span>TaskOn</span>
      </div>

      <NavMenu onClickMenuOption={onClickMenuOption} menuOption={menuOption}/>
    </header>
  );
}

function NavMenu({onClickMenuOption, menuOption}) {
  const handleClickMenuOption = (option) => {
    onClickMenuOption(option)
  }

  return (
    <>
      <u className={styles.menu}>
        <li style={menuOption == 0 ? {color: 'var(--tertiary)'} : {}} onClick={() => handleClickMenuOption(0)}>All tasks</li>
        <li onClick={() => handleClickMenuOption(1)} style={menuOption == 1 ? {color: 'var(--tertiary)'} : {}}>Work</li>
        <li onClick={() => handleClickMenuOption(2)} style={menuOption == 2 ? {color: 'var(--tertiary)'} : {}}>Personal</li>
        <li onClick={() => handleClickMenuOption(3)}style={menuOption == 3 ? {color: 'var(--tertiary)'} : {}}>Interest</li>
      </u>
    </>
  );
}

function TitleContainer({onAddClick}) {
  return(
    <div className={styles.title_container}>
      <h1>Task Manager</h1>
      <AddButton onAddClick={onAddClick}/>
    </div>
  );
}

function AddButton({onAddClick}) {
  return (
    <button className={styles.add_button} onClick={() => onAddClick()}>Add Task</button>
  );
}

function TasksContainer({ type, tasksList, onTaskClick, menuOption}) {
  const listWorkTasks = tasksList.filter(task => task.type == "work");
  const listPersonalTasks = tasksList.filter(task => task.type == "personal");
  const listInterestTasks = tasksList.filter(task => task.type == "interest");

  const workTask = <TypeTasks type={type} subtitle="Work" tasks={listWorkTasks} onTaskClick={onTaskClick}/>;
  const personalTasks = <TypeTasks type={type} subtitle="Personal" tasks={listPersonalTasks} onTaskClick={onTaskClick}/>;
  const interestTasks = <TypeTasks type={type} subtitle="Interest" tasks={listInterestTasks} onTaskClick={onTaskClick}/>;

  let title = "";
  if(type == 0)
    title = "Tasks"
  else {
    title = "Done";
  }  
  return (
    <div className={`${styles.tasks_container} ${type == 1 ? styles.left_margin : ""}`}>
      <h3>{ title }</h3>
      {menuOption == 1 || menuOption == 0 ? workTask : null}
      {menuOption == 2 || menuOption == 0 ? personalTasks : null}
      {menuOption == 3 || menuOption == 0 ? interestTasks : null}
    </div>
  );
}

function TypeTasks({ type, subtitle, tasks, onTaskClick}) {
  const handleTaskDisk = (text, type) => {
    onTaskClick(text, type);
  };

  let icon;
  if(type == 0) {
    icon = <IoIosCheckboxOutline className={styles.icon}/>
  } else {
    icon = <IoIosCheckbox className={styles.icon}/>
  }

  const listTasks = tasks.map((task, index) =>
      <div key={index} onClick={() => handleTaskDisk(task.text, task.type)}>
        {icon}
        <span>{task.text}</span>
      </div>
  );

  const noContent = "There is no tasks in this category";

  return (
    <div className={styles.type_tasks}>
      <div className={styles.type_header}>
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
      <div className={styles.task_container} >
        {listTasks.length == 0 ? noContent : listTasks}
      </div>
    </div>
  );
}

function AddModal({show, onAddTask, onCancel}) {
  return (
    <div id="addModal" className={styles.modal} style={show}>
      <div className={styles.modal_body}>
        <div className={styles.modal_header}>
          <span>Add new task</span>
        </div>

      <AddFormContent onAddTask={onAddTask} onCancel={onCancel}/>
      </div>
    </div>
  );
}

function AddFormContent({onAddTask, onCancel}) {
  const [validForm, setValidForm] = useState(false);
  const [description, setdescription] = useState("");
  const [category, setCategory] = useState("work");

  const handleClickAdd = async () => {
    await onAddTask(description, category);
    setdescription("");
    setCategory("work");
    setValidForm(false);
  }

  const handleInputChange = (event) => {
    setdescription(event.target.value);
    if(event.target.value !== "") {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  }

  const handleSelectChange = (event) => {
    setCategory(event.target.value);
  }

  return (
    <>
        <div className={styles.modal_content}>
        <div className={styles.input_container}>
          <label>Description</label>
          <input type="text"  placeholder="Wash the car..." value={description} required 
          onChange={handleInputChange}/>
        </div>

        <div className={styles.input_container}>
          <label>Select Ctaegory</label>
          <select id="opciones" name="opciones" value={category}
          onChange={handleSelectChange}>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="interest">Interest</option>
          </select>
        </div>
      </div>

      
      <div className={styles.actions}>
          <button className={styles.cancel_button} onClick={onCancel}>Cancelar</button>
          <button className={styles.ok_button} disabled={!validForm} onClick={handleClickAdd}>Add</button>
        </div>
    </>
  );
}

export default function Home() {
  const [listTasks, setListTasks] = useState([
    {text: "Fix the login bug before 10:00 pm", type: "work"},
    {text: "Do the chores", type: "personal"},
    {text: "Watch Better Call Saul", type: "interest"}
  ])
  const [listDone, setListDone] = useState([]);
  const [show, setShow] = useState({
    display: 'none'
  });
  const [menuOption, setMenuOption] = useState(0);

  const changeMenuOption = (option) => {
    setMenuOption(option);
  }

  const addTask = (description, category) => {
    setShow({display: 'none'});

    let newTask = {
      text: description,
      type: category
    };
    setListTasks([...listTasks, newTask]);
  }

  const cancel = () => {
    setShow({display: 'none'});
  }

  const taskDone = (text, type) => {
    const taskDone = {
      text: text,
      type: type
    };
    let newTaskList = [...listTasks];
    newTaskList = newTaskList.filter(element => element.text != taskDone.text || element.type != taskDone.type);
    setListTasks(newTaskList);
    setListDone([taskDone, ...listDone]);
  }

  const taskUndone = (text, type) => {
    const taskUndone = {
      text: text,
      type: type
    };
    let newDoneList = [...listDone];
    newDoneList = newDoneList.filter(element => element.text != taskUndone.text || element.type != taskUndone.type);
    setListDone(newDoneList);
    setListTasks([taskUndone, ...listTasks]);
  }


  return (
    <main>
      <Header onClickMenuOption={changeMenuOption} menuOption={menuOption}/>
      <TitleContainer onAddClick={() => setShow({display: 'block'})}/>

      <div className={styles.content_container}>
        <TasksContainer type={0} tasksList={listTasks} onTaskClick={taskDone} menuOption={menuOption}/>
        <TasksContainer type={1} tasksList={listDone} onTaskClick={taskUndone} menuOption={menuOption}/>
      </div>

      <AddModal show={show} onAddTask={addTask} onCancel={cancel}/>
    </main>
  );
}

