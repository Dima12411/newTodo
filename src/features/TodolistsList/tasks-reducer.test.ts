import {addTask, removeTask, setTasks, tasksReducer, TasksStateType, updateTask} from "./tasks-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/todolists-api";
import {addTodolist, removeTodolist, setTodolists} from "./todolists-reducer";

let startState: TasksStateType = {};

startState = {
    'todolistId1': [
        {
            id: '1', title: "HTML&CSS", status: TaskStatuses.New, todolistId: 'todolistId1', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
        },
        {
            id: '2', title: "React", status: TaskStatuses.Completed, todolistId: 'todolistId1', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
        },
        {
            id: '3', title: "JS", status: TaskStatuses.New, todolistId: 'todolistId1', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
        },
    ],
    'todolistId2': [
        {
            id: '1', title: "juice", status: TaskStatuses.New, todolistId: 'todolistId2', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
        },
        {
            id: '2', title: "bread", status: TaskStatuses.Completed, todolistId: 'todolistId2', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
        },
        {
            id: '3', title: "milk", status: TaskStatuses.New, todolistId: 'todolistId2', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
        },
    ],

} as TasksStateType

test('correct task should be added to correct array', () => {
    const action = removeTask({taskId: '2', todolistId: 'todolistId2'})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(2)
    expect(endState['todolistId2'].every(t => t.id != '2')).toBeTruthy()
});
test('correct task should be added to correct array', () => {
    let task = {
        todolistId: 'todolistId2',
        title: 'juice',
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        order: 0,
        priority: 0,
        startDate: '',
        id: 'id exists'
    };
    const action = addTask({
        task
    })

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juice')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})
test('status of specified task should be changed', () => {
    const action = updateTask({taskId: '2', model: {status: TaskStatuses.New}, todolistId: 'todolistId2'})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
    expect(endState['todolistId1'][2].status).toBe(TaskStatuses.New)
})
test('title of specified task should be changed', () => {
    const action = updateTask({taskId: '2', model: {title: 'sugar'}, todolistId: 'todolistId2'})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][1].title).toBe("React")
    expect(endState['todolistId2'][1].title).toBe("sugar")
    expect(endState['todolistId2'][0].title).toBe("juice")
})
test('new array should be added when new todolist is added', () => {
    const action = addTodolist({
        todolist: {
            id: 'blabla',
            title: 'new todolist',
            order: 0,
            addedDate: '',
        }
    })

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})
test('property with todolistId should be deleted', () => {
    const action = removeTodolist({id: 'todolistId2'})

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})
test('empty arrays should be added when we set todolists', () => {
    const action = setTodolists({todolists: [
            {id: '1', title: 'title1', order: 0, addedDate: ''},
            {id: '2', title: 'title2', order: 0, addedDate: ''},
        ]})

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toBeDefined()
    expect(endState['2']).toBeDefined()
})
test('tasks should be added for todolist', () => {
    const action = setTasks({tasks: startState['todolistId1'], todolistId: 'todolistId1'})

    const endState = tasksReducer({
        'todolistId2': [],
        'todolistId1': [],
    }, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(0)
})