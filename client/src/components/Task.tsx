import React from 'react';
import AddTask from './AddTask';
import TasksContainer from './TasksContainer';
import Nav from './Nav';
const socketIO = require('socket.io-client');

const socket = socketIO.connect('http://localhost:5000');

const Task = () => {
	return (
		<div>
			<Nav />
			<AddTask socket={socket} />
			<TasksContainer socket={socket} />
		</div>
	);
};

export default Task;
