window.addEventListener("load", init);

let notesList = [];
let noteColors = [
    "#e83b35","#ec407a","#ff9801",
    "#673bb7","#3f51b5","#5d6cc1",
    "#1a77d4","#07aaf5","#27a79a",
    "#07cb79","#8dc24c","#fec107",
    ];
let h1Color = "#efefef";
let pColor = "#efefef"
let iconColor = "#efefef";
let mainColor = "#4169E1";
let offColor = "#3f4046";
let borderColor = '#27292e';

let notesOpen = false;
let themeType = false; //false - dark, true - light

function init(){

    //icons on left
    let icons = document.getElementsByClassName('iIcon');
    for(let i = 0; i < icons.length; i++)
    {
        icons[i].addEventListener("mouseover",
        () => {
            let icon = icons[i];
            icon.style.background = mainColor;
            icon.style.color = iconColor;
        });
        icons[i].addEventListener("mouseout",
        () => {
            let icon = icons[i];
            icon.style.background = offColor;
            icon.style.color = mainColor;
        });
    }
    //adding note
    document.getElementById('addNote').addEventListener("click", addNewNote);
    //show note list
    document.getElementById("showNotes").addEventListener("click",
    () => {
        if(notesOpen)
        {
            document.getElementById('notesListPanel').style.left = "-350px";
            notesOpen = false;
        }
        else
        {   
            document.getElementById('notesListPanel').style.left = "0px";
            notesOpen = true;
        }      
    });
    //add colors button in note
    let noteColorButtons = document.getElementsByClassName('noteColorButton');
    for(let i = 0; i < noteColorButtons.length; i++)
    {
        //set color title 
        noteColorButtons[i].style.background = noteColors[i];
        //change color title and button
        noteColorButtons[i].addEventListener("click",
        () => {
            document.getElementById('noteTitle').style.color = noteColorButtons[i].style.backgroundColor;
            document.getElementById('noteSave').style.background = noteColorButtons[i].style.backgroundColor;
        });
    }
    //save note or not
    let highlightIcon = document.getElementById("noteHighlight");
    highlightIcon.addEventListener("click", 
    () => {
        if(highlightIcon.innerHTML == "star")
            highlightIcon.innerHTML = "star_border";
        else
            highlightIcon.innerHTML = "star";
    });
    //change theme
    document.getElementById("themeChanger").addEventListener("click", changeTheme);
    //loading existing notes
    loadNotes(clearAllNotes);

}
//obiekt notatki
function Note(JSONString){

    //string to JSON obj
    let obj = JSON.parse(JSONString);
    //assign value frome JSON
    this.id = obj.id;
    this.header = obj.header;
    this.content = obj.content;
    this.date = obj.date;
    this.color = obj.color;
    this.highlighted = obj.highlighted;
}
//loading all notes from localStorage
function loadNotes(_callback){

    //clean notes list
    notesList = [];
    //w8 for cleaning
    _callback();
    for(let a in localStorage)
    {
        if(localStorage.hasOwnProperty(a))
        {
           let JSONString = localStorage.getItem(a);
           let record = new Note(JSONString);
           notesList.push(record);
        }  
    }

    showNotes(sortNotes);   
}
//sort by date, next id, to showing last notes on top
function sortNotes(){
    notesList.sort(function(a,b)
    {
        if(a.date < b.date)
            return 1;
        if(a.date > b.date)
            return -1;
        if(a.date == b.date)
        {
            if(a.id < b.id)
                return 1;
            if(a.id > b.id)
                return -1;
        }
        return 0;
    })
    console.log("posortowane");
}
// show notes divs on list
function showNotes(_callback){
    // w8 for diffrent func to end (main sorting)
    _callback();
    for(let i=0; i < notesList.length; i++)
    {
        let noteDiv = document.createElement("div");
        noteDiv.className = "note";
        let noteHeader = document.createElement("h1");
        noteHeader.className = "noteHeader";
        let noteDate = document.createElement("p");
        noteDate.className = "noteDate";
        let noteHighlightIcon = document.createElement("i");
        noteHighlightIcon.id = "noteHighlightIcon";
        noteHighlightIcon.className = "material-icons";
        noteHighlightIcon.innerHTML = "star";

        noteHeader.innerHTML = notesList[i].header;
        noteHeader.style.color = h1Color;
        noteDate.innerHTML = notesList[i].date;
        noteDate.style.color = pColor;
        let color = notesList[i].color;
        let highlighted = notesList[i].highlighted;

        noteDiv.addEventListener("mouseover",
        () => noteDiv.style.background = color);
        noteDiv.addEventListener("mouseout",
        () => noteDiv.style.background = offColor);
        noteDiv.addEventListener("click",
        () => openNote(notesList[i]));


        noteDiv.appendChild(noteHeader);
        noteDiv.appendChild(noteDate);
        noteDiv.style.borderBottom = "1px solid "+borderColor;
        //if note is highlited, add to right div
        if(highlighted)
        {
            noteDiv.appendChild(noteHighlightIcon)
            document.getElementById("highlightedNotes").appendChild(noteDiv);
        }
        else
            document.getElementById("notesList").appendChild(noteDiv);
    }

    
}
//open note and showing in the middle
function openNote(note){
    
    let noteTitle = document.getElementById("noteTitle");
    noteTitle.value = note.header;
    noteTitle.style.color = note.color;
    let noteContent = document.getElementById("noteContent");
    noteContent.value = note.content;
    document.getElementById("noteInside").style.display = "block";
    let highlighted = note.highlighted;
    if(highlighted)
    {
        document.getElementById('noteHighlight').innerHTML = "star";
    }
    else
        document.getElementById('noteHighlight').innerHTML = "star_border";
    
    let noteSave = document.getElementById('noteSave');
    noteSave.remove();
    //div clone to prevent overwriting listeners
    let noteSaveClone = document.createElement('div');
    noteSaveClone.id = 'noteSave';
    noteSaveClone.innerHTML = "SAVE";
    noteSaveClone.style.background = note.color;
    noteSaveClone.addEventListener("click",
    () => editExistingNote(note)); 
    document.getElementById('noteInner').appendChild(noteSaveClone);
}
function addNewNote(){

    let noteDiv = document.getElementById("noteInside");
    noteDiv.style.display = "block";
    //cleaning values
    let noteTitle = document.getElementById("noteTitle");
    noteTitle.style.color = "red";
    noteTitle.value = "";
    let noteContentDiv = document.getElementById("noteContent");
    noteContentDiv.value = "";
    let noteHighlightDiv = document.getElementById("noteHighlight");
    noteHighlightDiv.innerHTML = "star_border";
    let noteHighlight;
    if(noteHighlightDiv.innerHTML == "star")
        noteHighlight = true;
    else
        noteHighlight = false;

    let noteSave = document.getElementById('noteSave');
    noteSave.remove();
    //new element, prevent overwrite listeners
    let noteSaveClone = document.createElement('div');
    noteSaveClone.id = 'noteSave';
    noteSaveClone.innerHTML = "ADD";
    document.getElementById('noteInner').appendChild(noteSaveClone);

    noteSaveClone.addEventListener("click",
    () =>
    {
        //creating new note
        let noteID = countNotes();
        ++noteID;
        let noteContent = noteContentDiv.value;
        noteContent = noteContent.split('\u000A').join("\\n");
        let noteDate = returnCurrentDate();
        let noteString = 
        '{ "id":'+noteID+', "header":"'+noteTitle.value+'", "content":"'+noteContent+'", "date":"'+noteDate+'", "color":"'+noteTitle.style.color+'", "highlighted":'+noteHighlight+'}';
        localStorage.setItem(noteID, noteString);
        loadNotes(clearAllNotes);
    });

    
}
function editExistingNote(note){
    let noteID = note.id;
    let noteHeader = document.getElementById('noteTitle').value;
    let noteContent = document.getElementById('noteContent').value;
    //replace all ENTERS to \n 
    noteContent = noteContent.split('\u000A').join("\\n");
    let noteDate = returnCurrentDate();
    let noteColor = document.getElementById('noteTitle').style.color;
    let noteHighlighted;
    let type = document.getElementById('noteHighlight').innerHTML;
    if(type == "star")
    {
        noteHighlighted = true;
    }
    else
        noteHighlighted = false;

    let noteString =
    '{ "id":'+noteID+', "header":"'+noteHeader+'", "content":"'+noteContent+'", "date":"'+noteDate+'", "color":"'+noteColor+'", "highlighted":'+noteHighlighted+'}';
    localStorage.setItem(noteID, noteString);
    loadNotes(clearAllNotes);
    alert("Saved sucesfully.");
    

}
function clearAllNotes(){

    console.log("usuwanie");
    let notesDivs = document.getElementsByClassName('note');
    // after delete last, each next div get [0] spot, so calculate amount of loops
    while(notesDivs.length > 0)
        notesDivs[0].remove();
    console.log("usunieto");

}
function changeTheme(){

    let color1;
    let color2;
    let color3;
    if(themeType)
    {
        color1 = '#27292e';
        color2 = '#35363b';
        color3 = '#3f4046';
        offColor = '#3f4046';
        borderColor = '#27292e';
        h1Color = "#efefef";
        pColor = "#efefef";
        themeType = false;
    }
    else
    {  
        color1 = '#ffffff';
        color2 = '#efefef';
        color3 = '#f8f8f8';
        offColor = '#f8f8f8';
        borderColor = '#ececec';
        h1Color = "#3d4451";
        pColor = "#3d4451";
        themeType = true;
    }
    let icons = document.getElementsByClassName('iIcon');
    for(let i = 0; i < icons.length; i++)
    {
        icons[i].style.background = offColor;
    }
    let notes = document.getElementsByClassName('note');
    for(let i = 0; i < notes.length; i++)
    {
        notes[i].style.transition = 'none';
        notes[i].style.background = offColor;
        notes[i].style.borderColor = borderColor;
    }
    document.body.style.background = color1;
    document.getElementById('navPanel').style.background = color2;
    document.getElementById('notesHeader').style.borderColor = borderColor;
    document.getElementById('navPanel').style.borderColor = borderColor;
    let notesListPanel = document.getElementById('notesListPanel');
    notesListPanel.style.background = color3;
    notesListPanel.style.borderColor = borderColor;
    let p = document.getElementsByTagName('p');
    for(let i = 0; i < p.length; i++)
    {
        p[i].style.color = pColor;
    }
    let h1 = document.getElementsByTagName('h1');
    for(let i = 0; i < h1.length; i++)
    {
        h1[i].style.color = h1Color;
    }
    document.getElementById('noteContent').style.color = pColor;

}
function countNotes(){

    let count = 0;
    for(let a in localStorage)
    {
        if(localStorage.hasOwnProperty(a))
        {
            count++;
        }
    }
    return count;
}
function returnCurrentDate(){

    let today = new Date();
    let day = today.getDate();
    let month = parseInt(today.getMonth()+1)
    let hour = today.getHours();
    let minutes = today.getMinutes();
    if(day < 10)
        day = ""+0+day;
    if(month < 10) 
        month = ""+0+month;
    if(hour < 10)
        hour = ""+0+hour;
    if(minutes < 10)
        minutes = ""+0+minutes;
    let date = day+"-"+month+"-"+today.getFullYear()+", "+hour+":"+minutes;
    return date;
}