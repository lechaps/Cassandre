function addMonthsToDate(dateString, duration) {

  if (duration === 0)
  {
    return dateString;
  }

  else{
  let dateArr = dateString.split("-");
  let year = parseInt(dateArr[0].toString());
  let month = parseInt(dateArr[1].toString());
  let date = new Date(year, month-1, 1);
  date.setMonth(date.getMonth() + parseInt(duration));
  let resultMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  let resultYear = date.getFullYear().toString();
  return resultYear + '-' + resultMonth;
}
}

function getMonthsDuration(old_year, new_year)
{
  if (old_year === "")
  {
    return 0;
  }

  else{
  let olddateArr = old_year.split("-");
  let newdateArr = new_year.split("-");

  let oldyear = parseInt(olddateArr[0].toString());
  let oldmonth = parseInt(olddateArr[1].toString());
  let olddate = new Date(oldyear, oldmonth-1, 1);

  let newyear = parseInt(newdateArr[0].toString());
  let newmonth = parseInt(newdateArr[1].toString());
  let newdate = new Date(newyear, newmonth-1, 1);

  let diffYears = (newyear - oldyear) * 12;
  let diffMonths = newdate.getMonth() - olddate.getMonth();

  return Number(diffYears + diffMonths);
  }



}

function getEndDate(json, index) {
  let max = new Date(json[1][index].start_date);

  for (let i = 0; i < json[1][index].stages.length; i++) {
    for (let j = 0; j < json[1][index].stages[i].Phases.length; j++) {
      const phaseStart = new Date(json[1][index].stages[i].Phases[j][0]);
      const phaseEnd = new Date(json[1][index].stages[i].Phases[j][1]);

      if (phaseStart.getTime() > max.getTime()) {
        max = phaseStart;
      }
      if (phaseEnd.getTime() > max.getTime()) {
        max = phaseEnd;
      }
    }
  }

  let resultMonth = (max.getMonth() + 1).toString().padStart(2, '0');
  let resultYear = max.getFullYear().toString();
  return resultYear + '-' + resultMonth;

}


function generateSubTaskTable(index, subTaskIndex, json) {
  let subTaskData = json[1][index].stages[subTaskIndex];

  let profils = Object.keys(subTaskData.views[0].profils);
  let views = subTaskData.views.map(v => v.name);

  let tableHTML = `
  <table class="sub-task-table">
    <thead>
      <tr>
        <th>${json[1][index].stages[subTaskIndex].name}</th>
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
            <td><span class="somme" id="enddatepicker">0</span></td>
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

function generateTJM(json){
  const views = json[0].map((item) => item.view);
  const profils = Object.keys(json[0][0].profils);

  const tableHTML = `
    <table class="TJM-table">
      <thead>
        <tr>
          <th>TJM</th>
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
              ${profils.map((profil) => {
                let value = json[0].find((item) => item.view === view).profils[profil];
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

function EditTJM(json){

  let table = document.body.querySelector(".TJM-table");
    if (table) {
    // Remove the sub-task table
     
      table.remove();
    }
    else{

      let tableHTML = generateTJM(json);
      table = document.createElement('table');
      table.classList.add("TJM-table");
      table.innerHTML = tableHTML;
      document.body.appendChild(table);

      table.addEventListener("input", function(e) {
        let viewindex = e.target.parentNode.parentNode.rowIndex - 1;
        let profil = e.target.className;
        console.log("the view index is : ", viewindex);
        json[0][viewindex].profils[profil] = e.target.value;
       
      });
  
 
    }
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
        
        json[1][index].stages.forEach(function(subTask) {
          for(let  i=0; i<subTask.Phases.length; i++)
          {
            phasesmenu += `<option value="${i+1}">${i+1}</option>`;
          }
          subTasksOut += `
        <tr>
        <td class="Sub-task-container">
          <input type="text" class="Sub-task-name"  data-index="${index}" value="${subTask.name}">
          <button class="add-subtask-btn">+</button>
        </td>
        <td>
          <input type="text" class="stage-input-start-date" id="stagestartdatepicker" data-index="${index}" value="${subTask.Phases[0][0]}">
        </td>
        <td>
          <input type="text" class="stage-input-end-date" id="stageenddatepicker" data-index="${index}" value="${subTask.Phases[0][1]}">
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

  let phases = json[1][index].stages[subTaskIndex].Phases;
  let table = '<table>';
  

  table += '<tr><th>' + json[1][index].stages[subTaskIndex].name + '</th><th>Start Date</th><th>End Date</th></tr>';


  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    const startDate = phase[0];
    const endDate = phase[1];
    table += `<tr><td>Phase ${i+1} <button class="add-phase">+</button></td><td><input type="text" id="phasestartdatepicker" class="start-phase" value="${startDate}"></td><td><input type="text" id="phaseenddatepicker" class="end-phase" value="${endDate}"></td></tr>`;
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
  <td>
    <select class="phases" id="phasesmenu">
      <option value=1>1</option>
             
    </select>
  </td> 
  `;
  e.target.parentElement.parentElement.after(newRow);
  let parentIndex = Array.from(subTasksTableBody.children).indexOf(newRow);
  console.log(parentIndex);
  json[1][index].stages.splice(parentIndex, 0, {name: '', Phases : [["",""]], views : viewconfig });
  reader.readAsText(new Blob([JSON.stringify(json)], { type: 'application/json' }));
  flatpickr("#stagestartdatepicker", {allowInput:true, plugins: [
    new monthSelectPlugin({
      dateFormat: "Y-m", //defaults to "F Y"
      theme: "light" // defaults to "light"
    })
  ]});
  
  flatpickr("#stageenddatepicker", {allowInput:true, plugins: [
    new monthSelectPlugin({
    
      dateFormat: "Y-m", //defaults to "F Y"
      theme: "light" // defaults to "light"
    })
  ]});
}

function EditStage(evt,e, json, index){
  if (evt.target.classList.contains("stage-input-start-date") || evt.target.classList.contains("stage-input-end-date") || evt.target.classList.contains("Sub-task-name")) {
    let subTaskIndex = evt.target.parentNode.parentNode.rowIndex - 1;
    let projectstart = e.target.parentNode.parentNode.querySelector('.date-input-start-date');
    let projectend = e.target.parentNode.parentNode.querySelector('.date-input-end-date');
    console.log("zab", projectstart.value);

    let select = evt.target.parentNode.parentNode.querySelector('.phases');
    
    
    if (evt.target.classList.contains("stage-input-start-date")) {
      
      let data = json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][0] ;

      //let's get our duration
      console.log("vhv", data.toString());
      let duration = getMonthsDuration(data.toString(), evt.target.value.toString());
      console.log("ffff", duration);

      //update the statrting date of the project
      json[1][index].start_date = addMonthsToDate(json[1][index].start_date.toString(), duration)
      projectstart.value = json[1][index].start_date;
      

      //updae all the dates with this duration
      for (let i =0; i< json[1][index].stages.length; i++ ) 
        {
         for (let j=0; j<json[1][index].stages[i].Phases.length; j++)
         {
          if (json[1][index].stages[i].Phases[j][0]===""){
            json[1][index].stages[i].Phases[j][0] = evt.target.value.toString()

          }

          else{


           json[1][index].stages[i].Phases[j][0] = addMonthsToDate(json[1][index].stages[i].Phases[j][0].toString(), duration);
           json[1][index].stages[i].Phases[j][1] = addMonthsToDate(json[1][index].stages[i].Phases[j][1].toString(), duration);
         }
        }


        }

        projectend.textContent = getEndDate(json, index);




    } else if (evt.target.classList.contains("stage-input-end-date")) {
      let data = json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][1];
      //let's get our duration
      let duration = getMonthsDuration(data.toString(), evt.target.value.toString());
      console.log("ffff", duration);

      //update the statrting date of the project
      json[1][index].start_date = addMonthsToDate(json[1][index].start_date.toString(), duration);
      projectstart.value = json[1][index].start_date;
      

      //updae all the dates with this duration
      for (let i =0; i< json[1][index].stages.length; i++ ) 
        {
         for (let j=0; j<json[1][index].stages[i].Phases.length; j++)
         {
          if (json[1][index].stages[i].Phases[j][1]===""){
            json[1][index].stages[i].Phases[j][1] = evt.target.value.toString()

          }

          else{
           json[1][index].stages[i].Phases[j][0] = addMonthsToDate(json[1][index].stages[i].Phases[j][0].toString(), duration);
           json[1][index].stages[i].Phases[j][1] = addMonthsToDate(json[1][index].stages[i].Phases[j][1].toString(), duration);
         }
        }


        }

        projectend.textContent = getEndDate(json, index);
      
    }
    else{
      json[1][index].stages[subTaskIndex].name = evt.target.value;

    }
    
  }
}

function EditView(e, json, index){
  if (e.target.classList.contains("Sub-task-name")) {
    // Check if the views table already exists
    let table = document.body.querySelector(".sub-task-table");
    if (table) {
    // Remove the sub-task table
     
      table.remove();
    }
    else{

      let subTaskIndex = e.target.parentNode.parentNode.rowIndex - 1;
      console.log(index, subTaskIndex);
      let tableHTML = generateSubTaskTable(index,subTaskIndex, json);
      table = document.createElement('table');
      table.classList.add("sub-task-table");
      table.innerHTML = tableHTML;
      document.body.appendChild(table);

      table.addEventListener("input", function(e) {
        let viewindex = e.target.parentNode.parentNode.rowIndex - 1;
        let profil = e.target.className;
        console.log("the view index is : ", viewindex);
        json[1][index].stages[subTaskIndex].views[viewindex].profils[profil] = e.target.value;

        //calcul de somme
        let somme=0;
        for (const profile in json[1][index].stages[subTaskIndex].views[viewindex].profils){
          somme += parseInt(json[1][index].stages[subTaskIndex].views[viewindex].profils[profile]);
        }

        //display the somme
        let sum = e.target.parentNode.parentNode.querySelector('.somme');
        sum.textContent = somme;
       
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

     

      
      phasestable.addEventListener("input", function(evt) {
        let phaseindex = evt.target.parentNode.parentNode.rowIndex - 1;
        let date = evt.target.className;
        let j=1;

        if (date === "start-phase" )
        {
          j = 0;
          let select = e.target.parentNode.parentNode.querySelector('.phases');
          console.log("val",select.value);
          console.log("val",phaseindex);
        
         

          if (Number(phaseindex) === Number(select.value)){
              console.log("ouuuuuuuus")
              let row = e.target.parentNode.parentNode;
              let startDateInput = row.querySelector('.stage-input-start-date');
              startDateInput.value = evt.target.value;

              let endDateInput = row.querySelector('.stage-input-end-date');
          }
          

        }

        json[1][index].stages[subTaskIndex].Phases[phaseindex][j] = evt.target.value;
       
      });

      
     


      phasestable.addEventListener("click", function(evt) {
        if (evt.target.classList.contains("add-phase")) {
          
          let currentRow = evt.target.closest("tr");
          let currentIndex = Array.prototype.indexOf.call(currentRow.parentNode.children, currentRow);
      
          // Clone the current row to create the new row
          let newRow = currentRow.cloneNode(true);
          let newPhaseIndex = parseInt(newRow.firstChild.textContent.match(/\d+/)) + 1;
          newRow.firstChild.innerHTML = `Phase ${newPhaseIndex} <button class="add-phase">+</button>`;
          newRow.children[1].firstChild.value = "";
          newRow.children[1].firstChild.id = `phasestartdatepicker`;
          newRow.children[2].firstChild.value = "";
          newRow.children[2].firstChild.id = `phaseenddatepicker`;
          currentRow.after(newRow);
      
          // Update the JSON data
          json[1][index].stages[subTaskIndex].Phases.splice(currentIndex , 0, ["", ""]);

          let select = e.target.parentNode.parentNode.querySelector('.phases');

          // Get the number of existing options
          let numOptions = select.options.length;

          // Create a new option element
          let newOption = document.createElement('option');
          let phaseIndex = numOptions + 1;
          newOption.value = phaseIndex;
          newOption.text = `${phaseIndex}`;

          // Append the new option to the select element
          select.appendChild(newOption);
          console.log("fff",newPhaseIndex);

          select.options[newPhaseIndex-1].value = newPhaseIndex;
          select.options[newPhaseIndex-1].text = newPhaseIndex;
          console.log("index is", currentIndex);

      
          // Update the remaining rows
     
          for (let i = currentIndex + 2; i < phasestable.rows.length; i++) {
            let row = phasestable.rows[i];
            let phaseIndex = parseInt(row.firstChild.textContent.match(/\d+/)) + 1;
            row.firstChild.innerHTML = ` Phase ${phaseIndex} <button class="add-phase">+</button>`;
            
            select.options[i-1].value = phaseIndex;
            select.options[i-1].text = phaseIndex;
            


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
      let selectedPhase = json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1];
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
console.log("zab",getEndDate(json,0));
};
reader.readAsText(file);
});




function displayList() {
  let placeholder = document.querySelector("#data-output");
  let out = "", out2="", out3="";
  
  let json = JSON.parse(reader.result);
   json[1].forEach((element, index) => {
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
      <span class="date-input-end-date" id="enddatepicker" data-index="${index}">${getEndDate(json, index)}</span>
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

      subTasksTableBody.addEventListener("input", function(evt) {
        EditStage(evt,e, json, index);
        
      });

      subTasksTableBody.addEventListener("click", function(e) {
        EditView(e, json, index);
      });  
      
      flatpickr("#stagestartdatepicker", {allowInput:true, plugins: [
        new monthSelectPlugin({
          dateFormat: "Y-m", //defaults to "F Y"
          theme: "light" // defaults to "light"
        })
      ]});
      
      flatpickr("#stageenddatepicker", {allowInput:true, plugins: [
        new monthSelectPlugin({
        
          dateFormat: "Y-m", //defaults to "F Y"
          theme: "light" // defaults to "light"
        })
      ]});

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
        <input type="text" class="date-input-start-date" id="startdatepicker" value = "">
        </td>
        <td>
        <span class="date-input-end-date" id="enddatepicker"></span>

        </td>
        `;


        e.target.parentElement.parentElement.after(newRow);
        let index = Array.from(placeholder.children).indexOf(newRow);
        json[1].splice(index, 0, {name: '', start_date: '', end_date: '', stages:[]});
        reader.readAsText(new Blob([JSON.stringify(json)], { type: 'application/json' }));

        // Get the start and end date inputs for the new row
        const date = newRow.querySelector(".date-input-start-date");
        const endDateInput = newRow.querySelector(".date-input-end-date");

        flatpickr(date, { allowInput: true, plugins: [
             new monthSelectPlugin({
              dateFormat: "Y-m", //defaults to "F Y"
              theme: "light" // defaults to "light"
              })
          ]});
          
        console.log(json);
          date.addEventListener("input", function() {
              if (date.value)
              {
            
               // Create a copy of the original JSON object
               let jsonCopy = JSON.parse(JSON.stringify(json));
      
               // Update the copy with the new date values
               jsonCopy[1][index].start_date = date.value;
               console.log(date.value);


               //remplir les satges à partir d'un script config
               if(jsonCopy[1][index].stages && jsonCopy[1][index].stages.length === 0){
                console.log("ce projet est encore vide !!!!!!, je vais le remplit pour vous :)");
                console.log(typeof(date.value));
                console.log(addMonthsToDate(date.value.toString(), config[0].duration));
      
                jsonCopy[1][index].stages.splice(0, 0, {name: config[0].name,
                                                     Phases : [[date.value.toString(),addMonthsToDate(date.value.toString(), config[0].duration) ]],
                                                    views : viewconfig});
                 for(let i=1; i< config.length ; i++ )
                 {
                  jsonCopy[1][index].stages.splice(i, 0, {name: config[0].name, 
                                                     Phases : [[jsonCopy[1][index].stages[i-1].Phases[0][1],addMonthsToDate(jsonCopy[1][index].stages[i-1].Phases[0][1], config[i].duration) ]],
                                                     views : viewconfig});
                 }

                    

              
              }

              // Update the original JSON object with the updated copy
              json = jsonCopy;

              console.log("zab", getEndDate(json, index));

              endDateInput.textContent = getEndDate(json, index).toString();
       
               
       
               // Do something with the updated JSON object, such as sending it to a server or updating the UI
               console.log(json);
            }

      
          });

          
      
      
      
      document.querySelectorAll(".date-input-end-date").forEach((date, index) => {
        date.addEventListener("blur", function() {
             // Create a copy of the original JSON object
             let jsonCopy = JSON.parse(JSON.stringify(json));
      
             // Update the copy with the new date values
             jsonCopy[index][1].end_date = date.value;
      
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
             jsonCopy[index][1].name = name.value;
      
             // Update the original JSON object with the updated copy
             json = jsonCopy;
      
             // Do something with the updated JSON object, such as sending it to a server or updating the UI
             console.log(json);
      
        });
      });

      flatpickr("#startdatepicker", {allowInput:true,  plugins: [
        new monthSelectPlugin({
          dateFormat: "Y-m", //defaults to "F Y"
          theme: "light" // defaults to "light"
        })
      ]});

      flatpickr("#enddatepicker", {allowInput:true, plugins: [
        new monthSelectPlugin({
        
          dateFormat: "Y-m", //defaults to "F Y"
          theme: "light" // defaults to "light"
        })
      ]});


      }


      

   });


document.querySelectorAll(".date-input-start-date").forEach((date, index) => {
    date.addEventListener("input", function(e) {
         // Create a copy of the original JSON object
         let jsonCopy = JSON.parse(JSON.stringify(json));

         //let's get our duration
         let duration = getMonthsDuration(jsonCopy[1][index].start_date.toString(), date.value.toString());
         console.log("ffff", duration);

         //updae all the dates with this duration
         for (let i =0; i< json[1][index].stages.length; i++ ) 
         {
          for (let j=0; j<json[1][index].stages[i].Phases.length; j++)
          {
            jsonCopy[1][index].stages[i].Phases[j][0] = addMonthsToDate(jsonCopy[1][index].stages[i].Phases[j][0].toString(), duration);
            jsonCopy[1][index].stages[i].Phases[j][1] = addMonthsToDate(jsonCopy[1][index].stages[i].Phases[j][1].toString(), duration);
          }


         }

         // Update the copy with the new date values
         jsonCopy[1][index].start_date = date.value;

         // Update the original JSON object with the updated copy
         json = jsonCopy;

         //update the display
         let subTasksTable = e.target.parentNode.parentNode.querySelector(".sub-tasks-table");
         if (subTasksTable)
         {
          
         }

    });
});

document.querySelectorAll(".project-name").forEach((name, index) => {
  name.addEventListener("blur", function() {
       // Create a copy of the original JSON object
       let jsonCopy = JSON.parse(JSON.stringify(json));

       // Update the copy with the new date values
       jsonCopy[1][index].name = name.value;

       // Update the original JSON object with the updated copy
       json = jsonCopy;

  });
});

document.getElementById("download").addEventListener("click", function() {
DownloadJson(json);
});

document.getElementById("TJM").addEventListener("click", function() {
  EditTJM(json);
  
  });

flatpickr("#startdatepicker", {allowInput:true, plugins: [
  new monthSelectPlugin({

    dateFormat: "Y-m", //defaults to "F Y"
    theme: "light" // defaults to "light"
  })
]});


flatpickr("#enddatepicker", {allowInput:true, plugins: [
  new monthSelectPlugin({
  
    dateFormat: "Y-m", //defaults to "F Y"
    theme: "light" // defaults to "light"
  })
]});


};


const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", displayList);







