const apiKey = "676d8f8a60a208ee1fdecca8";
const formEle = document.querySelector("form");
const inputEle = document.querySelector("input");
const loadingScreen = document.querySelector(".loading");
let allTodos = [];

getAllTodos();

formEle.addEventListener("submit", (e) => {
  e.preventDefault();

  if (inputEle.value.trim().length > 0) {
    addTodos();
  } else {
    toastr.error("Title is empty");
  }
});

async function addTodos() {
  showLoading();

  const todo = {
    title: inputEle.value,
    apiKey,
  };

  const obj = {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "content-type": "application/json",
    },
  };

  const response = await fetch("https://todos.routemisr.com/api/v1/todos", obj);

  if (response.ok) {
    const data = await response.json();

    if (data.message === "success") {
      toastr.success("Added Successfully", "Toastr App");
      await getAllTodos();
      formEle.reset();
    }
    // else {
    //   toastr.error("Todo is empty");
    // }
  }

  hideLoading();
}

async function getAllTodos() {
  showLoading();
  const response = await fetch(
    `https://todos.routemisr.com/api/v1/todos/${apiKey}`
  );

  if (response.ok) {
    const data = await response.json();
    if (data.message === "success") {
      if (data.message === "success") {
        allTodos = data.todos;
        displayTodos(allTodos);
        console.log(allTodos);
      }
    }
  }
  hideLoading();
}

function displayTodos() {
  let c = ``;

  for (const todo of allTodos) {
    c += `
    <li
          class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2"
        >
          <span onclick="markCompleted('${todo._id}')" style="${
      todo.completed ? "text-decoration: line-through" : ""
    }" class="task-name">${todo.title}</span>
          <div class="d-flex align-items-center gap-4">
            ${
              todo.completed
                ? '<span><i class="fa-regular fa-circle-check" style="color: #63e6be"></i></span>'
                : ""
            }
            <span onclick="deleteTodo('${
              todo._id
            }')" class="icon"><i class="fa-solid fa-trash-can"></i></span>

          </div>
        </li>
    `;
  }
  document.querySelector(".task-container").innerHTML = c;

  changeProgress();
}

async function deleteTodo(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();
      const todo = {
        todoId: id,
      };
      const obj = {
        method: "DELETE",
        body: JSON.stringify(todo),
        headers: {
          "content-type": "application/json",
        },
      };

      const response = await fetch(
        "https://todos.routemisr.com/api/v1/todos",
        obj
      );

      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });

          await getAllTodos();

          console.log("Done");
        }
      }

      hideLoading();
    }
  });
}

async function markCompleted(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, complete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();
      const todo = {
        todoId: id,
      };

      const obj = {
        method: "PUT",
        body: JSON.stringify(todo),
        headers: {
          "content-type": "application/json",
        },
      };

      const response = await fetch(
        "https://todos.routemisr.com/api/v1/todos",
        obj
      );

      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          Swal.fire({
            title: "Completed!",
            // text: "Your file has been completed.",
            icon: "success",
          });

          await getAllTodos();

          console.log("Done");
        }
      }
      hideLoading();
    }
  });
}

function showLoading() {
  loadingScreen.classList.remove("d-none");
}

function hideLoading() {
  loadingScreen.classList.add("d-none");
}

function changeProgress() {
  const completedTaskNumber = allTodos.filter((todo) => todo.completed).length;
  const totalTask = allTodos.length;
  console.log(completedTaskNumber, totalTask);
  console.log(completedTaskNumber / totalTask);

  document.getElementById("progress").style.width = `${
    (completedTaskNumber / totalTask) * 100
  }%`;

  const x = document.querySelectorAll(".status-number span");
  x[0].innerHTML = completedTaskNumber;
  x[1].innerHTML = totalTask;
}
