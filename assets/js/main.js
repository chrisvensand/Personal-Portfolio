"use-strict"

var convo;

// load json file with formless data
window.onload = () => {
    loadJSON("main", res => startConversation(res))
    loadParticles()
}

function startConversation(json) {
    // add callback hooks..
    json.options.submitCallback = onFormlessSubmitted.bind(window);
    json.options.flowStepCallback = onStepCallback.bind(window);
    let md = new MobileDetect(window.navigator.userAgent)
    if (md.mobile()) {
        json.options.hideUserInputOnNoneTextInput = true
    }
    convo = window.cf.ConversationalForm.startTheConversation(json)
    document.getElementById("cf-context").appendChild(convo.el)
}

// Form was submitted/finished
let onFormlessSubmitted = () => {
    convo.addRobotChatResponse("Thanks for chatting!")
}

let onStepCallback = function (dto, success, error) {
    console.log(dto)

    if (!dto.tag._values) {
        console.log("No conditional... continuing")
        success()
        return
    }

    let cond = dto.tag._values[0]
    console.log("Loading branch... " + cond)
    loadBranch(cond, (succ) => {
        if (!succ) {
            error()
        } else {
            success()
        }
    })
}

function loadBranch(branch, callback) {
    loadJSON(branch, (json) => {
        if (!json) {
            callback(false)
        } else {
            console.log(json.tags)
            convo.addTags(json.tags, true)
            callback(true)
        }
    })
}

// Loads JSON chat file
function loadJSON(name, callback) {
    let xhr = new XMLHttpRequest()
    xhr.overrideMimeType('application/json')
    xhr.onload = () => {
        callback(JSON.parse(xhr.responseText))
    }
    xhr.onerror = () => {
        callback(false)
    }

    xhr.open("GET", "assets/json/" + name + ".json")
    xhr.send(null)
}

function loadParticles() {
    particlesJS("particles-js", {
        particles: {
            number: {
            value: 160,
            density: { enable: true, value_area: 946.9921162906311 }
            },
            color: { value: "#004aff" },
            shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" },
            polygon: { nb_sides: 5 },
            image: { src: "img/github.svg", width: 100, height: 100 }
            },
            opacity: {
            value: 0.5,
            random: false,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
            },
            size: {
            value: 3,
            random: true,
            anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
            },
            line_linked: {
            enable: true,
            distance: 150,
            color: "#0069ff",
            opacity: 0.4,
            width: 1
            },
            move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
            onhover: { enable: false, mode: "repulse" },
            onclick: { enable: false, mode: "push" },
            resize: true
            },
            modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
            }
        },
        retina_detect: true
        });    
}
