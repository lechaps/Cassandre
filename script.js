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

function getStartDate(json, index) {
  let min = new Date(json[1][index].stages[0].Phases[0][0]);

  for (let i = 0; i < json[1][index].stages.length; i++) {
    for (let j = 0; j < json[1][index].stages[i].Phases.length; j++) {
      const phaseStart = new Date(json[1][index].stages[i].Phases[j][0]);
      const phaseEnd = new Date(json[1][index].stages[i].Phases[j][1]);

      if (phaseStart.getTime() < min.getTime()) {
        min = phaseStart;
      }
      if (phaseEnd.getTime() < min.getTime()) {
        min = phaseEnd;
      }
    }
  }

  let resultMonth = (min.getMonth() + 1).toString().padStart(2, '0');
  let resultYear = min.getFullYear().toString();
  return resultYear + '-' + resultMonth;

}

function getEnd(json){

  let max = new Date(getEndDate(json, 0 ));

  for (let i=1; i < json[1].length; i++)
  {
    let date = new Date(getEndDate(json, i ));
    if (date.getTime() > max.getTime())
    {
      max = date;
    }

  }

  let resultMonth = (max.getMonth() + 1).toString().padStart(2, '0');
  let resultYear = max.getFullYear().toString();
  return resultYear + '-' + resultMonth;
}

function getStart(json){

  let min = new Date(json[1][0].stages[0].Phases[0][0])

  for (let i=0; i<json[1].length; i++)
  {
    for (let j=0; j<json[1][i].stages.length; j++)
    {
      let date = new Date(json[1][i].stages[j].Phases[0][0]);

      if (date.getTime() < min.getTime())
      {
        min = date;
      }


    }
  }

  let resultMonth = (min.getMonth() + 1).toString().padStart(2, '0');
  let resultYear = min.getFullYear().toString();
  return resultYear + '-' + resultMonth;

  

}


function generateViewTable(index, subTaskIndex, json) {
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
          <button class="delete-subtask-btn">X</button>
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
  

  table += '<tr><th>' + json[1][index].name+ ' : ' +  json[1][index].stages[subTaskIndex].name + '</th><th>Start Date</th><th>End Date</th></tr>';


  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    const startDate = phase[0];
    const endDate = phase[1];
    table += `<tr><td>Phase ${i+1} <button class="add-phase">+</button> <button class="delete-phase">X</button></td>
              <td><input type="text" id="phasestartdatepicker" class="start-phase" value="${startDate}"></td>
              <td><input type="text" id="phaseenddatepicker" class="end-phase" value="${endDate}"></td></tr>`;
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
    <button class="delete-subtask-btn">X</button>
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

function DeleteStage(e, json, index, subTasksTableBody){
  
  let subTaskIndex = e.target.parentNode.parentNode.rowIndex - 1;

  json[1][index].stages.splice(subTaskIndex,1);

  // Remove the corresponding table row from the HTML table
  const rowToDelete = e.target.parentElement.parentElement;
  rowToDelete.remove();
  
  
  
}

function EditStage(subTasksTableBody,evt,e, json, index){
  if (evt.target.classList.contains("stage-input-start-date") || evt.target.classList.contains("stage-input-end-date") || evt.target.classList.contains("Sub-task-name")) {
    let subTaskIndex = evt.target.parentNode.parentNode.rowIndex - 1;
    let projectstart = e.target.parentNode.parentNode.querySelector('.date-input-start-date');
    let projectend = e.target.parentNode.parentNode.querySelector('.date-input-end-date');
    let rows = subTasksTableBody.rows;
    console.log("ness", projectstart.value);

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
      

      //update all the dates with this duration
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
        // update display of subtask dates
      for (let i = 0; i < subTasksTableBody.rows.length; i++) {
        let row = subTasksTableBody.rows[i];
        let select = row.querySelector('.phases').value;
        console.log("zaba", select);
        row.cells[1].querySelector('.stage-input-start-date').value = json[1][index].stages[i].Phases[Number(select)-1][0];
        row.cells[2].querySelector('.stage-input-end-date').value = json[1][index].stages[i].Phases[Number(select)-1][1] ;
        
      }



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

    //editing the view table


    // Check if the views table already exists
    let table = document.body.querySelector(".sub-task-table");
    if (table) {
    // Remove the sub-task table
     
      table.remove();
    }
<<<<<<< HEAD
    
=======
   
>>>>>>> e79103a1a47404dd91606734cf0600f94236504b

      let subTaskIndex = e.target.parentNode.parentNode.rowIndex - 1;
      console.log(index, subTaskIndex);
      let tableHTML = generateViewTable(index,subTaskIndex, json);
      table = document.createElement('table');
      table.classList.add("sub-task-table");
      table.innerHTML = tableHTML;
      document.body.appendChild(table);

      let sumCells = table.querySelectorAll('.somme');

      json[1][index].stages[subTaskIndex].views.forEach((view, viewIndex) => {
      let sum = 0;
      for (const profile in view.profils) {
          sum += parseInt(view.profils[profile]);
          }
          sumCells[viewIndex].textContent = sum;
          });

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

    //editing the phasetable
  
<<<<<<< HEAD
=======
 
    
>>>>>>> e79103a1a47404dd91606734cf0600f94236504b

    let phasestable = document.body.querySelector(".Phases-table");
    if (phasestable) {
            // Remove the sub-task table
            phasestable.remove();
    }
<<<<<<< HEAD

    
    

=======
    

>>>>>>> e79103a1a47404dd91606734cf0600f94236504b
      
      let tableHTML2 = generatePhasesTable(index,subTaskIndex, json);
      phasestable = document.createElement('table');
      phasestable.classList.add("Phases-table");
      phasestable.innerHTML = tableHTML2;
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
          newRow.firstChild.innerHTML = `Phase ${newPhaseIndex} <button class="add-phase">+</button><button class="delete-phase">X</button>`;
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
            row.firstChild.innerHTML = ` Phase ${phaseIndex} <button class="add-phase">+</button><button class="delete-phase">X</button>`;
            
            select.options[i-1].value = phaseIndex;
            select.options[i-1].text = phaseIndex;
            


          }

          

          
        }

        if (evt.target.classList.contains("delete-phase"))
        {
          let currentRow = evt.target.closest("tr");
          let currentIndex = Array.prototype.indexOf.call(currentRow.parentNode.children, currentRow);

          console.log("delete", currentIndex-1);

          // Update the JSON data
          json[1][index].stages[subTaskIndex].Phases.splice(currentIndex-1 , 1);

          currentRow.remove();

        }
      });
      
    
  
 
<<<<<<< HEAD
    
=======
  
>>>>>>> e79103a1a47404dd91606734cf0600f94236504b

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

function deleteproject(e, index, json){

  // Remove the project at the given index from the JSON array
  json[1].splice(index, 1);

  // Remove the corresponding table row from the HTML table
  const rowToDelete = e.target.parentElement.parentElement;
  rowToDelete.remove();

  // Do something with the updated JSON object, such as sending it to a server or updating the UI
  console.log(json);
  
}

function generateFTEtable(json)
{
  let projects = json[1];

  // Crée une table vide pour stocker les données
  const tableData = {};

  //index of the current project
  let index = 0;


  // Boucle sur tous les projets pour calculer les données du tableau
  projects.forEach((project) => {
  // Boucle sur les vues pour les projets
  project.stages.forEach((stage) => {
    stage.views.forEach((view) => {
      const viewName = view.name;
      const startDate = new Date(stage.Phases[0][0]);
      const endDate = new Date(stage.Phases[stage.Phases.length - 1][1]);
      let yearMonth = startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2);
      // Boucle sur les mois compris entre la date de début et la date de fin de chaque phase
      while (yearMonth <= endDate.getFullYear() + '-' + ('0' + (endDate.getMonth() + 1)).slice(-2)) {
        if (!tableData[viewName]) tableData[viewName] = {};
        if (!tableData[viewName][yearMonth]) tableData[viewName][yearMonth] = 0;
        // Calcule la somme de la charge de chaque profil pour chaque vue pour chaque mois
        Object.values(view.profils).forEach((charge) => {
          tableData[viewName][yearMonth] += charge * 4.33 / 20;
        });
        // Passe au mois suivant
        const year = parseInt(yearMonth.split('-')[0]);
        const month = parseInt(yearMonth.split('-')[1]) + 1;
        if (month > 12) {
          yearMonth = (year + 1) + '-01';
        } else {
          yearMonth = year + '-' + ('0' + month).slice(-2);
        }
      }
     });
  });
});

console.log("fte", tableData);

// Create table element
const table = document.createElement('table');
table.classList.add('FTE-table');

// Create thead element and add header row to table
const thead = document.createElement('thead');
const headerRow = thead.insertRow();
headerRow.insertCell().textContent = '';
for (let year = parseInt(getStart(json).split('-')[0]); year <= parseInt(getEnd(json).split('-')[0]); year++) {
  for (let month = 1; month <= 12; month+=2) {
    const yearMonth = year + '-' + ('0' + month).slice(-2);
    const th = document.createElement('th');
    th.textContent = yearMonth;
    headerRow.appendChild(th);
  }
}
table.appendChild(thead);

// Create tbody element and add data rows to table
const tbody = document.createElement('tbody');
Object.entries(tableData).forEach(([viewName, viewData]) => {
  const row = tbody.insertRow();
  const td1 = document.createElement('td');
  td1.textContent = viewName;
  row.appendChild(td1);
  for (let year = parseInt(getStart(json).split('-')[0]); year <= parseInt(getEnd(json).split('-')[0]); year++) {
    for (let month = 1; month <= 12; month+=2) {
      const yearMonth = year + '-' + ('0' + month).slice(-2);
      const td = document.createElement('td');
      td.textContent = (viewData[yearMonth] || 0).toFixed(2);
      row.appendChild(td);
    }
  }
});

table.appendChild(tbody);



  return table.outerHTML;
}

function getProfilValue(json, viewName, profilName) {
  for (let i=0; i<json[0].length ; i++)
  {
    if(json[0][i].view === viewName)
    {
      return json[0][i].profils[profilName];
    }
  }

}
    

function generateCashOuttable(json)
{
  let projects = json[1];

  // Crée une table vide pour stocker les données
  const tableData = {};

  // Boucle sur tous les projets pour calculer les données du tableau
  projects.forEach((project) => {
  // Boucle sur les vues pour les projets
  project.stages.forEach((stage) => {
    stage.views.forEach((view) => {
      const viewName = view.name;
      const startDate = new Date(stage.Phases[0][0]);
      const endDate = new Date(stage.Phases[stage.Phases.length - 1][1]);
      let yearMonth = startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2);
      // Boucle sur les mois compris entre la date de début et la date de fin de chaque phase
      while (yearMonth <= endDate.getFullYear() + '-' + ('0' + (endDate.getMonth() + 1)).slice(-2)) {
        if (!tableData[viewName]) tableData[viewName] = {};
         // Calculate the total cash out for each fiscal year
         const year = parseInt(yearMonth.split('-')[0]);
         const month = parseInt(yearMonth.split('-')[1]);
         const fiscalYear = (month >= 7) ? year + '-' + (year + 1).toString().substr(-2) : (year - 1) + '-' + year.toString().substr(-2);
         if (!tableData[viewName][fiscalYear]) tableData[viewName][fiscalYear] = 0;
         Object.entries(view.profils).forEach(([profil, charge]) => {
           // Get the TJM for each profile and multiply it by the FTE for each month
           const tjm = getProfilValue(json, viewName, profil);
           const fte = charge * 4.33 / 20;
           tableData[viewName][fiscalYear] += tjm * fte;
         });


         // Passe au mois suivant
         const nextyear = parseInt(yearMonth.split('-')[0]);
         const nextmonth = parseInt(yearMonth.split('-')[1]) + 1;
         if (nextmonth > 12) {
           yearMonth = (nextyear + 1) + '-01';
         } else {
           yearMonth = nextyear + '-' + ('0' + nextmonth).slice(-2);
         }    
        
      }
     });
  });
});

console.log("cashout", tableData);

    // Create table element
    const table = document.createElement('table');
    table.classList.add('cash-out-table');

    // Create table header
    const header = table.createTHead();
    const headerRow = header.insertRow();
    headerRow.insertCell().textContent = 'View';
    Object.keys(tableData[Object.keys(tableData)[0]]).forEach((fiscalYear) => {
      headerRow.insertCell().textContent = fiscalYear;
  });
    

// Create table body
    const body = table.createTBody();
    Object.entries(tableData).forEach(([viewName, viewData]) => {
    const row = body.insertRow();
    row.insertCell().textContent = viewName;
    Object.values(viewData).forEach((cashOut) => {
    const cell = row.insertCell();
    cell.textContent = cashOut.toFixed(2);
});
});



return table.outerHTML;
}



function EditFTE(json){
  let table = document.body.querySelector(".FTE-table");
    if (table) {
    // Remove the sub-task table
     
      table.remove();
    }
    else{

      let tableHTML = generateFTEtable(json);
      table = document.createElement('table');
      table.classList.add("FTE-table");
      table.innerHTML = tableHTML;
      document.body.appendChild(table);

      
 
    }
}

function EditCashout(json){
  let table = document.body.querySelector(".cash-out-table");
    if (table) {
    // Remove the sub-task table
     
      table.remove();
    }
    else{

      let tableHTML = generateCashOuttable(json);
      table = document.createElement('table');
      table.classList.add("cash-out-table");
      table.innerHTML = tableHTML;
      document.body.appendChild(table);

      
 
    }
}

const input = document.getElementById("file");
let reader;
let json
input.addEventListener("change", function(e) {
const file = e.target.files[0];
reader = new FileReader();
reader.onload = function() {
json = JSON.parse(reader.result);
generateCashOuttable(json);
};
reader.readAsText(file);
});





function displayList() {
  let placeholder = document.querySelector("#data-output");
  let out = "", out2="", out3="";
  
  json = JSON.parse(reader.result);
   json[1].forEach((element, index) => {
    out += `
    <tr>
       <td class="project-container">
          <input type="text" class="project-name"  data-index="${index}" value="${element.name}">
          <button class="add-project-btn">+</button>
          <button class="delete-project-btn">X</button>
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
        if (e.target.classList.contains("delete-subtask-btn")) {
          
          DeleteStage(e ,json, index, subTasksTableBody);
         }
      });

      subTasksTableBody.addEventListener("input", function(evt) {
        EditStage(subTasksTableBody,evt,e, json, index);
        
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
        <button class="delete-project-btn">X</button>
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
                  jsonCopy[1][index].stages.splice(i, 0, {name: config[i].name, 
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

      if (e.target.classList.contains("delete-project-btn"))
      {
        console.log("oussama");
        let index = e.target.parentNode.parentNode.rowIndex-1;
        deleteproject(e, index, json);
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

document.getElementById("FTE").addEventListener("click", function() {
    EditFTE(json);
    
    });

document.getElementById("CashOut").addEventListener("click", function() {
     EditCashout(json);
      
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







