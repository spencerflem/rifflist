/*
TODO: keyboard navigation, onsumbit, look like real element with dot until confirmed sumbitted, way to end inline submit?, talk to real db
			idea: insertboxes always exist, just hidden normally, same css trickery, onclick out disappear! expand to fit for textboxes
			BUG THAT DISSAPEARS WHEN INSPECTED (or resized)! INSERT BELOW!
			idea - make insert above below list items (like before?)
			REMOVE ALL FIDDLEY NUMBERS FROM CSS - SIMPLIFY CSS WHERE POSSIBLE
SHOULD COMMENTS BE CSS TRICKS OR JS?
WHAT ABOUT COMMENT INSERTS
WAY TO UPDATE PAGE ON NEW INFO (should be good ideomatic way for this)


TODO BUGS:

flexbox to fix html spacing issues?
flexbox in general?

mobile view is still broken
hide logo when you click into textbox
one possible fix - cut off comments once they get to far and have link to thread directly redditesque
submitting ... until confirmed
id for comments so they can be directly linled

*/


document.addEventListener("DOMContentLoaded", function(e) {
    insertAllIntoList();
    createHeaderPicker();
});

var incrementingId = 0;

function insertAllIntoList() {
    collapsableItems = document.getElementById("top").getElementsByTagName("LI");
    for (var i=0; i < collapsableItems.length; i++) {
        var item = collapsableItems[i];
        insertCollapser(item);
    }
}

//TODO: SKIP INSERTS WHEN SEARCHING!!!

function insertCollapser(item) {
    var id = "id" + incrementingId++;
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = id;
    var minimize = document.createElement("label");
    minimize.htmlFor = id;
    minimize.className = "minimize";
    minimize.innerHTML = "[-]";
    var maximize = document.createElement("label");
    maximize.htmlFor = id;
    maximize.className = "maximize";
    maximize.innerHTML = "[+]";
    item.insertBefore(maximize, item.firstChild); //lowest
    item.insertBefore(minimize, item.firstChild);
    item.insertBefore(checkbox, item.firstChild); //highest
    item.getElementsByClassName("content")[0].tabIndex = 0;
}

//the header picker (semi magic)
function createHeaderPicker() {
    var button = document.getElementById("header-submit");
    button.onclick = function() { toggle('category-picker', 'flex'); };
    button.value = "+";
    button.type = "button";
    button.id = "header-button";
    var submit = document.getElementById("unused-button");
    submit.id = "header-submit";
    submit.onclick = function() { submitToList() };
    inputs = setupManyInputs();
    document.getElementById("header-input").focus();
}

function setupManyInputs() {
    addSelectItem(document.getElementById("top"), 0);
}

function clearManyInputs() {
    var manyInputs = document.getElementById("many-inputs");
    while(manyInputs.firstChild) {
        manyInputs.removeChild(manyInputs.firstChild);
    }
}

function updateManyInputs(changedNumber) {
    var noBlanks = true;
    var selectedIndexes = [];
    var manyInputs = document.getElementById("many-inputs");
    var selects = manyInputs.getElementsByTagName("select");
    for (var i = 0; i <= changedNumber; i++) {
        select = selects[i];
        index = select.selectedIndex;
        if (index === 0) {
            noBlanks = false;
        }
        else if (noBlanks) {
            selectedIndexes.push(index);
        }
    }
    clearManyInputs();
    var lastUl = document.getElementById("top");
    endOfTheLine = false;
    for (var j=0; j < selectedIndexes.length; j++) {
        index = selectedIndexes[j];
        addSelectItem(lastUl, j, index);
        if (lastUl.children.item(index-1).getElementsByTagName("UL").length > 0) {
            lastUl = lastUl.children.item(index-1).getElementsByTagName("UL")[0];
        }
        else {
            endOfTheLine = true;
        }
    }
    if(!endOfTheLine) {
        addSelectItem(lastUl, selectedIndexes.length);
    }
    manyInputs.getElementsByTagName("select")[changedNumber].focus();
}

function addSelectItem(ul, index, selectedIndex = -1) {
    var select = document.createElement("select");
    var blank = document.createElement("option");
    blank.selected = true;
    select.appendChild(blank);
    var lis = ul.children;
    for(var i=0; i < lis.length; i++) {
        if(lis[i].getElementsByClassName("content")[0].getElementsByClassName("inlineInsert").length === 0) {
            var liText = lis[i].getElementsByClassName("content")[0].childNodes[0].nodeValue;
            var option = document.createElement("option");
            option.innerHTML = liText;
            select.appendChild(option);
        }
    }
    if (selectedIndex >= 0) {
        select.selectedIndex = selectedIndex;
    }
    if(select.options.length > 1) {
        select.onchange = function(j) { return function() { updateManyInputs(j); }; }(index); //MAGIC! look into how clojures work
        document.getElementById("many-inputs").appendChild(select);
    }
}

function toggle(id, display) {
    var element = document.getElementById(id);
    var main = document.getElementById("main");
    var button = document.getElementById("header-button");
    if(element.style.display === "none" || element.style.display === "") {
        element.style.display = display;
        main.style.marginTop = "7.1rem";
        button.value = "-";
    }
    else {
        element.style.display = "none";
        main.style.marginTop = "5rem";
        button.value = "+";
    }
}

//The insert inside UI
targetDiv = null;

function resetTargetDiv() {
    if(targetDiv !== null) {
        targetDiv.className = "content";
        if(document.getElementById("inserts") !== null) {
            targetDiv.removeChild(document.getElementById("inserts"));
        }
        targetDiv = null;
    }
}

function insertBelowLi() {
    var insertLi = createInsertLi();
    var commentLi = document.getElementById("insertBelow").parentNode.parentNode.parentNode;
    var insertedLi = commentLi.parentNode.insertBefore(insertLi, commentLi.nextSibling);
    insertCollapser(insertedLi);
    insertedLi.getElementsByTagName("input")[1].focus();
}

function insertUnderLi() {
    var insertLi = createInsertLi();
    var commentLi = document.getElementById("insertUnder").parentNode.parentNode.parentNode;
    ul = commentLi.getElementsByTagName("UL");
    var insertedLi = null;
    if(ul.length) {
        insertedLi = ul[0].insertBefore(insertLi, ul[0].firstChild);
    }
    else {
        var newUl = nextUl(commentLi.parentNode.className);
        commentLi.appendChild(newUl);
        var insertedLi = newUl.appendChild(insertLi)
    }
    insertCollapser(insertedLi);
    insertedLi.getElementsByTagName("input")[1].focus();
}

function setupContent(div) {
    div.className = "selectedContent";
    var inserts = document.createElement("div");
    inserts.id = "inserts";
    if(div.children.length > 0) {
        var cancel = document.createElement("input");
        cancel.type = "button";
        cancel.onclick = function() {
            var li = this.parentNode.parentNode.parentNode;
            var ul = li.parentNode;
            ul.removeChild(li);
            if(ul.children.length === 0) {
                ul.parentNode.removeChild(ul);
            }
        }
        cancel.value = "cancel";
        inserts.appendChild(cancel);
    }
    else {
        var insertBelow = document.createElement("input");
        insertBelow.type = "text";
        insertBelow.id = "insertBelow";
        insertBelow.onkeydown = function(event) {
            if(event.keyCode !== 9) {
                insertBelowLi();
                resetTargetDiv();
            }
        }
        var insertUnder = document.createElement("input");
        insertUnder.type = "text";
        insertUnder.id = "insertUnder";
        insertUnder.onkeydown = function(event) {
            if(event.keyCode !== 9) {
                insertUnderLi();
                resetTargetDiv();
            }
        }
        inserts.appendChild(document.createTextNode("↓"));
        inserts.appendChild(insertBelow);
        inserts.appendChild(document.createTextNode("↳"));
        inserts.appendChild(insertUnder);
    }
    div.appendChild(inserts);
}

document.onclick = function(event) {
    if(event.target.className === "content" && !event.target.parentNode.firstChild.checked) {
        resetTargetDiv();
        targetDiv = event.target;
        setupContent(targetDiv);
    }
    else if(event.target.className === "selectedContent" || event.target.id === "inserts") {
        //do nothing
    }
    else {
        if(event.target.id === "insertBelow") {
            insertBelowLi();
        }
        else if(event.target.id === "insertUnder") {
            insertUnderLi();
        }
        resetTargetDiv();
    }
};

function createInsertLi() {
    var li = document.createElement("li");
    var content = document.createElement("div");
    content.className = "content";
    var textInput = document.createElement("input");
    textInput.type = "text";
    textInput.className = "inlineInsert";
    var submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "post";
    submit.onclick = function() { textboxToComment(content); };
    content.appendChild(textInput);
    content.appendChild(submit);
    li.appendChild(content);
    return li;
}

function nextUl(className) {
    console.log(className);
    var newUl = document.createElement("ul");
    if (className === "top") {
        newUl.className = "category";
    }
    else if (className === "category") {
        newUl.className = "subcategory";
    }
    else if (className === "subcategory") {
        newUl.className = "idea";
    }
    else if (className === "idea") {
        newUl.className = "comment";
    }
    else {
        newUl.className = "comment";
    }
    return newUl;
}

function textboxToComment(div) {
    if(div.getElementsByTagName("input")[0].value !== "") {
        div.innerHTML = div.getElementsByTagName("input")[0].value;
    }
    //TODO: VERY IMPORTANT!
    //EDIT MANY INPUTS, BUT LEAVE SELECTION IN SAME PLACE
    //essentially: add option into list, and increment selected if its inserted before
}

function submitToList() {
    if(document.getElementById("header-input").value !== "") {
        var selects = document.getElementsByTagName("select");
        var selectIndexes = [];
        for (var i=0; i < selects.length; i++) {
            var index = selects[i].selectedIndex;
            if(index > 0) {
                selectIndexes.push(index - 1);
            }
        }
        console.log(selectIndexes);
        var ul = document.getElementById("top");
        for (var j=0; j < selectIndexes.length; j++) {
            index = selectIndexes[j];
            //TODO: VERY IMPORTANT
            //MUST EXCLUDE THE INLINEINSERT LIS
            if(ul.children.item(index).getElementsByTagName("UL").length > 0) {
                ul = ul.children.item(index).getElementsByTagName("UL")[0];
            }
            else {
                ul = ul.children.item(index).appendChild(nextUl(ul.className));
            }
        }
        console.log(ul);
        li = document.createElement("li");
        content = document.createElement("div")
        content.className = "content";
        content.innerHTML = document.getElementById("header-input").value;
        li.appendChild(content);
        var insertedLi = ul.appendChild(li);
        insertCollapser(insertedLi);
        
        clearManyInputs();
        setupManyInputs();
        if(document.getElementById("header-button").value === "-") {
            document.getElementById("header-button").click();
        }
        document.getElementById("header-input").value = "";
        document.getElementById("header-input").focus();
    }
}

document.onkeydown = function(e){
   if(e.keyCode == 13){
       console.log(document.activeElement.tagName);
       if(document.activeElement.className === "inlineInsert") {
           console.log(document.activeElement.parentNode.getElementsByTagName("input")[1]);
           document.activeElement.parentNode.getElementsByTagName("input")[1].click();
       }
       else if(document.activeElement.id === "header-input") {
           if(document.getElementById("header-button").value === "+") {
               document.getElementById("header-button").focus().click(); //gives an error
               //or focus on the submit?
           }
       }
       else if(document.activeElement.tagName === "SELECT") {
           document.getElementById("header-submit").click();
       }
       else if(document.activeElement.className === "content") {
            resetTargetDiv();
            targetDiv = document.activeElement;
            setupContent(targetDiv);
       }
   }
};