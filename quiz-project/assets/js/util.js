function createElement (tagName = 'div', classes = null, attributes = null, text = null, elementFunction) {
    let name = document.createElement(tagName);
    if(text) {
        name.innerHTML = text;
    }

    if(classes && classes.length > 0) {       
        classes.forEach((item) => {
            name.classList.add(item);
        })
    }
    
    if(attributes !== null && Object.keys(attributes.length) > 0){
        for (const [key, value] of Object.entries(attributes)) {
            name.setAttribute(`${key}`, `${value}`);
        }
    }

    if(typeof elementFunction == 'function') {
        elementFunction(name);
    }

    return name;
}

function get(element) {
    return document.querySelector(element);
}