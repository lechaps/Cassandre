function convertData(json) {
  let output = [];
  let index = 1;
  let cpt=0;
  let order = 1 ;
  let location =[]; //a table where I save the (index, stage, phase)
  let i=0,j=0,k=0;


  json[1].forEach((project) => {

      output.push({id: "Task" + order.toString() ,
                  name: project.name,
                  start: getStartDate(json, cpt),
                  end: getEndDate(json, cpt),
                  progress: 100,
                  dependencies: "",
                  custom_class: 'main-task',
                  location : [i ,j, k]
                  })
      index = order;
      order+=1;
              

      project.stages.forEach((stage) => {
          stage.Phases.forEach((phase) => {
            if (phase[0] == getStartDate(json, cpt))
            {
              output.push({id: "Stage " + order.toString() ,
                      name: stage.name,
                      start: phase[0],
                      end: phase[1],
                      progress: 100,
                      dependencies : "",
                      location : [i ,j, k]
                  })
                  if (output[index-1].dependencies == "")
                  {
                      output[index-1].dependencies = "Stage " + order.toString();
                      output[order-1]['custom_class'] = 'special';

                  }

                  else{
                    output[order-1].dependencies = "Task" + index.toString();

                  }
            } 

            else
            {
              output.push({id: "Stage " + order.toString() ,
                      name: stage.name,
                      start: phase[0],
                      end: phase[1],
                      progress: 100,
                      dependencies : "Task" + index.toString(),
                      location : [i ,j, k]
                  })
            }

            order+=1; 

            //index of the phase in the json file
            k+=1;

          });          
        
        //index of the stage in the json file
       j+=1;
       k=0;

    });

  cpt+=1;

  //index of the project in the json file
  i+=1;
  j=0;

  }); 


  return output;
}


function convertDate(date)
{
let resultMonth = (date.getMonth() + 1).toString().padStart(2, '0');
let resultYear = date.getFullYear().toString();
return resultYear + '-' + resultMonth 

}

document.getElementById("gantt-button").addEventListener("click", function() {
  //var ganttContainer = document.getElementById("gantt");
  //ganttContainer.innerHTML = ""; // clear any previous content

  let gantt = document.querySelector('#gantt')
  let chartControls = document.querySelector('.chart-controls');

  if (gantt)
  {
    gantt.remove()
    chartControls.remove()
  }

  else{

    //on cree le div pour le diagramme de gantt

    // create a new div element
    var div = document.createElement('div');
    // set the div's id attribute
    div.setAttribute('id', 'gantt-container');

    // create a new svg element
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // set the svg's id attribute
    svg.setAttribute('id', 'gantt');

    // append the svg element to the div element
    div.appendChild(svg);

    // add the div to the page
    document.body.appendChild(div);


    //on cree le <div de timescale

    // Créer l'élément div
    let chartControlsDiv = document.createElement("div");

    // Ajouter la classe "chart-controls" à l'élément div
    chartControlsDiv.classList.add("chart-controls");


    // Créer l'élément p pour le texte
    let p = document.createElement("p");
    p.textContent = "Change Chart Timescale";

    // Créer l'élément div pour les boutons
    let buttonContDiv = document.createElement("div");
    buttonContDiv.classList.add("button-cont");

    // Créer le bouton "Year"
    let yearBtn = document.createElement("button");
    yearBtn.id = "year-btn";
    yearBtn.textContent = "Year";

    // Créer le bouton "Month"
    let monthBtn = document.createElement("button");
    monthBtn.id = "month-btn";
    monthBtn.textContent = "Month";

  // Créer le bouton "Day"
    let dayBtn = document.createElement("button");
    dayBtn.id = "day-btn";
    dayBtn.textContent = "Day";

// Ajouter les boutons à l'élément div "button-cont"
    buttonContDiv.appendChild(yearBtn);
    buttonContDiv.appendChild(monthBtn);
    buttonContDiv.appendChild(dayBtn);

// Ajouter les éléments "p" et "button-cont" à l'élément "chartControlsDiv"
  chartControlsDiv.appendChild(p);
  chartControlsDiv.appendChild(buttonContDiv);

  // add the div to the page
  document.body.appendChild(chartControlsDiv);



  

  let tasks = convertData(json);

  gantt = new Gantt("#gantt", tasks, {
    header_height: 50,
    column_width: 10,
    step: 24,
    view_mode: 'Month',
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
document.querySelector(".chart-controls #day-btn").addEventListener("click", () => {
  gantt.change_view_mode("Day");
})
  }

   
});
