import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ListItem from "./ListItem";
import axios from 'axios';
import Loading from './loading.gif'
class App extends Component {
	constructor() {
		super();
		this.state = {
			newTodo: "",
			notifi: "",
			editing: false,
			editingIndex: "",
			todos: [],
			loading: true
		}
		this.apiUrl = "https://5dbce3c930411e0014f271a6.mockapi.io"
	}

	handleChange = (event) => {
		this.setState({ newTodo: event.target.value })
		// console.log(event.target.name, event.target.value)
	}

	addTodo = async (event) => {
		event.preventDefault();
		if (this.state.newTodo !== "") {
			const response = await axios.post(`${this.apiUrl}/todos`, {
				name: this.state.newTodo
			})
			const oldTodo = this.state.todos;
			oldTodo.push(response.data);
			this.setState({
				todos: oldTodo,
				newTodo: ""
			})
		}
	}

	deleteTodo = async (index) => {
		const todos = this.state.todos;
		const todo = todos[index];
		const response = await axios.delete(`${this.apiUrl}/todos/${todo.id}`);
		delete todos[index]
		console.log(todos);
		this.setState({ todos: todos });

	}
	editTodo = (index) => {
		const todos = this.state.todos[index];
		this.setState({ editing: true, newTodo: todos.name, editingIndex: index });
	}

	updateTodo = async () => {
		const index = this.state.editingIndex;
		const todo = this.state.todos;
		const indexTodo = todo[index];
		const response = await axios.put(`${this.apiUrl}/todos/${indexTodo.id}`, {
			name: this.state.newTodo
		})
		todo[index].name = response.data.name
		this.setState({ todos: todo, editing: false, newTodo: "", editingIndex: "" });

	}

	alert = (notifi) => {
		this.setState({ notifi: notifi })
	};

	t = setTimeout(
		function () {
			this.setState({ notifi: "" });
		}
			.bind(this),
		2000
	);


	async componentDidMount() {
		const response = await axios.get(`${this.apiUrl}/todos`);
		this.setState({ todos: response.data, loading: false })
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						Edit <code>src/App.js</code> and save to reload.
        			</p>
					<a
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
        			</a>
					<div className="container">
						{
							this.state.notifi &&
							<div className="alert mt-3 alert-success">
								<p className="text-center">{this.state.notifi}</p>
							</div>
						}
						<input
							type="text"
							name="todo"
							className="m-4 form-control"
							placeholder="Add a new todo"
							onChange={this.handleChange}
							value={this.state.newTodo}
						/>
						<button
							className="btn-info mb-1 form-control"
							onClick={this.state.editing ? this.updateTodo : this.addTodo}
							disabled={this.state.newTodo.length < 5}
						> {this.state.editing ? 'Update todo' : 'Add todo'}</button>
						{
							this.state.loading && 
							<img src={Loading}/>
						}

						<h2 className="text-center p-4">todos list</h2>
						{!this.state.editing &&
							<ul className="list-group">
								{this.state.todos.map((item, index) => {
									return <ListItem
										item={item}
										key={item.id}
										editTodo={() => { this.editTodo(index) }}
										deleteTodo={() => this.deleteTodo(index)}

									></ListItem>
								})}
							</ul>
						}
					</div>
				</header>

			</div>
		);
	}
}

export default App;
