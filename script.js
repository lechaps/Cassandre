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


function generateSubTaskTable(index, subTaskIndex, json) {
  let subTaskData = json[1][index].stages[subTaskIndex];

  let profils = Object.keys(subTaskData.views[0].profils);
  let views = subTaskData.views.map(v => v.name);

  let tableHTML = `
  <table class="sub-task-table">
    <thead>
      <tr>
        <th>${json[1][index].stages[subTaskIndex].name}</th>
        <th>Commentaire</th>
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
            <td><input type="text" class="commentaire" value="${subTaskData.views.find(v => v.name === view).commentary}"></td>
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

      // Create button element and set its style
      const button = document.createElement('button');
      button.textContent = 'Clear';
      button.style.backgroundColor = 'red';
      button.style.color = 'white';
      button.style.padding = '10px';
      button.style.borderRadius = '5px';
      button.style.marginTop = '20px';
      button.id = 'ClearTJM'
      table.appendChild(button);

      table.addEventListener("input", function(e) {
        let viewindex = e.target.parentNode.parentNode.rowIndex - 1;
        let profil = e.target.className;
        console.log("the view index is : ", viewindex);
        json[0][viewindex].profils[profil] = e.target.value;
       
      });

       //add code for clear button
       document.getElementById("ClearTJM").addEventListener("click", function() {
        if(table)
        {
          table.remove();
        }
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
    <button class="delete-project-btn">X</button>

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
  
  json[1][index].stages.splice(parentIndex, 0, {name: '', Phases : [["",""]], views : viewconfig });
  
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
    console.log("zab", projectstart.value);

    let select = evt.target.parentNode.parentNode.querySelector('.phases');
    
    
    if (evt.target.classList.contains("stage-input-start-date")) {
      
      let data = json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][0] ;

      //let's get our duration
      let duration = getMonthsDuration(data.toString(), evt.target.value.toString());

      //update the statrting date of the project if it is the first phase of the first stage and all the other dates
      if (subTaskIndex == 0 && (Number(select.value)-1) == 0)
      {
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
      
      }

      else{

        //update just the stage if the date is valid
        const firstdate = new Date(json[1][index].stages[0].Phases[0][0]);
        const inputdate = new Date(evt.target.value.toString())

        if (inputdate.getTime() < firstdate.getTime())
        {
          console.log("date too small")
        }

        else{
          if (json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][0]===""){
            json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][0] = evt.target.value.toString()

          }

          else{
           json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][0] = addMonthsToDate(json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][0].toString(), duration);
           json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][1] = addMonthsToDate(json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][1].toString(), duration);
           
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

      //the end date should be bigger than the start date of the phase 
      const firstdate = new Date(json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][0]);
      const inputdate = new Date(evt.target.value.toString());

      if (inputdate.getTime() < firstdate.getTime())
      {
        console.log("date too small")
      }

      else{
        if (json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][1]===""){
          json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][1] = evt.target.value.toString()

        }

        else{
         json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][1] = addMonthsToDate(json[1][index].stages[subTaskIndex].Phases[Number(select.value)-1][1].toString(), duration);
         
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
        
      
    }
    else{
      json[1][index].stages[subTaskIndex].name = evt.target.value;

    }

    //update the gantt 
    let gantt = document.querySelector('#gantt')

    if (gantt)
    {
    console.log("gantt should be updated !!")

    gantt = new Gantt("#gantt", convertData(json), {
      header_height: 50,
      column_width: 10,
      step: 24,
      view_mode: 'Year',
      bar_height: 20,
      bar_corner_radius: 3,
      arrow_curve: 5,
      padding: 18,
      date_format: 'YYYY-MM',
      language: 'en', // or 'fr'
      custom_popup_html: null,

      on_click: function (task) {
      },

      on_date_change: function(task, start, end) {

        if (task.id.includes('Task')){
          let projectindex = task.location[0];
          json[1][projectindex].start_date = convertDate(start);
          json[1][projectindex].end_date = convertDate(end);

          let startProject = document.querySelectorAll(".date-input-start-date");
          let endProject = document.querySelectorAll(".date-input-end-date");

          startProject[projectindex].value = convertDate(start);
          endProject[projectindex].textContent = convertDate(end);
           
        }

        else{
          let projectindex = task.location[0];
          let satgeindex = task.location[1];
          let phaseindex = task.location[2];
          let totallength = 0;
          json[1][projectindex].stages[satgeindex].Phases[phaseindex][0] = convertDate(start);
          json[1][projectindex].stages[satgeindex].Phases[phaseindex][1] = convertDate(end);

          for(let i=0; i< projectindex; i++)
          {
            totallength += json[1][projectindex].stages.length();
          }


          let startStage = document.querySelectorAll(".stage-input-start-date");
          let endStage  = document.querySelectorAll(".stage-input-end-date");
          let phase = document.querySelectorAll(".phases");
          

          if (Number(phase[satgeindex + totallength].value) == phaseindex + 1)
          {

            startStage[satgeindex + totallength].value = convertDate(start);
            endStage[satgeindex + totallength].value = convertDate(end);


          }

        }  

      },

      on_view_change: function(mode) {
        console.log(mode);
      }

    });

    

    document.querySelector(".chart-controls #year-btn").addEventListener("click", () => {
      gantt.change_view_mode("Year");
  })
    document.querySelector(".chart-controls #month-btn").addEventListener("click", () => {
      gantt.change_view_mode("Month");
  })
  
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
    

      let subTaskIndex = e.target.parentNode.parentNode.rowIndex - 1;
      console.log(index, subTaskIndex);
      let tableHTML = generateSubTaskTable(index,subTaskIndex, json);
      table = document.createElement('table');
      table.classList.add("sub-task-table");
      table.innerHTML = tableHTML;
      

      let sumCells = table.querySelectorAll('.somme');

      json[1][index].stages[subTaskIndex].views.forEach((view, viewIndex) => {
      let sum = 0;
      for (const profile in view.profils) {
          sum += parseFloat(view.profils[profile]);
          }
          sumCells[viewIndex].textContent = sum;
          });

      table.addEventListener("input", function(e) {
        if (!e.target.classList.contains("commentaire"))
        {
        let viewindex = e.target.parentNode.parentNode.rowIndex - 1;
        let profil = e.target.className;
        console.log("the view index is : ", viewindex);
        json[1][index].stages[subTaskIndex].views[viewindex].profils[profil] = e.target.value;

        //calcul de somme
        let somme=0;
        for (const profile in json[1][index].stages[subTaskIndex].views[viewindex].profils){
          somme += parseFloat(json[1][index].stages[subTaskIndex].views[viewindex].profils[profile]);
        }

        //display the somme
        let sum = e.target.parentNode.parentNode.querySelector('.somme');
        sum.textContent = somme;
      }

      else{
        let viewindex = e.target.parentNode.parentNode.rowIndex - 1;

        json[1][index].stages[subTaskIndex].views[viewindex].commentary = e.target.value;

      }
       
      });

    //editing the phasetable

    

    
  

    let phasestable = document.body.querySelector(".Phases-table");
    if (phasestable) {
            // Remove the sub-task table
            phasestable.remove();
    }

    
    

      
      let tableHTML2 = generatePhasesTable(index,subTaskIndex, json);
      phasestable = document.createElement('table');
      phasestable.classList.add("Phases-table");
      phasestable.innerHTML = tableHTML2;
      document.body.appendChild(phasestable);
      document.body.appendChild(table);

      // Create button element and set its style
      const button = document.createElement('button');
      button.textContent = 'Clear';
      button.style.backgroundColor = 'red';
      button.style.color = 'white';
      button.style.padding = '10px';
      button.style.borderRadius = '5px';
      button.style.marginTop = '20px';
      button.id = 'Clearview'
      table.appendChild(button);

      //add code for clear button
      document.getElementById("Clearview").addEventListener("click", function() {
        if(phasestable && table)
        {
          phasestable.remove();
          table.remove();
        }
        });


      // Insert the subtask table after the phases table
      phasestable.insertAdjacentElement('afterend', table);

      flatpickr("#phasestartdatepicker", {allowInput:true, plugins: [
        new monthSelectPlugin({
          dateFormat: "Y-m", //defaults to "F Y"
          theme: "light" // defaults to "light"
        })
      ]});
      
      flatpickr("#phaseenddatepicker", {allowInput:true, plugins: [
        new monthSelectPlugin({
        
          dateFormat: "Y-m", //defaults to "F Y"
          theme: "light" // defaults to "light"
        })
      ]});    

      
      phasestable.addEventListener("input", function(evt) {
        console.log("ousss");
        let phaseindex = evt.target.parentNode.parentNode.rowIndex - 1;
        let date = evt.target.className;
        let j=1;
        console.log("ggggg",date)

        if (date.toString() == "start-phase flatpickr-input active" )
        {
          j = 0;
          let select = e.target.parentNode.parentNode.querySelector('.phases');

          const firstdate = new Date(json[1][index].stages[0].Phases[0][0]);
          const newdate = new Date(evt.target.value);

          if (newdate.getTime() < firstdate.getTime())
          {
            alert("Warning : the date you entred is too small comparing to the starting date of the project");
            evt.target.value = json[1][index].stages[subTaskIndex].Phases[phaseindex][0];
          }

          else{

          

          if (Number(phaseindex) === Number(select.value)-1){
              let row = e.target.parentNode.parentNode;
              let startDateInput = row.querySelector('.stage-input-start-date');
              startDateInput.value = evt.target.value;

          }

          json[1][index].stages[subTaskIndex].Phases[phaseindex][0] = evt.target.value;
        }  

        }

        if (date === "end-phase flatpickr-input active" )
        {
          let select = e.target.parentNode.parentNode.querySelector('.phases');

          const firstdate = new Date(json[1][index].stages[subTaskIndex].Phases[phaseindex][0]);
          const newdate = new Date(evt.target.value);
          console.log("phasa1",firstdate)
          console.log("phasa2",newdate)


          if (newdate.getTime() < firstdate.getTime())
          {
            alert("Warning : the date you entred is too small comparing to the starting date of this phase");
            evt.target.value = json[1][index].stages[subTaskIndex].Phases[phaseindex][1];

          }

          else{
    
          if (Number(phaseindex) === Number(select.value)-1){
              let row = e.target.parentNode.parentNode;
              let endDateInput = row.querySelector('.stage-input-end-date');
              endDateInput.value = evt.target.value;

          }

          json[1][index].stages[subTaskIndex].Phases[phaseindex][1] = evt.target.value;

        }

        }
       
       
      });

      
      phasestable.addEventListener("click", function(evt) {
        if (evt.target.classList.contains("add-phase")) {
          
          let currentRow = evt.target.closest("tr");
          let currentIndex = Array.prototype.indexOf.call(currentRow.parentNode.children, currentRow);
      
          // Clone the current row to create the new row
          let newRow = currentRow.cloneNode(true);
          let newPhaseIndex = parseInt(newRow.firstChild.textContent.match(/\d+/)) + 1;
          newRow.firstChild.innerHTML = `Phase ${newPhaseIndex} <button class="add-phase">+</button> <button class="delete-phase">X</button>`;
          newRow.children[1].firstChild.value = "";
          newRow.children[1].firstChild.id = `phasestartdatepicker`;
          newRow.children[1].firstChild.class = `start-phase`;
          newRow.children[2].firstChild.value = "";
          newRow.children[2].firstChild.id = `phaseenddatepicker`;
          newRow.children[2].firstChild.class = `end-phase`;

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

          select.options[newPhaseIndex-1].value = newPhaseIndex;
          select.options[newPhaseIndex-1].text = newPhaseIndex;
     
          // Update the remaining rows
     
          for (let i = currentIndex + 2; i < phasestable.rows.length; i++) {
            let row = phasestable.rows[i];
            let phaseIndex = parseInt(row.firstChild.textContent.match(/\d+/)) + 1;
            row.firstChild.innerHTML = ` Phase ${phaseIndex} <button class="add-phase">+</button> <button class="delete-phase">X</button>`;
            
            select.options[i-1].value = phaseIndex;
            select.options[i-1].text = phaseIndex;

          }    

          flatpickr("#phasestartdatepicker", {allowInput:true, plugins: [
            new monthSelectPlugin({
              dateFormat: "Y-m", //defaults to "F Y"
              theme: "light" // defaults to "light"
            })
          ]});
          
          flatpickr("#phaseenddatepicker", {allowInput:true, plugins: [
            new monthSelectPlugin({
            
              dateFormat: "Y-m", //defaults to "F Y"
              theme: "light" // defaults to "light"
            })
          ]});      
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
  let fteData = {};

  //index of the current project
  let index = 0;


  // Boucle sur tous les projets pour calculer les données du tableau
  projects.forEach((project) => {
  // Boucle sur les vues pour les projets
  const projectdata ={};
  project.stages.forEach((stage) => {
    stage.views.forEach((view) => {
      const viewName = view.name;
      const startDate = new Date(stage.Phases[0][0]);
      const endDate = new Date(stage.Phases[stage.Phases.length - 1][1]);
      let yearMonth = startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2);
      // Boucle sur les mois compris entre la date de début et la date de fin de chaque phase
      while (yearMonth <= endDate.getFullYear() + '-' + ('0' + (endDate.getMonth() + 1)).slice(-2)) {
        if (!tableData[viewName]) {
          tableData[viewName] = {};
          
        }
        if (!projectdata[viewName]) {
          projectdata[viewName] = {};
        }
        if (!tableData[viewName][yearMonth]) {
          tableData[viewName][yearMonth] = 0;
          
        }
        if (!projectdata[viewName][yearMonth]) {
          projectdata[viewName][yearMonth] = 0;
         
        }
        // Calcule la somme de la charge de chaque profil pour chaque vue pour chaque mois
        Object.values(view.profils).forEach((charge) => {
          tableData[viewName][yearMonth] += charge * 4.33 / 20;
          projectdata[viewName][yearMonth] += charge * 4.33 / 20;
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
  // Add the table data to fteData object with the project name as key
  fteData[project.name] = projectdata;
});

console.log("fte", tableData);
console.log("fte by project ", fteData);


// Create table element
const table = document.createElement('table');
table.classList.add('FTE-table');

// Create thead element and add header row to table
const thead = document.createElement('thead');
const headerRow = thead.insertRow();
const th = document.createElement('th');
th.textContent = 'Total FTE';
headerRow.appendChild(th);
for (let year = parseInt(getStart(json).split('-')[0]); year <= parseInt(getEnd(json).split('-')[0]); year++) {
  for (let month = 1; month <= 12; month+=1) {
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
    for (let month = 1; month <= 12; month+=1) {
      const yearMonth = year + '-' + ('0' + month).slice(-2);
      const td = document.createElement('td');
      td.textContent = (viewData[yearMonth] || 0).toFixed(2);
      row.appendChild(td);
    }
  }
});

table.appendChild(tbody);

// Create a div element to wrap the table and enable horizontal scrolling
const tableWrapper = document.createElement('div');
tableWrapper.style.width = '100%';
tableWrapper.style.overflowX = 'scroll';
tableWrapper.appendChild(table);

// Create a container for the buttons
const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';


// Create button element and set its style
const button = document.createElement('button');
button.textContent = 'Details';
button.style.backgroundColor = 'blue';
button.style.color = 'white';
button.style.padding = '10px';
button.style.borderRadius = '5px';
button.style.marginTop = '20px';
button.style.marginRight = '10px'; // add margin-right

button.id = 'details'

// Create button element and set its style
const button2 = document.createElement('button');
button2.textContent = 'Clear';
button2.style.backgroundColor = 'red';
button2.style.color = 'white';
button2.style.padding = '10px';
button2.style.borderRadius = '5px';
button2.style.marginTop = '20px';
button2.style.right = '20px';


button2.id = 'ClearFTE';

// Add the buttons to the container element
buttonContainer.appendChild(button);
buttonContainer.appendChild(button2);

// Add the container element to the table
table.appendChild(buttonContainer);


  return table.outerHTML;
}


function generateFteperproject(json) {
  let projects = json[1];

  // Crée une table vide pour stocker les données
  const tableData = {};
  let fteData = {};

  //index of the current project
  let index = 0;


  // Boucle sur tous les projets pour calculer les données du tableau
  projects.forEach((project) => {
  // Boucle sur les vues pour les projets
  const projectdata ={};
  project.stages.forEach((stage) => {
    stage.views.forEach((view) => {
      const viewName = view.name;
      const startDate = new Date(stage.Phases[0][0]);
      const endDate = new Date(stage.Phases[stage.Phases.length - 1][1]);
      let yearMonth = startDate.getFullYear() + '-' + ('0' + (startDate.getMonth() + 1)).slice(-2);
      // Boucle sur les mois compris entre la date de début et la date de fin de chaque phase
      while (yearMonth <= endDate.getFullYear() + '-' + ('0' + (endDate.getMonth() + 1)).slice(-2)) {
        if (!tableData[viewName]) {
          tableData[viewName] = {};
          
        }
        if (!projectdata[viewName]) {
          projectdata[viewName] = {};
        }
        if (!tableData[viewName][yearMonth]) {
          tableData[viewName][yearMonth] = 0;
          
        }
        if (!projectdata[viewName][yearMonth]) {
          projectdata[viewName][yearMonth] = 0;
         
        }
        // Calcule la somme de la charge de chaque profil pour chaque vue pour chaque mois
        Object.values(view.profils).forEach((charge) => {
          tableData[viewName][yearMonth] += charge * 4.33 / 20;
          projectdata[viewName][yearMonth] += charge * 4.33 / 20;
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
  // Add the table data to fteData object with the project name as key
  fteData[project.name] = projectdata;
});

console.log("fte", tableData);
console.log("fte by project ", fteData);

  // Create table element
  const table = document.createElement('table');
  table.classList.add('FTEperproject-table');

  // Loop through each project
  projects.forEach((project) => {
    // Create thead element and add header row to table for project
    const thead = document.createElement('thead');
    const headerRow = thead.insertRow();
    const th = document.createElement('th');
    th.textContent = `FTE-TABLE : ${project.name}`;
    headerRow.appendChild(th);
    for (let year = parseInt(getStart(json).split('-')[0]); year <= parseInt(getEnd(json).split('-')[0]); year++) {
      for (let month = 1; month <= 12; month+=1) {
        const yearMonth = year + '-' + ('0' + month).slice(-2);
        const th = document.createElement('th');
        th.textContent = yearMonth;
        headerRow.appendChild(th);
      }
    }
    table.appendChild(thead);

    // Create tbody element and add data rows to table for project
    const tbody = document.createElement('tbody');
    Object.entries(fteData[project.name]).forEach(([viewName, viewData]) => {
      const row = tbody.insertRow();
      const td1 = document.createElement('td');
      td1.textContent = viewName;
      row.appendChild(td1);
      for (let year = parseInt(getStart(json).split('-')[0]); year <= parseInt(getEnd(json).split('-')[0]); year++) {
        for (let month = 1; month <= 12; month+=1) {
          const yearMonth = year + '-' + ('0' + month).slice(-2);
          const td = document.createElement('td');
          td.textContent = (viewData[yearMonth] || 0).toFixed(2);
          row.appendChild(td);
        }
      }
    });
    table.appendChild(tbody);
    // Create a div element to wrap the table and enable horizontal scrolling
    const tableWrapper = document.createElement('div');
    tableWrapper.style.width = '100%';
    tableWrapper.style.overflowX = 'scroll';
    tableWrapper.appendChild(table);

  });

  // Create button element and set its style
const button2 = document.createElement('button');
button2.textContent = 'Clear';
button2.style.backgroundColor = 'red';
button2.style.color = 'white';
button2.style.padding = '10px';
button2.style.borderRadius = '5px';
button2.style.marginTop = '20px';
button2.style.right = '20px';

button2.id = 'ClearFTEperproject';
table.appendChild(button2);

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
  const CashoutData = {};

  // Boucle sur tous les projets pour calculer les données du tableau
  projects.forEach((project) => {
    const projectdata={};
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
        if (!projectdata[viewName]) projectdata[viewName] = {};
         // Calculate the total cash out for each fiscal year
         const year = parseInt(yearMonth.split('-')[0]);
         const month = parseInt(yearMonth.split('-')[1]);
         const fiscalYear = (month >= 7) ? year + '-' + (year + 1).toString().substr(-2) : (year - 1) + '-' + year.toString().substr(-2);
         if (!tableData[viewName][fiscalYear]) tableData[viewName][fiscalYear] = 0;
         if (!projectdata[viewName][fiscalYear]) projectdata[viewName][fiscalYear] = 0;

         Object.entries(view.profils).forEach(([profil, charge]) => {
           // Get the TJM for each profile and multiply it by the FTE for each month
           const tjm = getProfilValue(json, viewName, profil);
           const fte = charge * 4.33 / 20;
           tableData[viewName][fiscalYear] += tjm * fte;
           projectdata[viewName][fiscalYear] += tjm * fte;

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

  CashoutData[project.name] = projectdata;

});

console.log("cashout", tableData);
console.log("cashout per project", CashoutData);


    // Create table element
    const table = document.createElement('table');
    table.classList.add('cash-out-table');

    // Create table header
    const header = document.createElement('thead');
    const headerRow = header.insertRow();
    const th = document.createElement('th');
      th.textContent = 'Total Cashout';
      headerRow.appendChild(th);
    Object.keys(tableData[Object.keys(tableData)[0]]).forEach((fiscalYear) => {
      const th = document.createElement('th');
      th.textContent = fiscalYear;
      headerRow.appendChild(th);
  });

   table.appendChild(header);   

// Create table body
    const body = document.createElement('tbody');
    Object.entries(tableData).forEach(([viewName, viewData]) => {
    const row = body.insertRow();
    const td1 = document.createElement('td');
    td1.textContent = viewName;
    row.appendChild(td1);
    Object.values(viewData).forEach((cashOut) => {
      const td = document.createElement('td');
      td.textContent = cashOut.toFixed(2);
      row.appendChild(td);

});
});

table.appendChild(body);

// Create a div element to wrap the table and enable horizontal scrolling
const tableWrapper = document.createElement('div');
tableWrapper.style.width = '100%';
tableWrapper.style.overflowX = 'scroll';
tableWrapper.appendChild(table);

// Create button element and set its style
const button = document.createElement('button');
button.textContent = 'Details';
button.style.backgroundColor = 'blue';
button.style.color = 'white';
button.style.padding = '10px';
button.style.borderRadius = '5px';
button.style.marginTop = '20px';
button.style.marginRight = '10px'; // add margin-right
button.id = 'cashoutdetails'
table.appendChild(button);

// Create button element and set its style
const button2 = document.createElement('button');
button2.textContent = 'Clear';
button2.style.backgroundColor = 'red';
button2.style.color = 'white';
button2.style.padding = '10px';
button2.style.borderRadius = '5px';
button2.style.marginTop = '20px';
button2.style.right = '20px';

button2.id = 'Clearcashout';
table.appendChild(button2);


return table.outerHTML;
}

function generateCashoutperproject(json)
{

  let projects = json[1];

  // Crée une table vide pour stocker les données
  const tableData = {};
  const CashoutData = {};

  // Boucle sur tous les projets pour calculer les données du tableau
  projects.forEach((project) => {
    const projectdata={};
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
        if (!projectdata[viewName]) projectdata[viewName] = {};
         // Calculate the total cash out for each fiscal year
         const year = parseInt(yearMonth.split('-')[0]);
         const month = parseInt(yearMonth.split('-')[1]);
         const fiscalYear = (month >= 7) ? year + '-' + (year + 1).toString().substr(-2) : (year - 1) + '-' + year.toString().substr(-2);
         if (!tableData[viewName][fiscalYear]) tableData[viewName][fiscalYear] = 0;
         if (!projectdata[viewName][fiscalYear]) projectdata[viewName][fiscalYear] = 0;

         Object.entries(view.profils).forEach(([profil, charge]) => {
           // Get the TJM for each profile and multiply it by the FTE for each month
           const tjm = getProfilValue(json, viewName, profil);
           const fte = charge * 4.33 / 20;
           tableData[viewName][fiscalYear] += tjm * fte;
           projectdata[viewName][fiscalYear] += tjm * fte;

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

  CashoutData[project.name] = projectdata;

});

console.log("cashout", tableData);
console.log("kjlkcashout per project", CashoutData);
  
  // Create table element
  const table = document.createElement('table');
  table.classList.add('cashoutperproject-table');

  // Loop through each project
  projects.forEach((project) => {
   

   // Create table header
   const header = document.createElement('thead');
   const headerRow = header.insertRow();
   const th = document.createElement('th');
  th.textContent = `CashOut for : ${project.name}`;
  headerRow.appendChild(th);

   Object.keys(tableData[Object.keys(tableData)[0]]).forEach((fiscalYear) => {
     const th = document.createElement('th');
     th.textContent = fiscalYear;
     headerRow.appendChild(th);
 });

  table.appendChild(header); 

  const body = document.createElement('tbody');
  Object.entries(CashoutData[project.name]).forEach(([viewName, viewData]) => {
  const row = body.insertRow();
  const td1 = document.createElement('td');
  td1.textContent = viewName;
  row.appendChild(td1);
  Object.values(viewData).forEach((cashOut) => {
    const td = document.createElement('td');
    td.textContent = cashOut.toFixed(2);
    row.appendChild(td);

});
});

   table.appendChild(body);

    // Create a div element to wrap the table and enable horizontal scrolling
    const tableWrapper = document.createElement('div');
    tableWrapper.style.width = '100%';
    tableWrapper.style.overflowX = 'scroll';
    tableWrapper.appendChild(table);

  });

   // Create button element and set its style
const button2 = document.createElement('button');
button2.textContent = 'Clear';
button2.style.backgroundColor = 'red';
button2.style.color = 'white';
button2.style.padding = '10px';
button2.style.borderRadius = '5px';
button2.style.marginTop = '20px';
button2.style.right = '20px';

button2.id = 'Clearcashoutperproject';
table.appendChild(button2);

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
 

      document.getElementById("details").addEventListener("click", function() {
        let tableHTML = generateFteperproject(json);
        let table2 = document.createElement('table');
        table2.classList.add("FTEperproject-table");
        table2.innerHTML = tableHTML;
        document.body.appendChild(table2);
        document.getElementById("ClearFTEperproject").addEventListener("click", function() {
          if(table2)
          {
           
            table2.remove();
          }
          });
          document.getElementById("ClearFTE").addEventListener("click", function() {
            if(table)
            {
             
              table.remove();
            }
            });
  

        

        });

        document.getElementById("ClearFTE").addEventListener("click", function() {
          if(table)
          {
           
            table.remove();
          }
          });

         
      
 
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
      document.getElementById("cashoutdetails").addEventListener("click", function() {
        let tableHTML = generateCashoutperproject(json);
        let table2 = document.createElement('table');
        table2.classList.add("cashoutperproject-table");
        table2.innerHTML = tableHTML;
        document.body.appendChild(table2);
        document.getElementById("Clearcashoutperproject").addEventListener("click", function() {
          if(table2)
          {
           
            table2.remove();
          }
          });
          document.getElementById("Clearcashout").addEventListener("click", function() {
            if(table)
            {
             
              table.remove();
            }
            });
        });

        document.getElementById("Clearcashout").addEventListener("click", function() {
          if(table)
          {
           
            table.remove();
          }
          });

      
 
    }
}

const input = document.getElementById("file");
let reader;
let json;


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
  
  //json = JSON.parse(reader.result);
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
             jsonCopy[1][index].end_date = date.value;
      
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
             jsonCopy[1][index].name = name.value;
      
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







