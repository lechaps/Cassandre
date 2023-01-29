
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
  let out = "", out2="", out3="";
  let json = JSON.parse(reader.result);
   json.forEach((element, index) => {
    out += `
    <tr>
       <td class="project-container">
          <span class="project-name"  data-index="${index}">${element.name}</span>
       </td>
       <td>
          <input type="text" class="date-input-start-date" id="startdatepicker" data-index="${index}" value="${element.start_date}">
      </td>
      <td>
         <input type="text" class="date-input-end-date" id="enddatepicker" data-index="${index}" value="${element.end_date}">
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


   document.querySelectorAll(".date-input-start-date").forEach((date, index) => {
    date.addEventListener("blur", function() {
         // Create a copy of the original JSON object
         let jsonCopy = JSON.parse(JSON.stringify(json));

         // Update the copy with the new date values
         jsonCopy[index].start_date = date.value;
 
         // Update the original JSON object with the updated copy
         json = jsonCopy;
 
         // Do something with the updated JSON object, such as sending it to a server or updating the UI
         console.log(json);

    });
});


document.querySelectorAll(".date-input-end-date").forEach((date, index) => {
  date.addEventListener("blur", function() {
       // Create a copy of the original JSON object
       let jsonCopy = JSON.parse(JSON.stringify(json));

       // Update the copy with the new date values
       jsonCopy[index].end_date = date.value;

       // Update the original JSON object with the updated copy
       json = jsonCopy;

       // Do something with the updated JSON object, such as sending it to a server or updating the UI
       console.log(json);

  });
});


document.getElementById("download").addEventListener("click", function() {
  let jsonCopy = JSON.parse(JSON.stringify(json));
  // Create a new Blob object containing the updated JSON
  let jsonBlob = new Blob([JSON.stringify(jsonCopy, null, 2)], { type: "application/json" });
  // Create a link element to trigger the download
  let downloadLink = document.createElement("a");
  downloadLink.href = window.URL.createObjectURL(jsonBlob);
  downloadLink.download = "new-trajectory.json";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
});

flatpickr("#startdatepicker", {allowInput:true});
flatpickr("#enddatepicker", {allowInput:true});






};

 

const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", displayList);







