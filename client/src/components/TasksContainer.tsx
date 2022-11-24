import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
	ResponderProvided,
} from 'react-beautiful-dnd';


const TasksContainer = ({ socket }: any) => {
	const [tasks, setTasks] = useState({});

	const handleDragEnd = (result: DropResult, _provided: ResponderProvided) => {
		const { destination, source } = result;
		if (!destination) return;
		if (
			destination.index === source.index &&
			destination.droppableId === source.droppableId
		)
			return;

		socket.emit('taskDragged', {
			source: source,
			destination: destination,
		});
	};

	useEffect(() => {
		function fetchTasks() {
			fetch('http://localhost:5000/api')
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					setTasks(data);
				});
		}
		fetchTasks();
	}, []);

  useEffect(() => {
    socket.on("tasks", (data:any) => setTasks(data));
}, [socket]);

	return (
		<div className="container">
			<DragDropContext onDragEnd={handleDragEnd}>
				{Object.entries(tasks).map((task: any) => (
					<div
						className={`${task[1].title.toLowerCase()}__wrapper`}
						key={task[1].title}
					>
						<h3>{task[1].title} Tasks</h3>
						<div className={`${task[1].title.toLowerCase()}__container`}>
							{/** --- 👇🏻 Droppable --- */}
							<Droppable droppableId={task[1].title}>
								{(provided) => (
									<div ref={provided.innerRef} {...provided.droppableProps}>
										{task[1].items.map((item: any, index: number) => (
											<Draggable
												key={item.id}
												draggableId={item.id}
												index={index}
											>
												{(provided) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														className={`${task[1].title.toLowerCase()}__items`}
													>
														<p>{item.title}</p>
														<p className="comment">
															<Link
																to={`/comments/${task[1].title}/${item.id}`}
															>
																{item.comments.length > 0
																	? `View Comments`
																	: 'Add Comment'}
															</Link>
														</p>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>
					</div>
				))}
			</DragDropContext>
		</div>
	);
};
export default TasksContainer;
