import { DATA, NOTE } from "./data.js";


function add_note() {
    const note = document.querySelector("#section-0 .note")
    note.innerHTML = ""
    NOTE.forEach(content => {
        const li = document.createElement("li")
        li.innerHTML = content
        note.appendChild(li)
    })

}

function add_toc(parent, id, title) {
    const li = document.createElement("li")
    li.innerHTML = `<li><a href='#section-${id}'>${title}</a></li>`
    parent.appendChild(li)
}

function add_section(data) {
    const section = document.createElement("div")
    section.id = "section-" + data.id
    section.className = "section"

    const previous = document.getElementById("section-" + (data.id - 1))

    const h2 = document.createElement("h2")
    h2.innerHTML = data.title
    section.appendChild(h2)
   
    if (data.description){
        const DESC  = document.createElement("ul");
        data.description.forEach(content => {
            const li = document.createElement("li")
            li.innerHTML = content
            DESC.appendChild(li)
        })
        section.appendChild(DESC)
    }

    const selectContainer = document.createElement("div")
    selectContainer.className = "playlist"

    // --- AJOUT : création du dropdown feature ---

    const selectF = document.createElement("select")
    const defaultOptionF = document.createElement("option")
    defaultOptionF.text = "-- Select a feature --"
    defaultOptionF.disabled = true
    defaultOptionF.selected = true
    selectF.id = "dropdown-feature" + data.id
    selectF.appendChild(defaultOptionF)

    // ajouter les IDs disponibles
    data.content[0].content[0].content.forEach(d => {
        if (!d.hide) {
            const opt = document.createElement("option")
            opt.value = d.feature
            opt.text =  "F" + d.feature
            selectF.appendChild(opt)
        }
    })

    selectContainer.appendChild(selectF)


    // --- AJOUT : création du dropdown bruit ---

    const selectB = document.createElement("select")
    const defaultOptionB = document.createElement("option")
    defaultOptionB.text = "-- Select a snr --"
    defaultOptionB.disabled = true
    defaultOptionB.selected = true
    selectB.id = "dropdown-bruit" + data.id
    selectB.appendChild(defaultOptionB)

    // ajouter les IDs disponibles
    data.content[0].content.forEach(d => {
        if (!d.hide) {
            const opt = document.createElement("option")
            opt.value = d.snr
            opt.text = d.snr + " dB"
            selectB.appendChild(opt)
        }
    })

    selectContainer.appendChild(selectB)


    // --- AJOUT : création du dropdown audio ---
    const selectA = document.createElement("select")
    const defaultOptionA = document.createElement("option")
    defaultOptionA.text = "-- Select an audio --"
    defaultOptionA.disabled = true
    defaultOptionA.selected = true
    selectA.id = "dropdown-audio" + data.id
    selectA.appendChild(defaultOptionA)

    // ajouter les IDs disponibles
    data.content.forEach(d => {
        if (!d.hide) {
            const opt = document.createElement("option")
            opt.value = d.id
            opt.text = d.id + "["+d.gender+"]"
            selectA.appendChild(opt)
        }
    })

    selectContainer.appendChild(selectA)
    section.appendChild(selectContainer)

    function handleSelection() {
        const audioId = selectA.value;
        const snrId = selectB.value;
        const featureId = selectF.value;
    
        // Only trigger when both dropdowns have selections
        if (audioId && snrId && featureId) {
            generateAudioExample(audioId, Number(snrId), Number(featureId));
        }
    }

    selectA.addEventListener("change", handleSelection);
    selectB.addEventListener("change", handleSelection);
    selectF.addEventListener("change", handleSelection);

     // conteneur pour afficher les audios
     const displayDiv = document.createElement("div")
     displayDiv.className = "audio-display"
     section.appendChild(displayDiv)
     // --- fin ajout dropdown ---

    function generateAudioExample(audioId, snrId, featureId) {

        const audioItem = data.content.find(item => item.id === audioId)
        if (!audioItem) return

        const snrItem = audioItem.content.find(item => item.snr === snrId)
        if (!snrItem) return

        const featureItem = snrItem.content.find(item => item.feature === featureId)
        if (!featureItem) return
       

        displayDiv.innerHTML = "" // vider avant d'afficher le nouveau contenu

         // Partie déjà fournie (réutilisée telle quelle)
         const h3 = document.createElement("h3")
         h3.innerHTML = audioItem.id + "["+audioItem.gender+"]"
         displayDiv.appendChild(h3)

         if (audioItem.transcription){
            const p = document.createElement("p")
            let t = audioItem.transcription
            p.innerHTML = `<p><b>Transcription</b>: ${t}</p>`
            displayDiv.appendChild(p)
        }

        const divs = document.createElement("div")
        divs.className = "playlist"

        // Original
        const originalDiv = document.createElement("div")
        originalDiv.className = "labeled-audio labeled-audio2"
        originalDiv.innerHTML = `
            <p class='text text2'>Original</p>
            <audio preload='metadata' controls>
                <source src='${audioItem.path}' type='audio/mpeg'>
            </audio>
        `
        divs.appendChild(originalDiv)
 
        // Compressed without noise
        const compressedDiv = document.createElement("div")
        compressedDiv.className = "labeled-audio labeled-audio2"
        compressedDiv.innerHTML = `
            <p class='text text2'>8 features</p>
            <audio preload='metadata' controls>
                <source src='${audioItem.compressed}' type='audio/mpeg'>
            </audio>
        `
        divs.appendChild(compressedDiv)
        
        const noiseText = "F"+featureItem.feature + " [ "+ snrItem.snr + " dB ]"
        const divNoise = document.createElement("div")
        divNoise.className = "labeled-audio labeled-audio2"
        divNoise.innerHTML = `
            <p class='text text2'>${noiseText}</p>
            <audio preload='metadata' controls>
                <source src='${featureItem.path}' type='audio/mpeg'>
            </audio>
        `
        divs.appendChild(divNoise)
        displayDiv.appendChild(divs)
    }

    const hr = document.createElement("hr")
    previous.after(hr)
    hr.after(section)
}


function clear_sections() {
    const targetSection = document.getElementById("section-0");
    
    if (targetSection) {
        let current = targetSection.nextElementSibling;

        while (current) {
            const next = current.nextElementSibling;

            if (current.id && current.id.toLowerCase().includes("section")) {
                current.remove()
            }

            current = next;
        }
    }
}
function create_content() {
    add_note()
    const toc = document.querySelector("#section-0 .toc")
    toc.innerHTML = ""

    const hrs = document.querySelectorAll("hr")
    hrs.forEach(hr => {
        hr.remove()
    })

    const divs = document.querySelectorAll(".labeled-audio")
    divs.forEach(div => {
        div.remove()
    })

    clear_sections()

    DATA.forEach((d, pos) => {
        d.id = pos+1
        if (!d.hide) {
            add_toc(toc, d.id, d.title)
            add_section(d)
        }
    })

}

document.addEventListener("DOMContentLoaded", function () {
    create_content()
});

