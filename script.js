
const input = document.getElementById("file");
let reader;
input.addEventListener("change", function(e) {
const file = e.target.files[0];
reader = new FileReader();
reader.onload = function() {
const json = JSON.parse(reader.result);
console.log(json);
};
reader.readAsText(file);
});



function displayList() {
  let placeholder = document.querySelector("#data-output");
  let out = "";
  const json = JSON.parse(reader.result);
   json.forEach((element, index) => {
      out += `
      <tr>
         <td class="project-container">
            <span class="project-name" data-index="${index}">${element.name}</span>
         </td>
         <td>
         ${element.start_date} <button class="edit-date-start" data-index="${index}">Modifier</button>
     </td>
     <td>
         ${element.end_date} <button class="edit-date-end" data-index="${index}">Modifier</button>
     </td>
         <td> 
            <button id="Edit">Edit</button>
            <button id="Delete">Delete</button>
         </td>
      </tr>
   `;
   });
   placeholder.innerHTML = out;
 
   // Add event listener to the placeholder element
   placeholder.addEventListener("click", function(e) {
     // Check if the clicked element is the project name
     if (e.target.classList.contains("project-name")) {
       // Find parent row of the clicked project name
       let parentRow = e.target.parentNode;
       
       // Create new table element for sub-tasks
       let subTasksTable = document.createElement("table");
       subTasksTable.classList.add("sub-tasks-table");
 
       // Add headers to the sub-tasks table
       let subTasksTableHead = document.createElement("thead");
       let subTasksTableHeadRow = document.createElement("tr");
       subTasksTableHeadRow.innerHTML = `
         <th>Sub-task name</th>
         <th>Start date</th>
         <th>End date</th>
       `;
       subTasksTableHead.appendChild(subTasksTableHeadRow);
       subTasksTable.appendChild(subTasksTableHead);
 
       // Add body to the sub-tasks table
       let subTasksTableBody = document.createElement("tbody");
       let subTasksOut = "";
       let index = e.target.dataset.index;
       json[index].stages.forEach(function(subTask) {
         subTasksOut += `
           <tr>
             <td>${subTask.name}</td>
             <td>${subTask.start_date}</td>
             <td>${subTask.end_date}</td>
           </tr>
         `;
       });
       subTasksTableBody.innerHTML = subTasksOut;
       subTasksTable.appendChild(subTasksTableBody);
 
       parentRow.appendChild(subTasksTable);
     }
   });


   //Boutons Modifier
   let editStartDateButtons = document.querySelectorAll(".edit-date-start");
  let editEndDateButtons = document.querySelectorAll(".edit-date-end");

  editStartDateButtons.forEach((button) => {
    button.addEventListener("click", function(event) {
      console.log("Hello !")
          // Récupérer l'index du projet
          let index = event.target.dataset.index;
          // Demander à l'utilisateur de saisir une nouvelle date de début
          let newStartDate = prompt("Saisissez une nouvelle date de début", json[index].start_date);
          // Mettre à jour la date de début pour ce projet
          json[index].start_date = newStartDate;
          console.log(json);
          const jsonString = JSON.stringify(json);
          const blob = new Blob([jsonString], {type: "application/json"});
          saveAs(blob, "./trajectoire.json");
      });
  });

  editEndDateButtons.forEach((button) => {
      button.addEventListener("click", function(event) {
          // Récupérer l'index du projet
          let index = event.target.dataset.index;
          // Demander à l'utilisateur de saisir une nouvelle date de fin
          let newEndDate = prompt("Saisissez une nouvelle date de fin", json[index].end_date);
          // Mettre à jour la date de fin pour ce projet
          json[index].end_date = newEndDate;
      });
  });


};

 

const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", displayList);







