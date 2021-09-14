let addBtn = document.querySelector(".add");
let body = document.querySelector("body");
let grid = document.querySelector(".grid");

let colors = [ "pink", "blue", "green", "black"];
let deleteBtn = document.querySelector(".delete");
let deleteMode = false;


if( localStorage.getItem("Alltickets")==undefined ){
    let allTickets = {};

    allTickets = JSON.stringify(allTickets);

    localStorage.setItem("AllTickets",allTickets);
}

loadTasks();

deleteBtn.addEventListener("click",function(e){

    if(e.currentTarget.classList.contains("mode-selected")){
        e.currentTarget.classList.remove("mode-selected");
        deleteMode = false;
    }
    else{
        e.currentTarget.classList.add("mode-selected");
        deleteMode = true;
    }
})

addBtn.addEventListener("click",function(){

    // to close the deleted mode when clicking on add button
    deleteBtn.classList.remove("mode-selected");
    deleteMode = false;

    let preModal = document.querySelector(".modal");
    // if the modal is already there on the screen , then it wont have any null value
    // hence even if we press add button nothing will happen
    if( preModal!=null ){
        return;
    }
    let div = document.createElement("div");// a div is created

    div.classList.add("modal"); // a class modal has been assigned to div
    // <div class = "modal"></div>
    
    // the div that was created has been given these HTML elements
    div.innerHTML = `<div class = "modal">
    <div class = "task-section">
    <div class = "task-inner-container" contenteditable="true"></div>
    </div>
    <div class = "modal-priority-section">
    <div class = "priority-inner-container">
    <div class = "modal-priority pink"></div>
    <div class = "modal-priority blue"></div>
    <div class = "modal-priority green"></div>
    <div class = "modal-priority black"></div>
    </div>
    </div>`
    
    // ticketcolor variable initialized
    let ticketColor = "black";
    // to select priority color buttons
    let allModalPriority = div.querySelectorAll(".modal-priority");
    
    for( let i = 0; i<allModalPriority.length; i++ ){
        allModalPriority[i].addEventListener("click",function(e){
            for( let j = 0; j<allModalPriority.length; j++ ){
                // to deselect any color that was previously selected
                allModalPriority[j].classList.remove("selected");  
            }
            e.currentTarget.classList.add("selected");
            // to store the color that was selected
            ticketColor = e.currentTarget.classList[1];
        });
    }

    let taskInnContainer = div.querySelector(".task-inner-container");
    // if we press enter after writing something in the modal
    taskInnContainer.addEventListener("keydown",function(e){

        if( e.key=="Enter" ){
            
            let id = uid();
            let task = e.currentTarget.innerText;

            // step1 => whatever data is there in localstorage , get it and store it
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            // step2 => update the data which is present in local storage
            let ticketObj = {
                color: ticketColor,
                taskValue : task,
            };

            allTickets[id] = ticketObj;

            // step3 => again store the data in the local storage after addition
            localStorage.setItem("AllTickets",JSON.stringify(allTickets));

            // a div ticket is being created and the class has been assigned
            let ticketDiv = document.createElement("div");
            ticketDiv.classList.add("ticket");

            // to call a unique id for each ticket that is being generated , here uid is defined in the previous
            // script defined above this one

            // the innerhtml is also being defined
            ticketDiv.innerHTML = `<div class = "ticket-color ${ticketColor}"></div>
            <div class = "ticket-id">
                #${id}
            </div>
            <div class = "actual-task" contenteditable="true">
            ${task}</div>`;

            let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
            ticketColorDiv.addEventListener("click",function(e){
                let curcolor = e.currentTarget.classList[1];
                // All Tickets lana local storage se
                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                let index = -1;
                for( let i = 0; i<colors.length; i++ ){
                    if( colors[i]==curcolor ){
                        index = i;
                    }
                }
                index++;
                index=index%4;

                let newColor = colors[index];
                // update krna changes
                allTickets[id]["color"] = newColor;
                ticketColorDiv.classList.remove(curcolor);
                ticketColorDiv.classList.add(newColor);
                // wapis local storage main save krna
                localStorage.setItem("AllTickets",JSON.stringify(allTickets));

            });

            // editing the task and saving that change
            let actualtask = ticketDiv.querySelector(".actual-task");
            // event listener if we are changing the input i.e. the task inside the ticket
            actualtask.addEventListener("input",function(e){
                let newTask = e.currentTarget.innerText;

                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                allTickets[id].taskValue = newTask;

                localStorage.setItem("AllTickets",JSON.stringify(allTickets));
            })

            // to remove the ticket which is clicked on, when the delete mode is on
            // also to remove its data from the local storage present in the browser    
            ticketDiv.addEventListener("click",function(e){
                if(deleteMode){
                    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                    delete allTickets[id];

                    localStorage.setItem("AllTickets",JSON.stringify(allTickets));
                    e.currentTarget.remove();
                }
            })

            // after making of the ticket , we make it appear on the grid
            grid.append(ticketDiv);

            // and we remove the modal after making the ticket
            div.remove();
        }
        else if( e.key==="Escape" ){
            div.remove();
        }
    });
    
    body.append(div);
});


function loadTasks(color){

    // to delete all the tickets which are already present on the UI
    let ticketsOnUi = document.querySelectorAll(".ticket");

    for( let i = 0; i<ticketsOnUi.length; i++ ){
        ticketsOnUi[i].remove();
    }

    // 1- fetch all Tickets
    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

    // 2- Create UI for each Ticket
    for( x in allTickets){
        let curTicketId = x;
        let singleTickitObj = allTickets[x];

        if( color && color!= singleTickitObj.color ) continue;

        let ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");
        ticketDiv.innerHTML = `<div class = "ticket-color ${singleTickitObj.color}"></div>
        <div class = "ticket-id">
            #${curTicketId}
        </div>
        <div class = "actual-task" contenteditable="true">
        ${singleTickitObj.taskValue}</div>`;

    // 3- Adding required EventListeners
        let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
        ticketColorDiv.addEventListener("click",function(e){
            let curcolor = e.currentTarget.classList[1];
            // All Tickets lana local storage se
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            let index = -1;
            for( let i = 0; i<colors.length; i++ ){
                if( colors[i]==curcolor ){
                    index = i;
                }
            }
            index++;
            index=index%4;

            let newColor = colors[index];
            // update krna changes
            allTickets[curTicketId]["color"] = newColor;
            ticketColorDiv.classList.remove(curcolor);
            ticketColorDiv.classList.add(newColor);
            // wapis local storage main save krna
            localStorage.setItem("AllTickets",JSON.stringify(allTickets));

        });

        // editing the task and saving that change
        let actualtask = ticketDiv.querySelector(".actual-task");
        // event listener if we are changing the input i.e. the task inside the ticket
        actualtask.addEventListener("input",function(e){
            let newTask = e.currentTarget.innerText;

            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            allTickets[curTicketId].taskValue = newTask;

            localStorage.setItem("AllTickets",JSON.stringify(allTickets));
        })

        ticketDiv.addEventListener("click",function(e){
            if(deleteMode){
                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                delete allTickets[curTicketId];

                localStorage.setItem("AllTickets",JSON.stringify(allTickets));
                e.currentTarget.remove();
            }
        })

        // after making of the ticket , we make it appear on the grid
        grid.append(ticketDiv);
    }


}