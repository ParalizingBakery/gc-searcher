//May change when Google Classroom updates UI
const roomListSelector = ".JwPp0e"
const roomNodeSelector = "li.gHz6xd.Aopndd.rZXyy"
const roomNameSelector = "div.YVvGBb.z3vRcc-ZoZQ1"
const roomTeacherSelector = "div.Vx8Sxd.YVvGBb.jJIbcc"

//Classes and Id for elements in html that is queried in code
const searchappClass = "searchapp"
const inputbarId = "searchbar"

//if class or id of element is changed, also change selector in injectsearch()
//disabled button in form to prevent submitting form when pressing enter
const html = `
<div class="${searchappClass}">
    <style>
    .${searchappClass} {
        margin-left: 1.5rem;
        margin-top: 1.5rem;
    }

    legend {
        font-size: 1rem;
    }
    </style>
    <form>
    <legend> Search using <strong>class name </strong> or <strong>teacher name</strong></legend>
    <legend>/ to focus, Tab + Enter for first result</legend>
    <input id="${inputbarId}" type="search" autofocus>
    <button type="submit" disabled style="display: none" aria-hidden="true"></button>
    </form>
</div>
`

function main(){
    //the parameter for callback is iterable, if you want to do smth for each mutaition please use for .. of ..
    //doing this for every mutation in record is redundant for now
    const observer = new MutationObserver(injectSearch)
    //GC adds a new <c-wiz> element when you navigate to a new page (part?) of the website.
    //there may or may not be a new <c-wiz> with roomList everytime observer is triggered
    observer.observe(document.querySelector("body"), {childList: true})
}

function injectSearch() {
    //home and archived page will have "roomList"
    let roomListAll = document.querySelectorAll(roomListSelector)
    roomListAll.forEach((roomList) => {
        //see if already have search
        if (roomList.parentElement.querySelector("." + searchappClass) !== null) {
            return
        }
        
        roomList.insertAdjacentHTML("beforebegin", html)  
        let searchBar = roomList.parentElement.querySelector("#" + inputbarId)

        document.addEventListener("keyup", (event) => {
            if (event.key == "/") {
                //This checks whether home page is hidden. When creating a new class as teacher,
                //user stays on the same <c-wiz>, but the creation pop-up makes c-wiz have class aria-hidden.
                //pressing / in creation popup will focus the darkened searchbar.
                for (let element = roomList; element !== null; element = element.parentElement) {
                    if (element.tagName === "c-wiz") {
                        if (element.getAttribute("aria-hidden") === "true") {
                            return //Do not focus searchbar
                        }
                    }
                }
                searchBar.focus()
            }

            //Match rooms with input
            let input = searchBar.value.toLowerCase()
            let roomNodes = roomList.querySelectorAll(roomNodeSelector)
            roomNodes.forEach((element) => matchRoom(element, input))
        })
    })  
}

function matchRoom(roomNode, input) {
    let roomName = roomNode.querySelector(roomNameSelector).textContent.toLowerCase()
    let roomTeacherNode = roomNode.querySelector(roomTeacherSelector)
    let roomTeacher = ""
    //roomTeacher does not exist when using as teacher 
    if (roomTeacherNode) {
        roomTeacher = roomTeacherNode.textContent.toLowerCase()
    }

    if (roomName.includes(input) || roomTeacher.includes(input)) {
        roomNode.style.display = 'flex'       
    } else {
        roomNode.style.display = 'none'
    }
}

main()