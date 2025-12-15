let todos = [];
function createTodoElement(todo) {
    const li = document.createElement("li");
    li.className = "todo-item";
    
    // Title
    const span = document.createElement("span");
    span.textContent = todo.title;
    if (todo.done) span.style.textDecoration = "line-through";

    // Toggle Button (Real-time update)
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = todo.done ? "Undo" : "Done";
    toggleBtn.onclick = () => toggleTodo(todo._id, !todo.done);

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.onclick = () => deleteTodo(todo._id);

    li.appendChild(span);
    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);
    
    return li;
}

// --- PILLAR 3: RENDERER (The Boss) ---
function render() {
    const list = document.getElementById("todo-list");
    list.innerHTML = ""; // Wipe clean
    
    todos.forEach(todo => {
        const element = createTodoElement(todo);
        list.appendChild(element);
    });
}

// --- PILLAR 4: ACTIONS (The Logic) ---

// 1. Modal Logic
function openModal() {
    document.getElementById("todo-modal").showModal();
}

function closeModal() {
    document.getElementById("todo-modal").close();
    document.getElementById("todo-input").value = ""; // Clear input
}

// 2. Add Todo (Optimistic Update)
async function addTodo() {
    const title = document.getElementById("todo-input").value;
    if (!title) return;

    // UX: Close modal IMMEDIATELY so user feels it's fast
    closeModal();

    try {
        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:3000/todo", 
            { title: title, done: false },
            { headers: { token: token } }
        );
        
        // Update State & Render
        // Note: Ideally backend returns the full new todo object. 
        // If not, we might need to re-fetch, but let's assume we re-fetch for simplicity now.
        await fetchTodos(); 

    } catch (error) {
        alert("Failed to add todo");
    }
}

// 3. Fetch, Toggle, Delete
async function fetchTodos() {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/todos", {
        headers: { token: token }
    });
    todos = response.data.todos; // Update Truth
    render(); // Update Screen
}

async function deleteTodo(id) {
    const token = localStorage.getItem("token");
    
    try {
        // FIX: Use URL parameter string template `${id}`
        // FIX: Use the correct endpoint "/delete/"
        await axios.delete(`http://localhost:3000/delete/${id}`, {
            headers: { token: token }
        });

        // Optimistic UI Update
        todos = todos.filter(t => t._id !== id);
        render();
    } catch (error) {
        console.error("Error deleting todo:", error);
        alert("Could not delete todo");
    }
}

async function toggleTodo(id, isDone) {
    // Optimistic UI Update (Make it feel fast)
    const todo = todos.find(t => t._id === id);
    const previousState = todo.done; // Save state in case of error
    todo.done = isDone;
    render();

    const token = localStorage.getItem("token");

    try {
        // FIX: Use URL parameter `${id}`
        // FIX: Use the correct endpoint "/me/"
        await axios.put(`http://localhost:3000/me/${id}`, 
            { done: isDone }, // Body only needs the data to change
            { headers: { token: token } }
        );
    } catch (error) {
        console.error("Error updating todo:", error);
        alert("Could not update status");
        
        // Revert UI if backend fails
        todo.done = previousState;
        render();
    }
}
// --- PILLAR 5: INITIALIZER ---
async function init() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/auth";
    } else {
        await fetchTodos();
    }
}


function logout() {
    localStorage.removeItem("token");
    alert("you are logged out");
    window.location.reload();
    window.location.href = "/auth"
}


// Start the app
init();
