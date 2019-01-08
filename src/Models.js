import { store, uuid, extend } from './Utils';

export class TodoModel {

  constructor(key) {
    this.key = key
    this.todos = store(key)
    this.onChanges = []
  }

  subscribe = (onChange) => {
    this.onChanges.push(onChange);
  }

  inform = () => {
    store(this.key, this.todos);
    this.onChanges.forEach(function (cb) { cb(); });
  }

  addTodo = (title) => {
    this.todos = this.todos.concat({
      id: uuid(),
      title: title,
      completed: false
    });

    this.inform();
  };

  toggleAll = (checked) => {
    this.todos = this.todos.map(function (todo) {
      return extend({}, todo, {completed: checked});
    });

    this.inform();
  }

  toggle = (todoToToggle) => {
    this.todos = this.todos.map(function (todo) {
      return todo !== todoToToggle ?
        todo :
        extend({}, todo, {completed: !todo.completed});
    });

    this.inform();
  }

  destroy =  (todo) => {
    this.todos = this.todos.filter(function (candidate) {
      return candidate !== todo;
    });

    this.inform();
  }


  save =  (todoToSave, text) => {
    this.todos = this.todos.map(function (todo) {
      return todo !== todoToSave ? todo : extend({}, todo, {title: text});
    });

    this.inform();
  }


  clearCompleted =  () => {
    this.todos = this.todos.filter(function (todo) {
      return !todo.completed;
    });

    this.inform();
  }

}
