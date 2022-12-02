
function valid(input){
    if (typeof input ==  "number" || input == null || input==undefined){
        return false
    }
    if(typeof input== "string" && input.trim().length==0) return false

    return true
}

function regForName(input){
    let re =/^[\w- ]+$/
    return re.test(input)
}
function regForDate(input){
    let re = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
    return re.test(input)
}
module.exports= {valid, regForName,regForDate} 