function addMonthsToDate(dateString, duration) {
  let dateArr = dateString.split("-");
  let year = parseInt(dateArr[0].toString());
  let month = parseInt(dateArr[1].toString()) - 1;
  let day = parseInt(dateArr[2].toString());
  let date = new Date(year, month, day);
  date.setMonth(date.getMonth() + parseInt(duration));
  let resultDay = date.getDate().toString().padStart(2, '0');
  let resultMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  let resultYear = date.getFullYear().toString();
  return resultYear + '-' + resultMonth + '-' + resultDay ;
}

function generateSubTaskTable(index, subTaskIndex, json) {
  let subTaskData = json[index].stages[subTaskIndex];

  let profils = Object.keys(subTaskData.views[0].profils);
  let views = subTaskData.views.map(v => v.name);
  let tableHTML = `
  <table class="sub-task-table">
    <thead>
      <tr>
        <th></th>
        <th>Somme</th>
        ${profils.map((profil) => {
          return `<th>${profil}</th>`;
        }).join('')}
      </tr>
    </thead>
    <tbody>
      ${views.map((view) => {
        return `
          <tr>
            <td>${view}</td>
            <td><p class="somme" >0</p></td>
            ${profils.map((profil) => {
              let value = subTaskData.views.find(v => v.name === view).profils[profil]; 
              return `<td><input type="text" class="${profil}" value="${value}"></td>`;
            }).join('')}
          </tr>
        `;
      }).join('')}
    </tbody>
  </table>
`;

  return tableHTML;
}

function DownloadJson(json){
  
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
  
  
}

function generateStagesTable(subTasksTable,subTasksTableBody, json, subTasksOut, e){
        // Find parent row of the clicked project name
        let parentRow = e.target.parentNode;

        //phases html
        let phasesmenu = "";

        // Create new table element for sub-tasks
        subTasksTable = document.createElement("table");
        subTasksTable.classList.add("sub-tasks-table");

        // Add headers to the sub-tasks table
        let subTasksTableHead = document.createElement("thead");
        let subTasksTableHeadRow = document.createElement("tr");
        subTasksTableHeadRow.innerHTML = `
        <th>Sub-task name</th>
        <th>Start date</th>
        <th>End date</th>
        <th>Phases</th>
          `;
        subTasksTableHead.appendChild(subTasksTableHeadRow);
        subTasksTable.appendChild(subTasksTableHead);

       

        let index = e.target.parentNode.parentNode.rowIndex-1;
        
        json[index].stages.forEach(function(subTask) {
          for(let  i=0; i<subTask.Phases.length; i++)
          {
            phasesmenu += `<option value="${i}">${i+1}</option>`;
            

          }
          subTasksOut += `
        <tr>
        <td class="Sub-task-container">
          <input type="text" class="Sub-task-name"  data-index="${index}" value="${subTask.name}">
          <button class="add-subtask-btn">+</button>
        </td>
        <td>
          <input type="text" class="stage-input-start-date" id="stagestartdatepicker" data-index="${index}" value="${subTask.start_date}">
        </td>
        <td>
          <input type="text" class="stage-input-end-date" id="stageenddatepicker" data-index="${index}" value="${subTask.end_date}">
        </td>
        <td>
          <select class="phases" id="phasesmenu">
              ${phasesmenu}
          </select>
        </td> 
        </tr>
        `;
        phasesmenu = "";
        });
        subTasksTableBody.innerHTML = subTasksOut;
        subTasksTable.appendChild(subTasksTableBody);

        parentRow.appendChild(subTasksTable);

        return index;

}

function generatePhasesTable(index, subTaskIndex, json){

  let phases = json[index].stages[subTaskIndex].Phases;
  let table = '<table>';
  

  table += '<tr><th>' + json[index].stages[subTaskIndex].name + '</th><th>Start Date</th><th>End Date</th></tr>';


  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    const startDate = phase[0];
    const endDate = phase[1];
    table += `<tr><td>Phase ${i+1} <button class="add-phase">+</button></td><td><input type="text" class="start-phase" value="${startDate}"></td><td><input type="text" class="end-phase" value="${endDate}"></td></tr>`;
  }

  table += '</table>';

  return table;

}

function AddStage(e, json, index, subTasksTableBody){
  let newRow = document.createElement("tr");
  newRow.innerHTML = `
  <td class="Sub-task-container">
    <input type="text" class="Sub-task-name">
    <button class="add-subtask-btn">+</button>
  </td>
  <td>
    <input type="text" class="stage-input-start-date" id="stagestartdatepicker">
  </td>
  <td>
    <input type="text" class="stage-input-end-date" id="stagestartdatepicker">
  </td>
  `;
  e.target.parentElement.parentElement.after(newRow);
  let parentIndex = Array.from(subTasksTableBody.children).indexOf(newRow);
  console.log(parentIndex);
  json[index].stages.splice(parentIndex, 0, {name: '', start_date: '', end_date: '', views: []});
  reader.readAsText(new Blob([JSON.stringify(json)], { type: 'application/json' }));
  flatpickr("#stagestartdatepicker", {allowInput:true,  dateFormat: "Y-m-d"});
  flatpickr("#stageenddatepicker", {allowInput:true,  dateFormat: "Y-m-d"});
}

function EditStage(e, json, index){
  if (e.target.classList.contains("stage-input-start-date") || e.target.classList.contains("stage-input-end-date") || e.target.classList.contains("Sub-task-name")) {
    let subTaskIndex = e.target.parentNode.parentNode.rowIndex - 1;
    
    if (e.target.classList.contains("stage-input-start-date")) {
      json[index].stages[subTaskIndex].start_date = e.target.value;
    } else if (e.target.classList.contains("stage-input-end-date")) {
      json[index].stages[subTaskIndex].end_date = e.target.value;
    }
    else{
      json[index].stages[subTaskIndex].name = e.target.value;

    }
  }
}

function EditSomme(e, json, index, subTaskIndex, viewindex) {
    let somme = 0;

    
      let profil = e.target.className;
      somme += json[index].stages[subTaskIndex].views[viewindex].profils[profil];
      console.log(somme)
    
}

function EditView(e, json, index){
  if (e.target.classList.contains("Sub-task-name")) {
    // Check if the views table already exists
    let table = document.body.querySelector(".sub-task-table");
    let somme = 0;

    if (table) {
    // Remove the sub-task table
     
      table.remove();
    }
    else{
      let subTaskIndex = e.target.parentNode.parentNode.rowIndex - 1;
      //console.log(index, subTaskIndex);
      let tableHTML = generateSubTaskTable(index,subTaskIndex, json);
      table = document.createElement('table');
      table.classList.add("sub-task-table");
      table.innerHTML = tableHTML;
      document.body.appendChild(table);

      table.addEventListener("input", function(e) {
        let viewindex = e.target.parentNode.parentNode.rowIndex - 1;
        let profil = e.target.className;
        //console.log("the view index is : ", viewindex);
        json[index].stages[subTaskIndex].views[viewindex].profils[profil] = e.target.value;

        somme += Number(json[index].stages[subTaskIndex].views[viewindex].profils[profil]);
        console.log(somme); 


      });

    }

    let phasestable = document.body.querySelector(".Phases-table");
    if (phasestable) {
            // Remove the sub-task table
            phasestable.remove();
    }
    else{


      let subTaskIndex = e.target.parentNode.parentNode.rowIndex - 1;
      console.log(index, subTaskIndex);
      let tableHTML = generatePhasesTable(index,subTaskIndex, json);
      phasestable = document.createElement('table');
      phasestable.classList.add("Phases-table");
      phasestable.innerHTML = tableHTML;
      document.body.appendChild(phasestable);

      
      phasestable.addEventListener("input", function(e) {
        let phaseindex = e.target.parentNode.parentNode.rowIndex - 1;
        let date = e.target.className;
        let j=1;
      

        if (date === "start-phase" )
        {
          j = 0;

        }

        json[index].stages[subTaskIndex].Phases[phaseindex][j] = e.target.value;

              
      });

      phasestable.addEventListener("click", function(e) {
        if (e.target.classList.contains("add-phase")) {
          let currentRow = e.target.closest("tr");
          let currentIndex = Array.prototype.indexOf.call(currentRow.parentNode.children, currentRow);
      
          // Clone the current row to create the new row
          let newRow = currentRow.cloneNode(true);
          let newPhaseIndex = parseInt(newRow.firstChild.textContent.match(/\d+/)) + 1;
          newRow.firstChild.innerHTML = `Phase ${newPhaseIndex} <button class="add-phase">+</button>`;
          newRow.children[1].firstChild.value = "";
          newRow.children[2].firstChild.value = "";
          currentRow.after(newRow);
      
          // Update the JSON data
          json[index].stages[subTaskIndex].Phases.splice(currentIndex + 1, 0, ["", ""]);
      
          // Update the remaining rows
          for (let i = currentIndex + 2; i < phasestable.rows.length; i++) {
            let row = phasestable.rows[i];
            let phaseIndex = parseInt(row.firstChild.textContent.match(/\d+/)) + 1;
            row.firstChild.innerHTML = ` Phase ${phaseIndex} <button class="add-phase">+</button>`;
          }
        }
      });
      
    
  
 
    }

  }

  if (e.target.classList.contains("phases")){

    let select = e.target;
    let row = select.parentNode.parentNode;
    let startDateInput = row.querySelector('.stage-input-start-date');
    let endDateInput = row.querySelector('.stage-input-end-date');

    select.addEventListener('change', function() {
      let subTaskIndex = select.parentNode.parentNode.rowIndex - 1;
      let selectedPhase = json[index].stages[subTaskIndex].Phases[Number(select.value)];
      startDateInput.value = selectedPhase[0];
      endDateInput.value = selectedPhase[1];
  });

  }

}

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
          <input type="text" class="project-name"  data-index="${index}" value="${element.name}">
          <button class="add-project-btn">+</button>
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
       let subTasksOut = "";

        // Check if the sub-task table already exists
        let subTasksTable = parentRow.querySelector(".sub-tasks-table");
         // Add body to the sub-tasks table
        let subTasksTableBody = document.createElement("tbody");
      
        if (subTasksTable) {
          // Remove the sub-task table
          subTasksTable.remove();
        }
      
        else
        {
          //this else section manipulate all the events related to the sub-task-table
          let index = generateStagesTable(subTasksTable,subTasksTableBody, json, subTasksOut, e);

        subTasksTableBody.addEventListener("click", function(e) {
        if (e.target.classList.contains("add-subtask-btn")) {
          
         AddStage(e ,json, index, subTasksTableBody);
        }
      });

      subTasksTableBody.addEventListener("input", function(e) {
        EditStage(e, json, index);
        
      });

      subTasksTableBody.addEventListener("click", function(e) {
        EditView(e, json, index);
      });
           

      flatpickr("#stagestartdatepicker", {allowInput:true});
      flatpickr("#stageenddatepicker", {allowInput:true});

     }
    }

    
      if (e.target.classList.contains("add-project-btn")) {
        console.log("click!!!!!");
        let newRow = document.createElement("tr");
        newRow.innerHTML = `
        <td class="project-container">
        <input type="text" class="project-name">
        <button class="add-project-btn">+</button>
        </td>
        <td>
        <input type="text" class="date-input-start-date" id="startdatepicker">
        </td>
        <td>
       <input type="text" class="date-input-end-date" id="enddatepicker">
        </td>
        `;


        e.target.parentElement.parentElement.after(newRow);
        let index = Array.from(placeholder.children).indexOf(newRow);
        json.splice(index, 0, {name: '', start_date: '', end_date: '', stages:[]});
        reader.readAsText(new Blob([JSON.stringify(json)], { type: 'application/json' }));
        flatpickr("#stagestartdatepicker", {allowInput:true,  dateFormat: "Y-m-d"});
        flatpickr("#stageenddatepicker", {allowInput:true,  dateFormat: "Y-m-d"});
        console.log(json);

        document.querySelectorAll(".date-input-start-date").forEach((date, index) => {
          date.addEventListener("blur", function() {
               // Create a copy of the original JSON object
               let jsonCopy = JSON.parse(JSON.stringify(json));
      
               // Update the copy with the new date values
               jsonCopy[index].start_date = date.value;

               //remplir les satges à partir d'un script config
               if(jsonCopy[index].stages && jsonCopy[index].stages.length === 0){
                console.log("ce projet est encore vide !!!!!!, je vais le remplit pour vous :)");
                console.log(typeof(date.value));
                console.log(addMonthsToDate(date.value.toString(), config[0].duration));
      
                jsonCopy[index].stages.splice(0, 0, {name: config[0].name,
                                                    start_date:date.value.toString(),
                                                     end_date: addMonthsToDate(date.value.toString(), config[0].duration),
                                                    views : viewconfig});
                 for(let i=1; i< config.length ; i++ )
                 {
                  jsonCopy[index].stages.splice(i, 0, {name: config[0].name,
                                                     start_date: jsonCopy[index].stages[i-1].end_date, 
                                                     end_date: addMonthsToDate(jsonCopy[index].stages[i-1].end_date, config[i].duration),
                                                     views : viewconfig});
                 }

                    

              
              }
       
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

      document.querySelectorAll(".project-name").forEach((name, index) => {
        name.addEventListener("blur", function() {
             // Create a copy of the original JSON object
             let jsonCopy = JSON.parse(JSON.stringify(json));
      
             // Update the copy with the new date values
             jsonCopy[index].name = name.value;
      
             // Update the original JSON object with the updated copy
             json = jsonCopy;
      
             // Do something with the updated JSON object, such as sending it to a server or updating the UI
             console.log(json);
      
        });
      });

      flatpickr("#startdatepicker", {allowInput:true,  dateFormat: "Y-m-d"});
      flatpickr("#enddatepicker", {allowInput:true,  dateFormat: "Y-m-d"});


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

    });
});

document.querySelectorAll(".project-name").forEach((name, index) => {
  name.addEventListener("blur", function() {
       // Create a copy of the original JSON object
       let jsonCopy = JSON.parse(JSON.stringify(json));

       // Update the copy with the new date values
       jsonCopy[index].name = name.value;

       // Update the original JSON object with the updated copy
       json = jsonCopy;

  });
});

document.getElementById("download").addEventListener("click", function() {
DownloadJson(json);
});

flatpickr("#startdatepicker", {allowInput:true,  dateFormat: "Y-m", ariaDateFormat: "Y-m"});
flatpickr("#enddatepicker", {allowInput:true,  dateFormat: "Y-m", ariaDateFormat: "Y-m"});


};


const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", displayList);







