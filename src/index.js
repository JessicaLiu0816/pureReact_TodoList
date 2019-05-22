import React,{Component,Fragment} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button ,FormControl} from 'react-bootstrap';


var todoItems = [];

class App extends Component {
  constructor (props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.markTodoDone = this.markTodoDone.bind(this);
    this.editTodo=this.editTodo.bind(this);
    this.updateValue=this.updateValue.bind(this);
    this.conditionRender=this.conditionRender.bind(this);
    this.updateDoneList=this.updateDoneList.bind(this);
    this.updateAllList=this.updateAllList.bind(this);
    this.updateProcess=this.updateProcess.bind(this);
    this.sortTodo=this.sortTodo.bind(this);
    this.searchTodo=this.searchTodo.bind(this);

    this.state = {
      todoItems: todoItems,
      showAll:true,
      isProcess:false,
      filterWord:''
    };
  }
  addItem(todoItem) {
    todoItems.push({
      index: todoItems.length, 
      value: todoItem.newItemValue, 
      done: false,
      isEdit:false,
      weight:0,
      id:Date.now()
    });
    this.setState({todoItems: todoItems});
  }
  removeItem (id) {
    var index;
    for(let i=0;i<todoItems.length;i++){
      if(todoItems[i].id===id){
          index=i;
      }
    }
     todoItems.splice(index, 1);
    this.setState({todoItems: todoItems});
  }
  markTodoDone(itemIndex) {
    var todo = todoItems[itemIndex];
    todo.done = !todo.done;
    this.setState({todoItems: todoItems});  
  }
  editTodo(itemIndex){
    var t=todoItems[itemIndex];
    t.isEdit=!t.isEdit;
    this.setState({todoItems: todoItems});  
  }
 
  updateValue(itemIndex,newValue){
    var tt=todoItems[itemIndex];
    tt.value=newValue;
    this.setState({todoItems:todoItems});
  }
  updateDoneList(){
    this.setState({
      showAll:false,
      isProcess:false
    })
  }
  updateAllList(){
    this.setState({
      showAll:true,
      isProcess:false
    })
  }
  updateProcess(){
    this.setState({
      showAll:false,
      isProcess:true
    })
  }
  sortTodo(id,newWeight){
    
    var tt;
    for(let i=0;i<todoItems.length;i++){
      if(todoItems[i].id===id){
          tt=todoItems[i];
          tt.weight=Number(newWeight);
      }
    }

    todoItems.sort((a,b)=>(a.weight>b.weight?1:-1))
    this.setState({
      todoItems:todoItems
    },()=>{console.log(todoItems)})
    
  }


  searchTodo(keyword){
    this.setState({
      filterWord:keyword
    })
  }

  conditionRender(){
    
    
    if(this.state.showAll)
    {
       return(   
          <TodoList 
                      items={this.props.initItems.filter(item=>{return item.value.indexOf(this.state.filterWord)!==-1})} 
                      removeItem={this.removeItem} 
                      markTodoDone={this.markTodoDone}
                      editTodo={this.editTodo} 
                      updateValue={this.updateValue} 
                      updateDoneList={this.updateDoneList} 
                      updateAllList={this.updateAllList} 
                      updateProcess={this.updateProcess}
                      sortTodo={this.sortTodo}
          />
       )
    }
    else
    {
        if(this.state.isProcess){
          return(
            <TodoList 
                      items={this.props.initItems.filter(item=>item.done===false)} 
                      removeItem={this.removeItem} 
                      markTodoDone={this.markTodoDone} 
                      editTodo={this.editTodo} 
                      updateValue={this.updateValue} 
                      updateDoneList={this.updateDoneList} 
                      updateAllList={this.updateAllList} 
                      updateProcess={this.updateProcess}
                      sortTodo={this.sortTodo} />
          )
        }else{
            return(
            <TodoList 
                      items={this.props.initItems.filter(item=>item.done===true)} 
                      removeItem={this.removeItem} 
                      markTodoDone={this.markTodoDone} 
                      editTodo={this.editTodo} 
                      updateValue={this.updateValue} 
                      updateDoneList={this.updateDoneList} 
                      updateAllList={this.updateAllList} 
                      updateProcess={this.updateProcess}
                      sortTodo={this.sortTodo} />
          )
        }
      
    }

  }

  render() {
    return(

      <div id='main'>
       

          {this.state.todoItems.length===0?<h1>No to do list here</h1>:""}     

          {this.conditionRender()}

          <TodoForm addItem={this.addItem} />
          
          {this.state.todoItems.length===0?"": <SearchBar searchTodo={this.searchTodo} />}   

          {this.state.todoItems.length===0?"":
            <Category items={this.props.initItems} 
                        removeItem={this.removeItem} 
                        markTodoDone={this.markTodoDone} 
                        editTodo={this.editTodo} 
                        updateValue={this.updateValue} 
                        updateDoneList={this.updateDoneList} 
                        updateAllList={this.updateAllList} 
                        updateProcess={this.updateProcess}/>
          }

         
          
      </div>

     )
  }
}

class TodoList extends React.Component {

  render () {
    var items = this.props.items.map((item, index) => {
      return (
        <TodoListItem key={item.id} 
                      id={item.id}
                      item={item} 
                      index={index} 
                      weight={item.weight}
                      removeItem={this.props.removeItem} 
                      markTodoDone={this.props.markTodoDone} 
                      editTodo={this.props.editTodo} 
                      updateValue={this.props.updateValue}
                      sort={this.props.sortTodo}
                       />
      );
    });
    return (
      <ul className="list-group"> {items} </ul>
    );
  }
}
  
class TodoListItem extends React.Component {
  constructor(props) {
    super(props);
    this.onClickClose = this.onClickClose.bind(this);
    this.onClickDone = this.onClickDone.bind(this);

    this.onClickEdit = this.onClickEdit.bind(this);
    this.updateInput=this.updateInput.bind(this);
    this.onClickCancel=this.onClickCancel.bind(this);
    this.onClickSave=this.onClickSave.bind(this);
    this.sortTodoItems=this.sortTodoItems.bind(this);

    this.subInput=React.createRef();

    this.state={
      inputText:this.props.item.value
   }
 }
  onClickClose() {
    var id = parseInt(this.props.id);
    this.props.removeItem(id);
  }
  onClickDone() {
    var index = parseInt(this.props.index);
    this.props.markTodoDone(index);
  }
  onClickEdit(){
    var index = parseInt(this.props.index);
    this.props.editTodo(index);
    this.setState({
      inputText:this.props.item.value
    })
  }
  updateInput(e){
    this.setState({
      inputText:e.target.value
    })
  }
  onClickCancel(){
    var index = parseInt(this.props.index);
    this.props.editTodo(index); 
  }
  onClickSave(e){
    var index = parseInt(this.props.index);
    this.props.editTodo(index); 
    this.setState({
     inputText:e.target.value
    })
    var newValue=this.state.inputText;
    this.props.updateValue(index,newValue);
  }
  sortTodoItems(e){
    
  var id=parseInt(this.props.id);
  this.props.sort(id,e.target.value);

  }

  render () {

    var todoClass = this.props.item.done ? 
        "done" : "undone";

    return(
      <li className="list-group-item " weight={this.props.weight}>
        <div className={todoClass}>
          <input type='number' min='0' value={this.state.weight} onBlur={this.sortTodoItems} className='orderInput' ></input>
            {
              this.props.item.isEdit?  
              <input value={this.state.inputText}  ref={this.subInput}  onChange={this.updateInput} /> 
              : <span onClick={this.onClickDone}>{this.props.item.value}</span> 
            }
            
          {
            this.props.item.isEdit? 
                                   <Fragment> 
                                              <Button variant="outline-warning" size='sm' className="ml-1"  onClick={this.onClickCancel} >cancel</Button>
                                              <Button variant="outline-success" size='sm' className="ml-1"  onClick={this.onClickSave} >save</Button>
                                    </Fragment> 
                                    : <Button variant="outline-primary" size='sm' className="ml-3"  onClick={this.onClickEdit} >Edit</Button>
                               
          }
      
          <button type="button" className="close" onClick={this.onClickClose}>delete</button>
        </div>
      </li>     
    );
  }
}

class TodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.refs.itemName.focus();
  }
  onSubmit(event) {
    event.preventDefault();
    var newItemValue = this.refs.itemName.value;
    
    if(newItemValue) {
      this.props.addItem({newItemValue});
      this.refs.form.reset();
    }
  }
  render () {
    return (
      <form ref="form" onSubmit={this.onSubmit} className="mt-5">
        <FormControl type="text" ref="itemName" className="form-control" placeholder="add a new todo..."></FormControl>
      </form>
    );   
  }
}
class Category extends React.Component {

  constructor(props){
    super(props);
    this.showDonelist=this.showDonelist.bind(this);
    this.showAllList=this.showAllList.bind(this);
    this.showProcess=this.showProcess.bind(this); 
  }
  showDonelist(){this.props.updateDoneList();}
  showAllList(){this.props.updateAllList(); }
  showProcess(){this.props.updateProcess(); }

  render () {
    return (
      <div className='mt-3'>
         <Button variant="primary" onClick={this.showAllList} className='mr-1'>All</Button>
         <Button variant="success" onClick={this.showProcess} className='mr-1'>Processing</Button>
         <Button variant="danger" onClick={this.showDonelist} className='mr-'>Done</Button>
      </div>
    )
  }
}

class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.updateSearch=this.updateSearch.bind(this);
  }
  updateSearch(e){ this.props.searchTodo(e.target.value);}
  render () {return <FormControl placeholder='search your to do here' type='text'  onChange={this.updateSearch} className='mt-2'></FormControl>}
}



ReactDOM.render(<App initItems={todoItems} />, document.getElementById('root'));

